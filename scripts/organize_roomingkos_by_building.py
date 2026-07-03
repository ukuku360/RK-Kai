#!/usr/bin/env python3
"""Reorganize the public RoomingKos scrape into building-name folders."""

from __future__ import annotations

import csv
import json
import re
import shutil
import sys
from datetime import datetime
from pathlib import Path
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "RoomingKos_collected_info_2026-07-03" / "07_public_web_scrape_2026-07-03"
OUT_DIR = ROOT / "RoomingKos_collected_info_2026-07-03" / "08_building_centric_2026-07-04"
DATA_DIR = OUT_DIR / "99_indexes"
ROOMING_HOUSES_FOLDER = "Rooming Houses"
GENERATED_AT = datetime.now().astimezone().isoformat(timespec="seconds")


def clean(value: object | None) -> str:
    if value is None:
        return ""
    return re.sub(r"\s+", " ", str(value).replace("\xa0", " ")).strip()


def slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return slug[:96] or "unknown-building"


def safe_folder_name(value: str) -> str:
    name = clean(value) or "Unknown Building"
    name = name.replace("/", "-").replace("\\", "-")
    name = re.sub(r'[<>:"|?*\x00-\x1f]+', "", name)
    name = re.sub(r"\s+", " ", name).strip(" .")
    return name[:96] or "Unknown Building"


def read_json(path: Path) -> list[dict[str, object]]:
    return json.loads(path.read_text(encoding="utf-8"))


def read_csv(path: Path, delimiter: str = ",") -> list[dict[str, str]]:
    with path.open(encoding="utf-8", newline="") as handle:
        return list(csv.DictReader(handle, delimiter=delimiter))


def write_json(path: Path, data: object) -> None:
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def write_csv(path: Path, rows: list[dict[str, object]], fields: list[str], delimiter: str = ",") -> None:
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields, extrasaction="ignore", delimiter=delimiter)
        writer.writeheader()
        writer.writerows(rows)


def md_row(values: list[object]) -> str:
    return "| " + " | ".join(clean(value).replace("|", "\\|") for value in values) + " |"


def folder_parts_for(item: dict[str, object], source_type: str) -> list[str]:
    if source_type == "rooming_house_property":
        display_name = clean(item.get("address")) or clean(item.get("name")) or clean(item.get("source_url"))
        return [ROOMING_HOUSES_FOLDER, safe_folder_name(display_name)]
    display_name = clean(item.get("name")) or clean(item.get("address")) or clean(item.get("source_url"))
    return [safe_folder_name(display_name)]


def source_matches(source_value: str, target_url: str) -> bool:
    if not source_value or not target_url:
        return False
    source_parts = {clean(part) for part in source_value.split(";")}
    source_parts.add(source_value)
    return target_url in source_parts


def related_starrez_rows(item: dict[str, object], starrez_rows: list[dict[str, str]]) -> list[dict[str, str]]:
    source_url = clean(item.get("source_url"))
    apply_url = clean(item.get("apply_url"))
    final_url = clean(item.get("starrez_final_url"))
    rows = []
    for row in starrez_rows:
        if (
            source_matches(row.get("source_pages", ""), source_url)
            or row.get("requested_url") == apply_url
            or row.get("final_url") == final_url
        ):
            rows.append(row)
    return rows


def related_source_rows(item: dict[str, object], source_rows: list[dict[str, str]], starrez_rows: list[dict[str, str]]) -> list[dict[str, str]]:
    urls = {clean(item.get("source_url")), clean(item.get("apply_url")), clean(item.get("starrez_final_url"))}
    urls.update(row.get("requested_url", "") for row in starrez_rows)
    urls.update(row.get("final_url", "") for row in starrez_rows)
    urls = {url for url in urls if url}
    return [
        row
        for row in source_rows
        if row.get("requested_url") in urls or row.get("final_url") in urls
    ]


def related_images(item: dict[str, object], image_rows: list[dict[str, str]]) -> list[dict[str, str]]:
    source_url = clean(item.get("source_url"))
    return [row for row in image_rows if row.get("source_page") == source_url]


def room_rows_for(item: dict[str, object], global_room_rows: list[dict[str, str]]) -> list[dict[str, str]]:
    source_url = clean(item.get("source_url"))
    embedded = item.get("room_types")
    if isinstance(embedded, list):
        return [dict(row) for row in embedded if isinstance(row, dict) and is_actual_room_type(dict(row))]
    return [row for row in global_room_rows if row.get("property_url") == source_url and is_actual_room_type(row)]


def is_actual_room_type(row: dict[str, object]) -> bool:
    room_type = clean(row.get("room_type")).lower()
    if not room_type:
        return False
    return not re.match(r"^rooms?\s+from\s+\$", room_type)


def one_line_summary(item: dict[str, object], room_count: int, starrez_count: int, image_count: int) -> list[str]:
    return [
        f"- Name: {clean(item.get('name'))}",
        f"- Status: {clean(item.get('status')) or 'Unknown'}",
        f"- Category: {clean(item.get('category'))}",
        f"- Address: {clean(item.get('address')) or 'Not published on source page'}",
        f"- From/wk: {clean(item.get('price_from_weekly')) or 'Not published'}",
        f"- Available from: {clean(item.get('available_from')) or 'Not published'}",
        f"- Source URL: {clean(item.get('source_url'))}",
        f"- Apply / StarRez URL: {clean(item.get('apply_url')) or 'Not published'}",
        f"- Room type rows: {room_count}",
        f"- StarRez public entry rows: {starrez_count}",
        f"- Image URL rows: {image_count}",
    ]


def write_building_readme(
    folder: Path,
    item: dict[str, object],
    branch: str,
    source_type: str,
    rooms: list[dict[str, object]],
    starrez: list[dict[str, str]],
    images: list[dict[str, str]],
    source_rows: list[dict[str, str]],
) -> None:
    nearby = item.get("nearby")
    feature_rows = item.get("property_features")
    lines = [
        f"# {clean(item.get('name'))}",
        "",
        f"Generated: `{GENERATED_AT}`",
        f"Branch: `{branch}`",
        f"Source type: `{source_type}`",
        "",
        "## Building Summary",
        "",
    ]
    lines.extend(one_line_summary(item, len(rooms), len(starrez), len(images)))

    if isinstance(nearby, list) and nearby:
        lines.extend(["", "## Nearby", "", md_row(["Place", "Distance"]), md_row(["---", "---"])])
        for row in nearby:
            if isinstance(row, dict):
                lines.append(md_row([row.get("place", ""), row.get("distance", "")]))

    if isinstance(feature_rows, list) and feature_rows:
        lines.extend(["", "## Property Features", ""])
        lines.extend(f"- {clean(feature)}" for feature in feature_rows if clean(feature))

    lines.extend(["", "## Room Types", ""])
    if rooms:
        lines.extend([md_row(["Room type", "Weekly price", "Lease", "Bed", "Bathroom"]), md_row(["---", "---", "---", "---", "---"])])
        for room in rooms:
            lines.append(
                md_row(
                    [
                        room.get("room_type", ""),
                        room.get("weekly_price", ""),
                        room.get("lease_to", ""),
                        room.get("bed_type", ""),
                        room.get("bathroom_type", ""),
                    ]
                )
            )
    else:
        lines.append("No room type rows were published/extracted for this building.")

    lines.extend(["", "## Local Files", ""])
    for name in ["building.json", "room_types.csv", "starrez_entrypoints.csv", "image_urls.csv", "source_manifest.tsv"]:
        lines.append(f"- `{name}`")

    if source_rows:
        lines.extend(["", "## Raw HTML Pointers", ""])
        for row in source_rows:
            raw_path = clean(row.get("raw_path"))
            if raw_path:
                lines.append(f"- `{raw_path}` from {row.get('requested_url')}")

    folder.joinpath("README.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


def make_building_record(item: dict[str, object], building_id: str, source_type: str, branch: str, folder: Path, rooms: list[dict[str, object]], starrez: list[dict[str, str]], images: list[dict[str, str]]) -> dict[str, object]:
    return {
        "building_id": building_id,
        "source_type": source_type,
        "branch": branch,
        "folder": str(folder.relative_to(OUT_DIR)),
        "name": clean(item.get("name")),
        "category": clean(item.get("category")),
        "status": clean(item.get("status")),
        "address": clean(item.get("address")),
        "suburb": clean(item.get("suburb")),
        "postcode": clean(item.get("postcode")),
        "price_from_weekly": clean(item.get("price_from_weekly")),
        "available_from": clean(item.get("available_from")),
        "source_url": clean(item.get("source_url")),
        "apply_url": clean(item.get("apply_url")),
        "starrez_final_url": clean(item.get("starrez_final_url")),
        "room_types_count": len(rooms),
        "starrez_entry_count": len(starrez),
        "image_url_count": len(images),
        "generated_at": GENERATED_AT,
    }


def write_root_readme(index_rows: list[dict[str, object]]) -> None:
    status_counts: dict[str, int] = {}
    for row in index_rows:
        status = clean(row["status"]) or "Unknown"
        status_counts[status] = status_counts.get(status, 0) + 1

    named_building_rows = [row for row in index_rows if row["source_type"] == "building_page"]
    rooming_house_rows = [row for row in index_rows if row["source_type"] == "rooming_house_property"]

    lines = [
        "# Building-Centered RoomingKos Public Archive",
        "",
        f"Generated: `{GENERATED_AT}`",
        f"Source archive: `{SOURCE_DIR}`",
        "",
        "This folder re-branches the public scrape by the operating structure: named building folders at the root, and one shared Rooming Houses folder containing each house as a subfolder. The original scrape remains unchanged.",
        "",
        "## Folder Layout",
        "",
        "- `<Building Name>/` - one folder per named building page.",
        f"- `{ROOMING_HOUSES_FOLDER}/<House Address>/` - one subfolder per rooming-house property.",
        "- `99_indexes/` - combined JSON/CSV indexes for quick filtering.",
        "",
        "## Counts",
        "",
        f"- Building folders: {len(index_rows)}",
        f"- Named building folders at root: {len(named_building_rows)}",
        f"- Rooming house folders under `{ROOMING_HOUSES_FOLDER}/`: {len(rooming_house_rows)}",
    ]
    lines.extend(["", "## Named Building Folders", ""])
    lines.extend(f"- `{row['folder']}/`" for row in sorted(named_building_rows, key=lambda row: clean(row["folder"])))
    lines.extend(["", f"## `{ROOMING_HOUSES_FOLDER}/`", ""])
    lines.append(f"- Contains {len(rooming_house_rows)} house folders.")
    lines.extend(["", "## Status Counts", ""])
    lines.extend(f"- {status}: {count}" for status, count in sorted(status_counts.items()))
    lines.extend(
        [
            "",
            "## Main Index Files",
            "",
            "- `99_indexes/building_index.csv`",
            "- `99_indexes/building_index.json`",
            "- `99_indexes/room_types_by_building.csv`",
            "- `99_indexes/starrez_by_building.csv`",
            "",
            "## Safety Boundary",
            "",
            "StarRez is represented only as public entrypoint metadata. No login, account creation, application submission, personal data entry, document upload, or payment step is included.",
        ]
    )
    OUT_DIR.joinpath("README.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


def write_verification(index_rows: list[dict[str, object]], room_rows: list[dict[str, object]], starrez_rows: list[dict[str, object]]) -> bool:
    failures = []
    named_building_rows = [row for row in index_rows if row["source_type"] == "building_page"]
    rooming_house_rows = [row for row in index_rows if row["source_type"] == "rooming_house_property"]
    if len(index_rows) != 43:
        failures.append(f"Expected 43 building folders from 8 building pages + 35 rooming-house properties, got {len(index_rows)}.")
    if len(named_building_rows) != 8:
        failures.append(f"Expected 8 named building folders at the root, got {len(named_building_rows)}.")
    if len(rooming_house_rows) != 35:
        failures.append(f"Expected 35 rooming house folders under {ROOMING_HOUSES_FOLDER}, got {len(rooming_house_rows)}.")
    missing_readmes = [row["folder"] for row in index_rows if not OUT_DIR.joinpath(str(row["folder"]), "README.md").exists()]
    if missing_readmes:
        failures.append(f"Missing per-building README files: {missing_readmes[:5]}")
    empty_sources = [row["building_id"] for row in index_rows if not row.get("source_url")]
    if empty_sources:
        failures.append(f"Rows with empty source_url: {empty_sources}")
    nested_named_buildings = [row["folder"] for row in named_building_rows if "/" in str(row["folder"])]
    if nested_named_buildings:
        failures.append(f"Named building folders should be root-level only: {nested_named_buildings[:5]}")
    misplaced_rooming_houses = [
        row["folder"]
        for row in rooming_house_rows
        if not str(row["folder"]).startswith(f"{ROOMING_HOUSES_FOLDER}/") or str(row["folder"]).count("/") != 1
    ]
    if misplaced_rooming_houses:
        failures.append(f"Rooming house folders should be under {ROOMING_HOUSES_FOLDER}/ only: {misplaced_rooming_houses[:5]}")

    lines = [
        "# Building-Centered Verification",
        "",
        f"Verified: `{GENERATED_AT}`",
        "",
        f"- Building index rows: {len(index_rows)}",
        f"- Named building root folders: {len(named_building_rows)}",
        f"- Rooming house subfolders: {len(rooming_house_rows)}",
        f"- Room type index rows: {len(room_rows)}",
        f"- StarRez-by-building rows: {len(starrez_rows)}",
        f"- Per-building README missing count: {len(missing_readmes)}",
        f"- Empty source_url rows: {len(empty_sources)}",
        f"- Misplaced named building folders: {len(nested_named_buildings)}",
        f"- Misplaced rooming house folders: {len(misplaced_rooming_houses)}",
        "",
        "## Result",
        "",
        "FAILED" if failures else "PASSED",
    ]
    lines.extend(f"- {failure}" for failure in failures)
    OUT_DIR.joinpath("verification_report.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    return not failures


def index_sort_key(row: dict[str, object]) -> tuple[int, str]:
    group = 1 if row["source_type"] == "rooming_house_property" else 0
    return (group, clean(row["name"]))


def main() -> int:
    if not SOURCE_DIR.exists():
        print(f"Missing source archive: {SOURCE_DIR}", file=sys.stderr)
        return 1

    if OUT_DIR.exists():
        shutil.rmtree(OUT_DIR)
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    buildings = read_json(SOURCE_DIR / "data" / "buildings.json")
    properties = read_json(SOURCE_DIR / "data" / "properties.json")
    global_room_rows = read_csv(SOURCE_DIR / "data" / "room_types.csv")
    starrez_rows = read_csv(SOURCE_DIR / "data" / "starrez_public_entrypoints.csv")
    image_rows = read_csv(SOURCE_DIR / "image_url_manifest.csv")
    source_rows = read_csv(SOURCE_DIR / "source_manifest.tsv", delimiter="\t")

    items: list[tuple[dict[str, object], str]] = []
    items.extend((item, "building_page") for item in buildings)
    items.extend((item, "rooming_house_property") for item in properties)

    index_rows: list[dict[str, object]] = []
    combined_room_rows: list[dict[str, object]] = []
    combined_starrez_rows: list[dict[str, object]] = []

    used_slugs: set[str] = set()
    used_folder_paths: set[tuple[str, ...]] = set()
    for item, source_type in items:
        display_name = clean(item.get("address")) or clean(item.get("name")) or clean(item.get("source_url"))
        building_id = slugify(display_name)
        if building_id in used_slugs:
            parsed = urlparse(clean(item.get("source_url")))
            building_id = slugify(f"{display_name}-{parsed.path}")
        used_slugs.add(building_id)

        folder_parts = folder_parts_for(item, source_type)
        if tuple(folder_parts) in used_folder_paths:
            parsed = urlparse(clean(item.get("source_url")))
            folder_parts[-1] = safe_folder_name(f"{folder_parts[-1]} {slugify(parsed.path)}")
        used_folder_paths.add(tuple(folder_parts))

        branch = folder_parts[0]
        folder = OUT_DIR.joinpath(*folder_parts)
        folder.mkdir(parents=True, exist_ok=True)

        rooms = room_rows_for(item, global_room_rows)
        related_starrez = related_starrez_rows(item, starrez_rows)
        related_image_rows = related_images(item, image_rows)
        related_sources = related_source_rows(item, source_rows, related_starrez)
        record = make_building_record(item, building_id, source_type, branch, folder, rooms, related_starrez, related_image_rows)

        write_json(folder / "building.json", {"building": item, "building_index_record": record})
        write_csv(folder / "room_types.csv", rooms, list(global_room_rows[0].keys()) if global_room_rows else [])
        write_csv(folder / "starrez_entrypoints.csv", related_starrez, list(starrez_rows[0].keys()) if starrez_rows else [])
        write_csv(folder / "image_urls.csv", related_image_rows, list(image_rows[0].keys()) if image_rows else [])
        write_csv(folder / "source_manifest.tsv", related_sources, list(source_rows[0].keys()) if source_rows else [], delimiter="\t")
        write_building_readme(folder, item, branch, source_type, rooms, related_starrez, related_image_rows, related_sources)

        index_rows.append(record)
        for room in rooms:
            combined_room_rows.append({"building_id": building_id, "building_name": record["name"], "branch": branch, **room})
        for row in related_starrez:
            combined_starrez_rows.append({"building_id": building_id, "building_name": record["name"], "branch": branch, **row})

    index_rows.sort(key=index_sort_key)
    combined_room_rows.sort(key=lambda row: (clean(row["branch"]), clean(row["building_name"]), clean(row.get("room_type"))))
    combined_starrez_rows.sort(key=lambda row: (clean(row["branch"]), clean(row["building_name"]), clean(row.get("requested_url"))))

    index_fields = [
        "building_id",
        "source_type",
        "branch",
        "folder",
        "name",
        "category",
        "status",
        "address",
        "suburb",
        "postcode",
        "price_from_weekly",
        "available_from",
        "source_url",
        "apply_url",
        "starrez_final_url",
        "room_types_count",
        "starrez_entry_count",
        "image_url_count",
        "generated_at",
    ]
    write_csv(DATA_DIR / "building_index.csv", index_rows, index_fields)
    write_json(DATA_DIR / "building_index.json", index_rows)
    room_fields = ["building_id", "building_name", "branch"] + (list(global_room_rows[0].keys()) if global_room_rows else [])
    write_csv(DATA_DIR / "room_types_by_building.csv", combined_room_rows, room_fields)
    starrez_fields = ["building_id", "building_name", "branch"] + (list(starrez_rows[0].keys()) if starrez_rows else [])
    write_csv(DATA_DIR / "starrez_by_building.csv", combined_starrez_rows, starrez_fields)

    write_root_readme(index_rows)
    ok = write_verification(index_rows, combined_room_rows, combined_starrez_rows)

    print(f"Output: {OUT_DIR}")
    print(f"Building folders: {len(index_rows)}")
    print(f"Room type rows: {len(combined_room_rows)}")
    print(f"StarRez-by-building rows: {len(combined_starrez_rows)}")
    print(f"Verification: {'PASSED' if ok else 'FAILED'}")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
