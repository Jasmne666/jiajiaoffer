import json
import os
import shutil
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
SRC = Path(os.environ.get("PORTFOLIO_SRC", r"C:\Users\r3127\Desktop\作品集"))
OUT = ROOT / "assets"
TMP = ROOT / ".cache"


@dataclass(frozen=True)
class ImageItem:
    src: str
    title: str
    category: str
    group: str
    featured: bool = False


@dataclass(frozen=True)
class VideoItem:
    src: str
    title: str
    category: str
    note: str
    poster_src: str | None = None


@dataclass(frozen=True)
class AudioItem:
    src: str
    title: str
    brand: str


@dataclass(frozen=True)
class DocItem:
    src: str
    title: str
    kind: str
    note: str


IMAGES = [
    ImageItem("运营作品/小红书封面.jpg", "小红书账号主页", "运营作品", "自媒体运营", True),
    ImageItem("推文作品/寒招推文/寒招推文1.png", "深圳大学寒招推文 01", "推文作品", "校园寒招推文", True),
    ImageItem("推文作品/寒招推文/寒招推文2.png", "深圳大学寒招推文 02", "推文作品", "校园寒招推文"),
    ImageItem("推文作品/寒招推文/寒招3.png", "深圳大学寒招推文 03", "推文作品", "校园寒招推文"),
    ImageItem("推文作品/cnad推文作品/推文作品1.png", "CNAD 活动推文 01", "推文作品", "CNAD 推文作品", True),
    ImageItem("推文作品/cnad推文作品/推文作品2.png", "CNAD 活动推文 02", "推文作品", "CNAD 推文作品"),
    ImageItem("推文作品/cnad推文作品/推文作品3.png", "CNAD 活动推文 03", "推文作品", "CNAD 推文作品"),
    ImageItem("推文作品/cnad推文作品/推文作品4.png", "CNAD 活动推文 04", "推文作品", "CNAD 推文作品"),
    ImageItem("物料设计/海报1.png", "节日主题海报", "物料设计", "海报作品"),
    ImageItem("物料设计/海报2.png", "饮品主题海报", "物料设计", "海报作品", True),
    ImageItem("物料设计/海报3.png", "音乐节主题海报", "物料设计", "海报作品"),
    ImageItem("物料设计/海报4.png", "公益主题海报", "物料设计", "海报作品"),
    ImageItem("物料设计/CNAD活动物料/活动海报.png", "CNAD 活动海报", "物料设计", "CNAD 活动物料", True),
    ImageItem("物料设计/CNAD活动物料/活动物料1.png", "CNAD 活动物料 01", "物料设计", "CNAD 活动物料"),
    ImageItem("物料设计/CNAD活动物料/活动物料2.png", "CNAD 活动物料 02", "物料设计", "CNAD 活动物料"),
    ImageItem("物料设计/CNAD活动物料/活动物料3.png", "CNAD 活动物料 03", "物料设计", "CNAD 活动物料"),
    ImageItem("物料设计/雀巢商赛/ui设计.png", "雀巢商赛 UI 方案 01", "物料设计", "雀巢商赛"),
    ImageItem("物料设计/雀巢商赛/ui设计2.png", "雀巢商赛 UI 方案 02", "物料设计", "雀巢商赛"),
    ImageItem("物料设计/雀巢商赛/ui设计3.png", "雀巢商赛 UI 方案 03", "物料设计", "雀巢商赛"),
    ImageItem("物料设计/雀巢商赛/包装设计.png", "雀巢商赛包装设计", "物料设计", "雀巢商赛", True),
    ImageItem("物料设计/雀巢商赛/包装设计六视图.png", "包装设计六视图", "物料设计", "雀巢商赛"),
    ImageItem("物料设计/雀巢商赛/包装设计平面图.png", "包装设计平面图 01", "物料设计", "雀巢商赛"),
    ImageItem("物料设计/雀巢商赛/包装设计平面图2.png", "包装设计平面图 02", "物料设计", "雀巢商赛"),
    ImageItem("摄影作品/人像摄影/人像摄影1.png", "人像摄影 01", "摄影作品", "人像摄影", True),
    ImageItem("摄影作品/人像摄影/人像摄影2.png", "人像摄影 02", "摄影作品", "人像摄影"),
    ImageItem("摄影作品/人像摄影/人像摄影3.png", "人像摄影 03", "摄影作品", "人像摄影"),
    ImageItem("摄影作品/人像摄影/人像摄影4.png", "人像摄影 04", "摄影作品", "人像摄影"),
    ImageItem("摄影作品/人像摄影/人像摄影5.png", "人像摄影 05", "摄影作品", "人像摄影"),
    ImageItem("摄影作品/人像摄影/人像摄影6.png", "人像摄影 06", "摄影作品", "人像摄影"),
    ImageItem("摄影作品/人像摄影/人像摄影7.png", "人像摄影 07", "摄影作品", "人像摄影"),
    ImageItem("摄影作品/人像摄影/人像摄影8.png", "人像摄影 08", "摄影作品", "人像摄影"),
    ImageItem("摄影作品/自然风景摄影/摄影1.png", "自然风景摄影 01", "摄影作品", "自然风景摄影", True),
    ImageItem("摄影作品/自然风景摄影/摄影2.png", "自然风景摄影 02", "摄影作品", "自然风景摄影"),
    ImageItem("摄影作品/自然风景摄影/摄影3.png", "自然风景摄影 03", "摄影作品", "自然风景摄影"),
    ImageItem("摄影作品/自然风景摄影/摄影4.png", "自然风景摄影 04", "摄影作品", "自然风景摄影"),
]

HERO_IMAGES = [
    "第一个个人网站用到的视觉素材/个人简历照片1.jpg",
    "第一个个人网站用到的视觉素材/第一页ccd.PNG",
    "第一个个人网站用到的视觉素材/太阳moment.jpg",
]

VIDEOS = [
    VideoItem("视频作品/logo动画视频.mp4", "Logo 动画视频", "视频作品", "动态图形与品牌识别练习"),
    VideoItem("视频作品/《ditto》翻拍.mp4", "《ditto》翻拍", "视频作品", "短片翻拍、分镜执行与后期剪辑"),
    VideoItem("视频作品/建筑师裸辞，在夜宵摊创业之路.mp4", "夜宵摊创业故事采访", "视频作品", "人物采访、纪实叙事与剪辑"),
    VideoItem("视频作品/《酸甜一口，童心一刻》.mp4", "《酸甜一口，童心一刻》", "视频作品", "品牌短片与情绪化表达"),
    VideoItem("ai能力/ai短剧预告片/《烬骨》预告片.mp4", "AI 短剧《烬骨》预告片", "AI 能力", "AI 视频生成、提示词设计与预告片包装"),
]

AUDIO = [
    AudioItem("广播作品/hbn眼霜-咖啡店_20260604_17170602.mp3", "HBN 眼霜 - 咖啡店", "HBN"),
    AudioItem("广播作品/hbn眼霜机器人_20260604_17170649.mp3", "HBN 眼霜 - 机器人", "HBN"),
    AudioItem("广播作品/哇哈哈-月底没钱_20260604_17170707.mp3", "娃哈哈 - 月底没钱", "娃哈哈"),
    AudioItem("广播作品/哇哈哈-毕业照_20260604_17161423.mp3", "娃哈哈 - 毕业照", "娃哈哈"),
    AudioItem("广播作品/纳爱斯-特工_20260604_17161477.mp3", "纳爱斯 - 特工", "纳爱斯"),
    AudioItem("广播作品/纳爱斯-着火篇_20260604_17161536.mp3", "纳爱斯 - 着火篇", "纳爱斯"),
]

DOCS = [
    DocItem("任晨佳个人简历0510.pdf", "任晨佳个人简历", "PDF", "含完整联系方式、教育经历与项目经历"),
    DocItem("策划案作品/大广赛阿里云千问共创计划.pdf", "大广赛阿里云千问共创计划", "PDF", "品牌传播策划案"),
    DocItem("策划案作品/雀巢商赛鲜味周历.pdf", "雀巢商赛鲜味周历", "PDF", "雀巢商赛策划案"),
    DocItem("ai能力/ai短剧预告片/ai提示词.docx", "AI 短剧提示词记录", "DOCX", "提示词、分镜与生成过程记录"),
]


def slug(value: str) -> str:
    result = []
    for ch in value.lower():
        if ch.isascii() and ch.isalnum():
            result.append(ch)
        elif ch in "-_":
            result.append(ch)
        else:
            result.append("-")
    text = "".join(result).strip("-")
    while "--" in text:
        text = text.replace("--", "-")
    return text or "item"


def clean() -> None:
    for path in [OUT, TMP]:
        if path.exists():
            shutil.rmtree(path)
    (OUT / "images" / "thumb").mkdir(parents=True)
    (OUT / "images" / "full").mkdir(parents=True)
    (OUT / "images" / "hero").mkdir(parents=True)
    (OUT / "video").mkdir(parents=True)
    (OUT / "audio").mkdir(parents=True)
    (OUT / "docs").mkdir(parents=True)
    TMP.mkdir(parents=True)


def assert_source() -> None:
    if not SRC.exists():
        raise SystemExit(f"source folder not found: {SRC}")


def resize_image(source: Path, dest: Path, max_edge: int, quality: int = 82) -> tuple[int, int]:
    with Image.open(source) as img:
        img = ImageOps.exif_transpose(img).convert("RGB")
        img.thumbnail((max_edge, max_edge), Image.Resampling.LANCZOS)
        dest.parent.mkdir(parents=True, exist_ok=True)
        img.save(dest, "WEBP", quality=quality, method=6)
        return img.size


def process_images() -> list[dict]:
    items = []
    used: dict[str, int] = {}
    for idx, item in enumerate(IMAGES, 1):
        source = SRC / item.src
        if not source.exists():
            print(f"missing image: {item.src}", file=sys.stderr)
            continue
        base = slug(Path(item.src).stem)
        used[base] = used.get(base, 0) + 1
        name = f"{base}-{used[base]}" if used[base] > 1 else base
        thumb = OUT / "images" / "thumb" / f"{idx:02d}-{name}.webp"
        full = OUT / "images" / "full" / f"{idx:02d}-{name}.webp"
        tw, th = resize_image(source, thumb, 760, 78)
        fw, fh = resize_image(source, full, 1900, 84)
        items.append(
            {
                "title": item.title,
                "category": item.category,
                "group": item.group,
                "featured": item.featured,
                "thumb": thumb.relative_to(ROOT).as_posix(),
                "full": full.relative_to(ROOT).as_posix(),
                "thumbWidth": tw,
                "thumbHeight": th,
                "width": fw,
                "height": fh,
            }
        )
    return items


def process_hero_images() -> dict:
    output = {}
    for idx, rel in enumerate(HERO_IMAGES, 1):
        source = SRC / rel
        if not source.exists():
            print(f"missing hero image: {rel}", file=sys.stderr)
            continue
        dest = OUT / "images" / "hero" / f"hero-{idx}.webp"
        w, h = resize_image(source, dest, 1800, 84)
        output[f"hero{idx}"] = {"src": dest.relative_to(ROOT).as_posix(), "width": w, "height": h}
    return output


def ffmpeg_exe() -> str | None:
    try:
        sys.path.insert(0, str(ROOT / ".codex_tmp" / "py"))
        import imageio_ffmpeg

        return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception:
        return shutil.which("ffmpeg")


def run_ffmpeg(args: list[str]) -> None:
    exe = ffmpeg_exe()
    if not exe:
        raise SystemExit("ffmpeg not found")
    subprocess.run([exe, *args], check=True)


def transcode_video(source: Path, dest: Path, poster: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    poster.parent.mkdir(parents=True, exist_ok=True)
    run_ffmpeg(
        [
            "-y",
            "-i",
            str(source),
            "-vf",
            "scale='min(1280,iw)':-2",
            "-c:v",
            "libx264",
            "-preset",
            "veryfast",
            "-crf",
            "30",
            "-movflags",
            "+faststart",
            "-c:a",
            "aac",
            "-b:a",
            "96k",
            str(dest),
        ]
    )
    run_ffmpeg(
        [
            "-y",
            "-ss",
            "00:00:01",
            "-i",
            str(dest),
            "-frames:v",
            "1",
            "-vf",
            "scale='min(1280,iw)':-2",
            str(TMP / "poster.jpg"),
        ]
    )
    resize_image(TMP / "poster.jpg", poster, 1280, 80)


def process_videos() -> list[dict]:
    items = []
    for idx, item in enumerate(VIDEOS, 1):
        source = SRC / item.src
        if not source.exists():
            print(f"missing video: {item.src}", file=sys.stderr)
            continue
        name = f"{idx:02d}-{slug(item.title)}"
        dest = OUT / "video" / f"{name}.mp4"
        poster = OUT / "video" / f"{name}.webp"
        transcode_video(source, dest, poster)
        items.append(
            {
                "title": item.title,
                "category": item.category,
                "note": item.note,
                "src": dest.relative_to(ROOT).as_posix(),
                "poster": poster.relative_to(ROOT).as_posix(),
                "sizeMb": round(dest.stat().st_size / 1024 / 1024, 1),
            }
        )
    return items


def copy_file(source: Path, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, dest)


def process_audio() -> list[dict]:
    items = []
    for idx, item in enumerate(AUDIO, 1):
        source = SRC / item.src
        if not source.exists():
            print(f"missing audio: {item.src}", file=sys.stderr)
            continue
        dest = OUT / "audio" / f"{idx:02d}-{slug(item.title)}{source.suffix.lower()}"
        copy_file(source, dest)
        items.append(
            {
                "title": item.title,
                "brand": item.brand,
                "src": dest.relative_to(ROOT).as_posix(),
                "sizeMb": round(dest.stat().st_size / 1024 / 1024, 2),
            }
        )
    return items


def process_docs() -> list[dict]:
    items = []
    for idx, item in enumerate(DOCS, 1):
        source = SRC / item.src
        if not source.exists():
            print(f"missing doc: {item.src}", file=sys.stderr)
            continue
        dest = OUT / "docs" / f"{idx:02d}-{slug(item.title)}{source.suffix.lower()}"
        copy_file(source, dest)
        items.append(
            {
                "title": item.title,
                "kind": item.kind,
                "note": item.note,
                "src": dest.relative_to(ROOT).as_posix(),
                "sizeMb": round(dest.stat().st_size / 1024 / 1024, 1),
            }
        )
    return items


def main() -> None:
    assert_source()
    clean()
    manifest = {
        "images": process_images(),
        "hero": process_hero_images(),
        "videos": process_videos(),
        "audio": process_audio(),
        "docs": process_docs(),
    }
    (OUT / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({k: len(v) if isinstance(v, list) else v for k, v in manifest.items()}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
