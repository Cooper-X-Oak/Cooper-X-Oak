from math import cos, pi, sin
from pathlib import Path
from random import Random

from PIL import Image, ImageChops, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
BASE_POSTER = ROOT / "assets" / "spring-hero-poster-final.png"
OUT_PNG = ROOT / "assets" / "spring-hero-poster-premium.png"
OUT_GIF = ROOT / "assets" / "spring-hero-poster-premium.gif"


def lerp(a: float, b: float, t: float) -> float:
    return a + (b - a) * t


def add_border(draw: ImageDraw.ImageDraw, box, radius, color, width):
    draw.rounded_rectangle(box, radius=radius, outline=color, width=width)


def base_enhancement(img: Image.Image) -> Image.Image:
    w, h = img.size
    base = img.convert("RGBA")

    frame = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    fdraw = ImageDraw.Draw(frame)
    add_border(fdraw, (10, 10, w - 10, h - 10), 26, (128, 180, 255, 180), 3)
    add_border(fdraw, (24, 24, w - 24, h - 24), 22, (255, 178, 224, 84), 2)
    frame = frame.filter(ImageFilter.GaussianBlur(0.3))
    base = Image.alpha_composite(base, frame)

    vignette = Image.new("L", (w, h), 0)
    vdraw = ImageDraw.Draw(vignette)
    vdraw.ellipse((-220, -120, w + 220, h + 160), fill=170)
    vignette = ImageChops.invert(vignette).filter(ImageFilter.GaussianBlur(88))
    base = Image.composite(Image.new("RGBA", (w, h), (7, 11, 20, 255)), base, vignette)

    bloom = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    bdraw = ImageDraw.Draw(bloom)
    for radius, alpha in ((360, 34), (260, 48), (180, 60), (90, 84)):
        bdraw.ellipse((w - radius * 1.35, -radius * 0.45, w + radius * 0.55, radius * 1.25), fill=(255, 245, 198, alpha))
    bdraw.polygon(
        [
            (820, 60),
            (1250, 0),
            (1280, 90),
            (970, 170),
        ],
        fill=(255, 243, 196, 38),
    )
    bloom = bloom.filter(ImageFilter.GaussianBlur(28))
    base = Image.alpha_composite(base, bloom)

    foreground = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    fgd = ImageDraw.Draw(foreground)
    for x in range(0, w, 46):
        height = 26 + int(14 * sin(x / 60))
        color = (59 + (x % 80), 141 + (x % 40), 72 + (x % 20), 255)
        fgd.rectangle((x, h - height, x + 8, h), fill=color)
        if x % 92 == 0:
            fgd.ellipse((x - 3, h - height - 10, x + 10, h - height + 3), fill=(255, 188, 214, 245))
            fgd.ellipse((x + 6, h - height - 12, x + 19, h - height + 1), fill=(255, 244, 217, 225))
    foreground = foreground.filter(ImageFilter.GaussianBlur(0.35))
    base = Image.alpha_composite(base, foreground)

    title_fx = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    tdraw = ImageDraw.Draw(title_fx)
    tdraw.rectangle((44, 42, 300, 80), outline=(130, 193, 255, 88), width=2)
    tdraw.rectangle((66, 612, 440, 656), outline=(255, 184, 229, 92), width=2)
    title_fx = title_fx.filter(ImageFilter.GaussianBlur(0.4))
    base = Image.alpha_composite(base, title_fx)

    return base


def draw_petal(draw: ImageDraw.ImageDraw, x: float, y: float, size: float, angle: float, fill):
    pts = []
    for idx in range(12):
        t = 2 * pi * idx / 12
        rx = size * 0.58 * cos(t)
        ry = size * 0.30 * sin(t)
        px = rx * cos(angle) - ry * sin(angle)
        py = rx * sin(angle) + ry * cos(angle)
        pts.append((x + px, y + py))
    draw.polygon(pts, fill=fill)


def petal_specs():
    rng = Random(240424)
    specs = []
    for idx in range(24):
        specs.append(
            {
                "x": rng.uniform(-0.08, 1.08),
                "y": rng.uniform(-0.05, 0.92),
                "dx": rng.uniform(0.015, 0.055),
                "dy": rng.uniform(0.008, 0.028),
                "amp": rng.uniform(8, 28),
                "size": rng.uniform(7, 22),
                "phase": rng.uniform(0, 2 * pi),
                "spin": rng.uniform(-1.2, 1.2),
                "color": rng.choice(
                    [
                        (255, 198, 219, 212),
                        (255, 228, 194, 190),
                        (255, 242, 226, 180),
                        (253, 166, 206, 214),
                    ]
                ),
            }
        )
    return specs


def sparkle_specs():
    rng = Random(1314)
    specs = []
    for _ in range(16):
        specs.append(
            {
                "x": rng.uniform(0.08, 0.95),
                "y": rng.uniform(0.08, 0.76),
                "phase": rng.uniform(0, 2 * pi),
                "speed": rng.uniform(0.6, 1.9),
                "size": rng.uniform(1.5, 4.5),
            }
        )
    return specs


def frame_with_effects(base: Image.Image, idx: int, total: int, petals, sparkles) -> Image.Image:
    w, h = base.size
    t = idx / total
    frame = base.copy()

    light = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    ldraw = ImageDraw.Draw(light)
    pulse = 0.5 + 0.5 * sin(2 * pi * t)
    sweep_x = lerp(160, 980, (t * 1.2) % 1)
    ldraw.polygon(
        [(sweep_x - 180, 0), (sweep_x - 40, 0), (sweep_x + 120, h), (sweep_x - 20, h)],
        fill=(255, 255, 255, int(22 + 18 * pulse)),
    )
    light = light.filter(ImageFilter.GaussianBlur(24))
    frame = Image.alpha_composite(frame, light)

    particles = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    pdraw = ImageDraw.Draw(particles)

    for spec in petals:
        px = ((spec["x"] + spec["dx"] * idx) % 1.24 - 0.08) * w
        py = ((spec["y"] + spec["dy"] * idx) % 1.12 - 0.06) * h
        sway = sin(2 * pi * t + spec["phase"]) * spec["amp"]
        angle = spec["spin"] * (2 * pi * t) + spec["phase"] * 0.3
        draw_petal(pdraw, px + sway, py, spec["size"], angle, spec["color"])

    for spec in sparkles:
        twinkle = max(0.12, 0.45 + 0.55 * sin(2 * pi * t * spec["speed"] + spec["phase"]))
        r = spec["size"] * twinkle
        px = spec["x"] * w
        py = spec["y"] * h
        alpha = int(22 + 110 * twinkle)
        pdraw.ellipse((px - r, py - r, px + r, py + r), fill=(255, 246, 208, alpha))
        pdraw.line((px - r * 2.4, py, px + r * 2.4, py), fill=(255, 246, 208, alpha))
        pdraw.line((px, py - r * 2.4, px, py + r * 2.4), fill=(255, 246, 208, alpha))

    particles = particles.filter(ImageFilter.GaussianBlur(0.8))
    frame = Image.alpha_composite(frame, particles)

    panel_glow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(panel_glow)
    box = (767, 69, 1218, 571)
    glow = int(64 + 46 * (0.5 + 0.5 * sin(2 * pi * t + 0.8)))
    gdraw.rounded_rectangle(box, radius=34, outline=(102, 184, 255, glow), width=4)
    gdraw.rounded_rectangle((box[0] + 6, box[1] + 6, box[2] - 6, box[3] - 6), radius=28, outline=(255, 173, 220, glow // 2), width=2)
    panel_glow = panel_glow.filter(ImageFilter.GaussianBlur(8))
    frame = Image.alpha_composite(frame, panel_glow)

    return frame


def main():
    base = base_enhancement(Image.open(BASE_POSTER))
    base.save(OUT_PNG)

    petals = petal_specs()
    sparkles = sparkle_specs()
    frames = []
    for idx in range(20):
        frame = frame_with_effects(base, idx, 20, petals, sparkles)
        frames.append(frame.convert("P", palette=Image.ADAPTIVE, colors=255))

    frames[0].save(
        OUT_GIF,
        save_all=True,
        append_images=frames[1:],
        duration=90,
        loop=0,
        optimize=False,
        disposal=2,
    )

    print(OUT_PNG)
    print(OUT_GIF)


if __name__ == "__main__":
    main()
