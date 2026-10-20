"""Generate an original, fictional shaded-relief image for the website demo.

No geographic source data is used. Numpy creates a synthetic heightfield; sharp
encodes the raw pixels. Run from the repository root with Python 3 and numpy.
"""
from pathlib import Path
import json
import subprocess
import tempfile

import numpy as np

ROOT = Path(__file__).resolve().parents[1]
WIDTH, HEIGHT = 1800, 1050
rng = np.random.default_rng(260102)
y, x = np.mgrid[0:HEIGHT, 0:WIDTH].astype(float)
x *= 1200 / WIDTH
y *= 700 / HEIGHT


def noise(px, py, size, seed):
    random = np.random.default_rng(seed)
    cells = random.random((160, 220))
    sx, sy = px / size + 30, py / size + 30
    ix, iy = np.floor(sx).astype(int), np.floor(sy).astype(int)
    fx, fy = sx - ix, sy - iy
    fx = fx * fx * (3 - 2 * fx)
    fy = fy * fy * (3 - 2 * fy)
    a = cells[iy % 160, ix % 220]
    b = cells[iy % 160, (ix + 1) % 220]
    c = cells[(iy + 1) % 160, ix % 220]
    d = cells[(iy + 1) % 160, (ix + 1) % 220]
    return (a * (1 - fx) + b * fx) * (1 - fy) + (c * (1 - fx) + d * fx) * fy


# Domain-warped ridges create connected folds rather than round "hill blobs".
warp_x = x + 110 * (noise(x, y, 160, 10) - .5)
warp_y = y + 85 * (noise(x, y, 140, 20) - .5)
u = warp_x * .76 + warp_y * .65
v = -warp_x * .65 + warp_y * .76
elevation = np.zeros_like(x)
weight = np.ones_like(x)
for octave, size in enumerate((240, 120, 60, 30, 15, 7.5, 3.75)):
    ridge = 1 - np.abs(2 * noise(u * .85, v * 1.65, size, octave + 90) - 1)
    ridge *= ridge
    elevation += ridge * weight * (.56 ** octave)
    weight = np.clip(ridge * 1.8, .1, 1)

# A broad rural basin traverses the west and centre. More elevated ground sits
# along the northern edge and the eastern escarpment.
valley_axis = 365 + 45 * np.sin(x / 180) - .16 * x
valley = np.exp(-((y - valley_axis) / 165) ** 2)
west_basin = np.exp(-((x - 290) / 370) ** 2 - ((y - 410) / 250) ** 2)
mountain_mask = np.clip(1 - valley * .70 - west_basin * .40, .14, 1)
elevation = elevation * mountain_mask + .11 * noise(x, y, 310, 30)
elevation += .22 * np.exp(-((x - 1030) / 210) ** 2)
dy, dx = np.gradient(elevation, 700 / HEIGHT, 1200 / WIDTH)
nx, ny, nz = -dx * 70, -dy * 70, np.ones_like(dx)
norm = np.sqrt(nx * nx + ny * ny + nz * nz)
light = (nx * -.55 + ny * -.61 + nz * .57) / norm
ambient = .58 + .42 * np.clip(light, -.2, 1)

macro = noise(x, y, 43, 201)
fine = noise(x, y, 2.2, 202)
grain = rng.normal(0, 1, x.shape)
gray = 36 + 43 * ambient + 7 * elevation + (macro - .5) * 8
gray += (fine - .5) * 4 + grain * .65

# Woodland follows the uplands, with narrow belts around the lower fields.
woods = noise(warp_x, warp_y, 65, 220)
forest = np.clip((woods + mountain_mask * .23 - .55) * 4, 0, 1)
canopy = noise(x, y, 1.5, 222) + .5 * noise(x, y, 3.5, 223)
gray -= forest * (8 + 5 * canopy)
gray += forest * (canopy - .75) * 7


def polygon_mask(points):
    inside = np.zeros_like(x, dtype=bool)
    px, py = points[-1]
    for qx, qy in points:
        cross = ((py > y) != (qy > y)) & (x < (qx - px) * (y - py) / (qy - py + 1e-8) + px)
        inside ^= cross
        px, py = qx, qy
    return inside


FIELDS = [
    [(30, 220), (145, 219), (165, 273), (57, 290)],
    [(35, 299), (164, 283), (172, 313), (22, 330)],
    [(51, 360), (155, 346), (177, 410), (57, 429)],
    [(65, 439), (180, 420), (205, 474), (75, 491)],
    [(91, 504), (211, 482), (247, 506), (144, 544)],
    [(255, 89), (347, 102), (334, 156), (286, 147)],
    [(343, 102), (434, 119), (418, 167), (338, 157)],
    [(439, 122), (538, 143), (521, 184), (423, 169)],
    [(308, 341), (356, 326), (384, 364), (337, 393)],
    [(274, 382), (330, 399), (299, 442), (236, 469)],
    [(351, 435), (408, 400), (450, 454), (392, 490)],
    [(403, 499), (456, 465), (506, 511), (452, 546)],
    [(471, 552), (514, 520), (572, 555), (537, 602)],
    [(576, 371), (655, 350), (681, 407), (602, 427)],
    [(609, 440), (685, 416), (708, 468), (640, 487)],
    [(647, 494), (713, 480), (740, 530), (688, 545)],
    [(765, 134), (838, 152), (820, 206), (755, 188)],
    [(960, 215), (1064, 177), (1093, 230), (987, 273)],
    [(994, 281), (1097, 243), (1120, 289), (1023, 326)],
    [(1018, 361), (1129, 405), (1104, 448), (993, 401)],
    [(821, 477), (902, 521), (876, 567), (798, 524)],
    [(928, 591), (1035, 624), (1018, 671), (907, 633)],
    [(1064, 626), (1175, 659), (1161, 699), (1042, 676)],
]
for index, points in enumerate(FIELDS):
    mask = polygon_mask(points)
    # Restrained cultivated rows with varied soil brightness.
    angle = (index % 4) * .16 - .3
    rows = np.sin((x * np.cos(angle) + y * np.sin(angle)) * 2.6)
    shade = (index % 5 - 2) * 2.4
    gray[mask] = gray[mask] * .76 + 15 + shade + rows[mask] * .7

gray = np.clip(gray, 23, 101)
# Near-neutral graphite terrain; no green tint competing with status symbols.
rgb = np.stack([gray * .98, gray, gray * 1.005], axis=-1).astype(np.uint8)
output = ROOT / "public/media/ground-relief.webp"
with tempfile.TemporaryDirectory(prefix="ground-relief-") as directory:
    raw = Path(directory) / "terrain.rgb"
    raw.write_bytes(rgb.tobytes())
    js = (
        "const sharp=require('sharp'),fs=require('node:fs');"
        f"sharp(fs.readFileSync({json.dumps(str(raw))}),{{raw:{{width:{WIDTH},height:{HEIGHT},channels:3}}}})"
        f".webp({{quality:82,effort:6}}).toFile({json.dumps(str(output))});"
    )
    subprocess.run(["node", "-e", js], cwd=ROOT, check=True)
print(f"{output}: {output.stat().st_size:,} bytes")
