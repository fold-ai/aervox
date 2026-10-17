"""Boundary tests: no solver calls or real credentials/database required."""
import base64
import hashlib
import hmac
import io
import json
import os
import sys
import time
import unittest
from pathlib import Path
from unittest.mock import patch
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from api._core.httputil import guarded

SECRET = "synthetic-session-secret-for-tests-only"
INTERNAL = "synthetic-internal-token-for-tests-only"


def token(claims=None, algorithm="HS256"):
    encode = lambda obj: base64.urlsafe_b64encode(json.dumps(obj).encode()).decode().rstrip("=")
    header = encode({"alg": algorithm})
    payload = encode(claims or {"sub": "synthetic-operator", "sst": time.time(), "exp": time.time() + 1800})
    signature = base64.urlsafe_b64encode(hmac.new(SECRET.encode(), f"{header}.{payload}".encode(), hashlib.sha256).digest()).decode().rstrip("=")
    return f"{header}.{payload}.{signature}"


class Handler:
    def __init__(self, headers=None):
        self.headers = headers or {}
        self.wfile = io.BytesIO()
        self.sent_headers = {}
        self.status = None
    def send_response(self, status): self.status = status
    def send_header(self, key, value): self.sent_headers[key] = value
    def end_headers(self): pass


class ApiBoundaryTests(unittest.TestCase):
    def run_guard(self, headers=None, error=None):
        handler = Handler(headers)
        called = []
        @guarded
        def endpoint(_):
            called.append(True)
            if error: raise error
        endpoint(handler)
        return handler, called

    @patch.dict(os.environ, {}, clear=True)
    def test_unconfigured_endpoint_is_closed(self):
        handler, called = self.run_guard({"x-actprove-internal": INTERNAL})
        self.assertEqual(handler.status, 401)
        self.assertFalse(called)
        self.assertEqual(handler.sent_headers["Cache-Control"], "no-store")

    @patch.dict(os.environ, {"SESSION_SECRET": SECRET, "INTERNAL_API_TOKEN": INTERNAL}, clear=True)
    def test_valid_access(self):
        for headers in [{"cookie": f"actprove_session={token()}"}, {"x-actprove-internal": INTERNAL}]:
            _, called = self.run_guard(headers)
            self.assertTrue(called)

    @patch.dict(os.environ, {"SESSION_SECRET": SECRET}, clear=True)
    def test_invalid_sessions_do_not_run_endpoint(self):
        invalid = ["broken", token() + "x", token(algorithm="none"), token({"sub": "x", "exp": time.time()-1, "sst": time.time()-10}), token({"sub": "x", "exp": time.time()+1800, "sst": time.time()-43201}), token({"exp": time.time()+1800, "sst": time.time()}), token({"sub": "x", "exp": time.time()+1800, "sst": time.time()+300})]
        for value in invalid:
            handler, called = self.run_guard({"cookie": f"actprove_session={value}"})
            self.assertEqual(handler.status, 401)
            self.assertFalse(called)

    @patch.dict(os.environ, {"INTERNAL_API_TOKEN": INTERNAL}, clear=True)
    def test_error_details_are_not_disclosed(self):
        for error, status in [(ValueError("sensitive-input"), 400), (RuntimeError("synthetic-private-database-url"), 500)]:
            handler, called = self.run_guard({"x-actprove-internal": INTERNAL}, error)
            self.assertTrue(called)
            self.assertEqual(handler.status, status)
            body = handler.wfile.getvalue().decode()
            self.assertNotIn(str(error), body)
            self.assertNotIn("Traceback", body)


if __name__ == "__main__": unittest.main()
