from math import cos, pi, sin
from pathlib import Path
from random import Random

from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
BASE_PATH = ROOT / "assets" / "spring-hero-poster-final.png"
OUT_PATH = ROOT / "assets" / "spring-hero-poster-animated.gif"


def lerp(a: float, b: float, t: float) -> float:
    return a + (b - a) * t


def build_petal_specs(count: int = 18):
    rng = Random(20260424)
    specs = []
    colors = [
        (255, 191, 214),
        (255, 220, 180),
        (255, 234, 213),
        (255, 170, 196),
    ]
    for idx in range(count):
        specs.append(
            {
                "x": rng.uniform(-0.1, 1.1),
                "y": rng.uniform(-0.1, 0.9),
                "dx": rng.uniform(-0.04, 0.08),
                "dy": rng.uniform(0.03, 0.1),
                "size": rng.uniform(10, 24),
                "spin": rng.uniform(0, 2 * pi),
                "phase": rng.uniform(0, 2 * pi),
                "color": colors[idx % len(colors)],
            }
        )
    return specs


def draw_petal(draw: ImageDraw.ImageDraw, cx: float, cy: float, size: float, angle: float, color, alpha: int):
    rx = size * 0.55
    ry = size * 0.28
    points = []
    for i in range(16):
        theta = 2 * pi * i / 16
        px = rx * cos(theta)
        py = ry * sin(theta)
        rot_x = px * cos(angle) - py * sin(angle)
        rot_y = px * sin(angle) + py * cos(angle)
        points.append((cx + rot_x, cy + rot_y))
    draw.polygon(points, fill=(*color, alpha))
    core = size * 0.12
    draw.ellipse((cx - core, cy - core, cx + core, cy + core), fill=(255, 248, 240, min(alpha + 20, 255)))


def make_frame(base: Image.Image, frame_idx: int, frame_count: int, petals, sparkles):
    w, h = base.size
    t = frame_idx / frame_count
    frame = base.copy().convert("RGBA")

    glow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    pulse = 0.5 + 0.5 * sin(2 * pi * t)
    for radius, alpha in ((320, 26), (240, 34), (150, 48)):
        glow_draw.ellipse(
            (
                w - radius * 1.4,
                -radius * 0.45,
                w + radius * 0.6,
                radius * 1.2,
            ),
            fill=(255, 243, 184, int(alpha * (0.65 + 0.35 * pulse))),
        )
    glow = glow.filter(ImageFilter.GaussianBlur(22))
    frame = Image.alpha_composite(frame, glow)

    particles = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(particles)

    for spec in petals:
        px = ((spec["x"] + spec["dx"] * frame_idx) % 1.25 - 0.1) * w
        py = ((spec["y"] + spec["dy"] * frame_idx) % 1.15 - 0.08) * h
        sway = sin(2 * pi * t + spec["phase"]) * 18
        angle = spec["spin"] + t * 2 * pi
        draw_petal(draw, px + sway, py, spec["size"], angle, spec["color"], 148)

    for idx, sparkle in enumerate(sparkles):
        px = sparkle["x"] * w
        py = sparkle["y"] * h
        twinkle = 0.45 + 0.55 * sin(2 * pi * t * sparkle["speed"] + sparkle["phase"])
        r = lerp(1.5, 4.0, twinkle)
        alpha = int(lerp(10, 90, twinkle))
        draw.ellipse((px - r, py - r, px + r, py + r), fill=(255, 248, 214, alpha))
        draw.line((px - r * 2, py, px + r * 2, py), fill=(255, 248, 214, alpha))
        draw.line((px, py - r * 2, px, py + r * 2), fill=(255, 248, 214, alpha))

    particles = particles.filter(ImageFilter.GaussianBlur(0.6))
    frame = Image.alpha_composite(frame, particles)

    panel_glow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    panel_draw = ImageDraw.Draw(panel_glow)
    border_alpha = int(lerp(36, 90, 0.5 + 0.5 * sin(2 * pi * t + 0.7)))
    box = (778, 123, 1212, 555)
    panel_draw.rounded_rectangle(box, radius=28, outline=(138, 208, 255, border_alpha), width=4)
    panel_draw.rounded_rectangle(
        (box[0] - 2, box[1] - 2, box[2] + 2, box[3] + 2),
        radius=30,
        outline=(208, 142, 255, border_alpha // 2),
        width=6,
    )
    panel_glow = panel_glow.filter(ImageFilter.GaussianBlur(6))
    frame = Image.alpha_composite(frame, panel_glow)

    return frame.convert("P", palette=Image.ADAPTIVE, colors=255)


def main():
    base = Image.open(BASE_PATH).convert("RGBA")
    petals = build_petal_specs()
    rng = Random(77)
    sparkles = [
        {
            "x": rng.uniform(0.06, 0.95),
            "y": rng.uniform(0.10, 0.82),
            "speed": rng.uniform(0.8, 1.8),
            "phase": rng.uniform(0, 2 * pi),
        }
        for _ in range(14)
    ]
    frames = [make_frame(base, idx, 18, petals, sparkles) for idx in range(18)]
    frames[0].save(
        OUT_PATH,
        save_all=True,
        append_images=frames[1:],
        duration=90,
        loop=0,
        optimize=False,
        disposal=2,
    )
    print(OUT_PATH)


if __name__ == "__main__":
    main()
