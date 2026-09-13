#!/usr/bin/env python3
"""
Generate the Android launcher icons from the app's mark.

The mark mirrors favicon.svg exactly: a white medical cross outlined in the
heartbeat red, on the app's blue. Colours are duplicated here rather than
parsed out of the SVG so a designer can retune the icon independently.

Usage:  python3 scripts/generate-icons.py
Requires: Pillow  (pip install pillow)
"""

import os
from PIL import Image, ImageDraw

BACKGROUND = "#1b63d6"   # matches favicon.svg
CROSS = "#ffffff"
HEARTBEAT = "#c62f22"

SS = 8                   # supersample factor, for clean edges
VB = 64                  # favicon.svg viewBox is 0 0 64 64
STROKE_W = 3             # stroke-width in viewBox units

CROSS_POLYGON = [
    (25, 12), (39, 12), (39, 25), (52, 25), (52, 39), (39, 39),
    (39, 52), (25, 52), (25, 39), (12, 39), (12, 25), (25, 25),
]

RES = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                   "android", "app", "src", "main", "res")

# Android density buckets. Legacy launcher icons are 48dp; adaptive-icon
# layers are a 108dp canvas.
DENSITIES = {"mdpi": 1, "hdpi": 1.5, "xhdpi": 2, "xxhdpi": 3, "xxxhdpi": 4}

# Of the 108dp adaptive canvas only the middle ~66dp is guaranteed visible
# once the launcher applies its mask, so the mark is kept inside that.
ADAPTIVE_SAFE = 66 / 108


def draw_mark(draw, cx, cy, scale):
    def pt(p):
        return (cx + (p[0] - VB / 2) * scale, cy + (p[1] - VB / 2) * scale)

    pts = [pt(p) for p in CROSS_POLYGON]
    draw.polygon(pts, fill=CROSS)
    w = max(1, int(round(STROKE_W * scale)))
    draw.line(pts + [pts[0]], fill=HEARTBEAT, width=w, joint="curve")
    r = w / 2
    for x, y in pts:                       # emulate stroke-linejoin="round"
        draw.ellipse([x - r, y - r, x + r, y + r], fill=HEARTBEAT)


def render(size, shape, mark_fraction):
    px = size * SS
    img = Image.new("RGBA", (px, px), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    if shape == "rounded":
        draw.rounded_rectangle([0, 0, px - 1, px - 1], radius=px * 14 / VB, fill=BACKGROUND)
    elif shape == "circle":
        draw.ellipse([0, 0, px - 1, px - 1], fill=BACKGROUND)
    elif shape == "square":
        draw.rectangle([0, 0, px - 1, px - 1], fill=BACKGROUND)
    # "none" leaves the layer transparent: the adaptive foreground draws only
    # the mark, because the launcher composites it over @color/ic_launcher_background.

    draw_mark(draw, px / 2, px / 2, (px / VB) * mark_fraction)
    return img.resize((size, size), Image.LANCZOS)


def main():
    written = 0
    for density, factor in DENSITIES.items():
        out = os.path.join(RES, f"mipmap-{density}")
        os.makedirs(out, exist_ok=True)

        legacy = int(round(48 * factor))       # pre-API-26 launcher icon
        adaptive = int(round(108 * factor))    # adaptive-icon layer canvas

        targets = [
            ("ic_launcher.png",            render(legacy, "rounded", 1.0)),
            ("ic_launcher_round.png",      render(legacy, "circle", 0.82)),
            ("ic_launcher_foreground.png", render(adaptive, "none", ADAPTIVE_SAFE)),
        ]
        for name, img in targets:
            img.save(os.path.join(out, name), "PNG", optimize=True)
            written += 1
        print(f"  mipmap-{density:<8} legacy {legacy}px, adaptive {adaptive}px")

    # Background layer colour for the adaptive icon.
    with open(os.path.join(RES, "values", "ic_launcher_background.xml"), "w") as fh:
        fh.write('<?xml version="1.0" encoding="utf-8"?>\n'
                 "<resources>\n"
                 f'    <color name="ic_launcher_background">{BACKGROUND}</color>\n'
                 "</resources>\n")

    # 512x512 square icon for the Play Console listing (not bundled in the APK).
    store = os.path.join(os.path.dirname(RES), "..", "..", "..", "play-store-icon.png")
    render(512, "square", 1.0).save(os.path.abspath(store), "PNG", optimize=True)

    print(f"\n{written} icons + background colour + play-store-icon.png")


if __name__ == "__main__":
    main()
