#!/usr/bin/env python3
"""Generate the RoomingKos Kai catalog from the public building-centric archive."""

from __future__ import annotations

import csv
import json
import re
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
ARCHIVE_DIR = (
    ROOT
    / "RoomingKos_collected_info_2026-07-03"
    / "08_building_centric_2026-07-04"
)
INDEX_DIR = ARCHIVE_DIR / "99_indexes"
OUT_PATH = ROOT / "src" / "data" / "roomingkosCatalog.ts"

ROOM_KEYWORDS = (
    "room",
    "studio",
    "ensuite",
    "apartment",
    "single",
    "double",
    "twin",
    "suite",
    "focus",
    "view",
    "excellence",
    "elite",
    "premium",
    "horizon",
    "tandem",
    "ascent",
    "standard",
    "large",
    "small",
)
ROOM_EXCLUDE_PREFIXES = (
    "select your room",
    "secure your room",
    "we help you",
)
ROOM_EXCLUDE_EXACT = {
    "room types",
    "exclusive room pricing:",
    "spire apartments",
}
IMAGE_EXCLUDES = (
    ".svg",
    "logo",
    "logotype",
    "brandmark",
    "icon",
    "_icn",
    "-icn",
    "pricegood",
    "housetick",
    "valid_",
    "visa",
    "send-",
    "filter-",
    "cloud-computing",
    "checked",
    "contract",
    "credit-card",
    "security",
    "quotemark",
    "google-logo",
    "lime-circle",
    "symbol",
    "floorplan",
    "unavailable",
    "feb-12-2026",
)
FALLBACK_IMAGE = "https://roomingkos.com.au/wp-content/uploads/RK_Brandmark_Light.svg"


def clean(value: object | None) -> str:
    if value is None:
        return ""
    return re.sub(r"\s+", " ", str(value).replace("\xa0", " ")).strip()


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open(encoding="utf-8", newline="") as handle:
        return list(csv.DictReader(handle))


def parse_price(value: object | None) -> float | None:
    text = clean(value)
    if not text:
        return None
    match = re.search(r"\d+(?:\.\d+)?", text.replace(",", ""))
    return float(match.group(0)) if match else None


def parse_price_list(value: object | None) -> list[float]:
    prices: list[float] = []
    for part in clean(value).split(";"):
        price = parse_price(part)
        if price is not None:
            prices.append(price)
    return prices


def is_actual_room_type(row: dict[str, str]) -> bool:
    room_type = clean(row.get("room_type"))
    if not room_type:
        return False

    lower = room_type.lower()
    property_name = clean(row.get("property_name")).lower()
    building_name = clean(row.get("building_name")).lower()
    if lower in ROOM_EXCLUDE_EXACT or lower in {property_name, building_name}:
        return False
    if lower.startswith(ROOM_EXCLUDE_PREFIXES):
        return False
    if "exclusive room pricing" in lower:
        return False

    has_room_keyword = any(keyword in lower for keyword in ROOM_KEYWORDS)
    return parse_price(row.get("weekly_price")) is not None and has_room_keyword


def money(value: float) -> str:
    return f"{value:.2f}".rstrip("0").rstrip(".")


def infer_tags(row: dict[str, Any], room_types: list[dict[str, Any]]) -> list[str]:
    tags: list[str] = []

    def add(value: str) -> None:
        value = clean(value)
        if value and value not in tags:
            tags.append(value)

    group = "Rooming house property" if row["source_type"] == "rooming_house_property" else "Building"
    add(group)
    add(clean(row.get("status")))
    add(clean(row.get("suburb")))
    category = clean(row.get("category")).replace("_", " ").title()
    add(category)

    searchable = " ".join(
        [
            clean(row.get("name")),
            clean(row.get("address")),
            " ".join(room["name"] for room in room_types),
            " ".join(room["description"] for room in room_types),
            " ".join(room["leaseTo"] for room in room_types),
        ]
    ).lower()

    if "student" in searchable or "study desk" in searchable:
        add("Study-focused")
    if "wifi" in searchable or "internet" in searchable:
        add("Work from home")
        add("Wifi")
    if "ensuite" in searchable or "bathroom" in searchable:
        add("Private bathroom")
    if "bill" in searchable or "utilities included" in searchable:
        add("Bills included")
    if "air conditioning" in searchable:
        add("Air conditioning")
    if "studio" in searchable:
        add("Studio")
    if "single" in searchable:
        add("Single room")
    if "double" in searchable:
        add("Double room")

    return tags


def make_match_notes(row: dict[str, Any], weekly_from: float | None, room_types: list[dict[str, Any]]) -> list[str]:
    status = clean(row.get("status"))
    notes = []
    if status == "Available":
        notes.append("Currently marked Available in the public RoomingKos catalog")
    elif status == "Waitlist":
        notes.append("Waitlist option for staff follow-up")
    else:
        notes.append("Coming Soon option for future interest")
    if weekly_from is not None:
        notes.append(f"From ${money(weekly_from)}/wk based on public listing data")
    if room_types:
        notes.append(f"{len(room_types)} priced room type{'s' if len(room_types) != 1 else ''} in the public extract")
    if row["source_type"] == "rooming_house_property":
        notes.append("Individual rooming house property, not a grouped building card")
    return notes


def representative_image(folder: str) -> str:
    path = ARCHIVE_DIR / folder / "image_urls.csv"
    if not path.exists():
        return FALLBACK_IMAGE

    rows = read_csv(path)
    urls = [clean(row.get("image_url")) for row in rows if clean(row.get("image_url"))]
    for url in urls:
        lower = url.lower()
        if any(token in lower for token in IMAGE_EXCLUDES):
            continue
        if re.search(r"\.(?:jpe?g|png|webp)(?:\?|$)", lower):
            return url

    for url in urls:
        if ".svg" not in url.lower():
            return url
    return FALLBACK_IMAGE


def build_room_types(room_rows: list[dict[str, str]]) -> list[dict[str, Any]]:
    room_types: list[dict[str, Any]] = []
    seen: set[tuple[str, float | None, str]] = set()
    for row in room_rows:
        if not is_actual_room_type(row):
            continue
        weekly_price = parse_price(row.get("weekly_price"))
        room_type = {
            "name": clean(row.get("room_type")),
            "weeklyPrice": weekly_price,
            "allWeeklyPrices": parse_price_list(row.get("all_weekly_prices")),
            "leaseTo": clean(row.get("lease_to")),
            "description": clean(row.get("description")),
        }
        key = (room_type["name"], weekly_price, room_type["leaseTo"])
        if key in seen:
            continue
        seen.add(key)
        room_types.append(room_type)
    return room_types


def main() -> int:
    index_path = INDEX_DIR / "building_index.json"
    rooms_path = INDEX_DIR / "room_types_by_building.csv"
    if not index_path.exists() or not rooms_path.exists():
        raise SystemExit(f"Missing archive indexes under {INDEX_DIR}")

    index_rows: list[dict[str, Any]] = json.loads(index_path.read_text(encoding="utf-8"))
    room_rows_by_building: dict[str, list[dict[str, str]]] = {}
    for row in read_csv(rooms_path):
        room_rows_by_building.setdefault(clean(row.get("building_id")), []).append(row)

    options: list[dict[str, Any]] = []
    for row in index_rows:
        building_id = clean(row.get("building_id"))
        room_types = build_room_types(room_rows_by_building.get(building_id, []))
        room_prices = [room["weeklyPrice"] for room in room_types if room["weeklyPrice"] is not None]
        listed_price = parse_price(row.get("price_from_weekly"))
        price_candidates = ([listed_price] if listed_price is not None else []) + room_prices
        weekly_from = min(price_candidates) if price_candidates else None
        group = "rooming_house" if row["source_type"] == "rooming_house_property" else "building"
        display_name = clean(row.get("name"))

        option = {
            "id": building_id,
            "group": group,
            "status": clean(row.get("status")),
            "name": clean(row.get("name")),
            "displayName": display_name,
            "suburb": clean(row.get("suburb")),
            "address": clean(row.get("address")),
            "weeklyFrom": weekly_from,
            "availableFrom": clean(row.get("available_from")),
            "roomTypes": room_types,
            "sourceUrl": clean(row.get("source_url")),
            "applyUrl": clean(row.get("apply_url")),
            "imageUrl": representative_image(clean(row.get("folder"))),
            "tags": infer_tags(row, room_types),
            "matchNotes": make_match_notes(row, weekly_from, room_types),
        }
        options.append(option)

    building_count = sum(1 for option in options if option["group"] == "building")
    rooming_house_count = sum(1 for option in options if option["group"] == "rooming_house")
    if len(options) != 43 or building_count != 8 or rooming_house_count != 35:
        raise SystemExit(
            "Catalog verification failed: "
            f"total={len(options)}, building={building_count}, rooming_house={rooming_house_count}"
        )

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    payload = json.dumps(options, ensure_ascii=True, indent=2)
    OUT_PATH.write_text(
        "\n".join(
            [
                "export type RoomStatus = 'Available' | 'Waitlist' | 'Coming Soon'",
                "export type RoomGroup = 'building' | 'rooming_house'",
                "",
                "export type RoomType = {",
                "  name: string",
                "  weeklyPrice: number | null",
                "  allWeeklyPrices: number[]",
                "  leaseTo: string",
                "  description: string",
                "}",
                "",
                "export type RoomingKosOption = {",
                "  id: string",
                "  group: RoomGroup",
                "  status: RoomStatus",
                "  name: string",
                "  displayName: string",
                "  suburb: string",
                "  address: string",
                "  weeklyFrom: number | null",
                "  availableFrom: string",
                "  roomTypes: RoomType[]",
                "  sourceUrl: string",
                "  applyUrl: string",
                "  imageUrl: string",
                "  tags: string[]",
                "  matchNotes: string[]",
                "}",
                "",
                f"export const roomingKosCatalog: RoomingKosOption[] = {payload}",
                "",
            ]
        ),
        encoding="utf-8",
    )

    print(f"Wrote {OUT_PATH}")
    print(f"Catalog count: {len(options)}")
    print(f"Named buildings: {building_count}")
    print(f"Rooming houses: {rooming_house_count}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
