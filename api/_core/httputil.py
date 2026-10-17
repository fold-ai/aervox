"""Small helpers shared by the Vercel handlers."""
from __future__ import annotations

import json
import base64
import hashlib
import hmac
import os
import time
from functools import wraps
from http.cookies import CookieError, SimpleCookie
from http.server import BaseHTTPRequestHandler
from typing import Any, Dict, Optional
from urllib.parse import parse_qs, urlparse

MAX_BODY = 4 * 1024 * 1024


def query(handler: BaseHTTPRequestHandler) -> Dict[str, str]:
    q = parse_qs(urlparse(handler.path).query)
    return {k: v[0] for k, v in q.items() if v}


def read_json(handler: BaseHTTPRequestHandler) -> Dict[str, Any]:
    length = int(handler.headers.get("content-length") or 0)
    if length <= 0:
        return {}
    if length > MAX_BODY:
        raise ValueError(f"request body of {length} bytes exceeds the {MAX_BODY} byte limit")
    raw = handler.rfile.read(length)
    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError as exc:
        raise ValueError(f"request body is not valid JSON: {exc}") from exc
    if not isinstance(parsed, dict):
        raise ValueError("request body must be a JSON object")
    return parsed


def send(handler: BaseHTTPRequestHandler, status: int, payload: Any,
         content_type: str = "application/json", filename: Optional[str] = None) -> None:
    body = payload if isinstance(payload, (bytes, bytearray)) else (
        payload.encode("utf-8") if isinstance(payload, str)
        else json.dumps(payload, allow_nan=False, separators=(",", ":")).encode("utf-8"))
    handler.send_response(status)
    handler.send_header("Content-Type", content_type)
    handler.send_header("Content-Length", str(len(body)))
    handler.send_header("Cache-Control", "no-store")
    if filename:
        handler.send_header("Content-Disposition", f'attachment; filename="{filename}"')
    handler.end_headers()
    handler.wfile.write(body)


def send_error_json(handler: BaseHTTPRequestHandler, status: int, message: str,
                    detail: str = "") -> None:
    send(handler, status, {"ok": False, "error": message, "detail": detail})


def _decode_segment(value: str) -> bytes:
    return base64.b64decode(value + "=" * (-len(value) % 4), altchars=b"-_", validate=True)


def authorized(handler: BaseHTTPRequestHandler) -> bool:
    """Verify access at the function boundary, independently of middleware."""
    internal = os.environ.get("INTERNAL_API_TOKEN", "")
    supplied = handler.headers.get("x-actprove-internal", "")
    if len(internal) >= 24 and hmac.compare_digest(supplied.encode(), internal.encode()):
        return True
    secret = os.environ.get("SESSION_SECRET", "")
    if len(secret) < 32:
        return False
    try:
        cookie = SimpleCookie()
        raw_cookie = handler.headers.get("cookie", "")
        if len(raw_cookie) > 16384:
            return False
        cookie.load(raw_cookie)
        item = cookie.get("actprove_session")
        if not item or len(item.value) > 8192:
            return False
        header, payload, signature = item.value.split(".")
        if json.loads(_decode_segment(header)).get("alg") != "HS256":
            return False
        expected = hmac.new(secret.encode(), f"{header}.{payload}".encode(), hashlib.sha256).digest()
        if not hmac.compare_digest(_decode_segment(signature), expected):
            return False
        claims = json.loads(_decode_segment(payload))
        now = time.time()
        expires, started = claims.get("exp"), claims.get("sst")
        return bool(isinstance(claims.get("sub"), str) and claims["sub"] and
                    type(expires) in (int, float) and type(started) in (int, float) and
                    expires > now and 0 < started <= now + 60 and now - started <= 43200)
    except (ValueError, TypeError, KeyError, AttributeError, CookieError):
        return False


def guarded(fn):
    """Fail closed and keep exception details out of responses and logs."""
    @wraps(fn)
    def wrapper(handler: BaseHTTPRequestHandler):
        if not authorized(handler):
            send_error_json(handler, 401, "Not authenticated.")
            return
        try:
            fn(handler)
        except ValueError:
            send_error_json(handler, 400, "Invalid request.")
        except Exception:                                           # noqa: BLE001
            send_error_json(handler, 500, "Internal server error.")
    return wrapper
