#!/usr/bin/env python3
"""Archive public RoomingKos/Spire listing pages into a local reference pack."""

from __future__ import annotations

import csv
import hashlib
import json
import re
import sys
import time
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import parse_qsl, urlencode, urljoin, urlparse, urlunparse
from urllib.request import Request, urlopen
from xml.etree import ElementTree as ET

from bs4 import BeautifulSoup


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "RoomingKos_collected_info_2026-07-03" / "07_public_web_scrape_2026-07-03"
RAW_DIR = OUT_DIR / "raw_html"
DATA_DIR = OUT_DIR / "data"
SCRAPED_AT = datetime.now().astimezone().isoformat(timespec="seconds")
USER_AGENT = "Mozilla/5.0 (compatible; RoomingKosKaiPublicArchive/1.0)"

SITEMAPS = [
    "https://roomingkos.com.au/sitemap.xml",
    "https://roomingkos.com.au/page-sitemap.xml",
    "https://roomingkos.com.au/properties-sitemap.xml",
    "https://roomingkos.com.au/suburb-sitemap.xml",
]
PROPERTIES_SITEMAP_URL = "https://roomingkos.com.au/properties-sitemap.xml"
SPIRE_URL = "https://www.spireliving.com.au/"
STARREZ_HOST = "roomkos.starrezhousing.com"

ROOMINGKOS_PAGE_URLS = [
    "https://roomingkos.com.au/",
    "https://roomingkos.com.au/home/student-accommodation-2/",
    "https://roomingkos.com.au/rooming-houses/",
    "https://roomingkos.com.au/rooming-houses/clayton/",
    "https://roomingkos.com.au/rooming-houses/chadstone/",
    "https://roomingkos.com.au/rooming-houses/malvern-east/",
    "https://roomingkos.com.au/rooming-houses/other-suburbs/",
    "https://roomingkos.com.au/student-accommodation-swanston/",
    "https://roomingkos.com.au/student-accommodation-dudley/",
    "https://roomingkos.com.au/student-accommodation-spire-apartments/",
    "https://roomingkos.com.au/student-accommodation-acacia/",
    "https://roomingkos.com.au/student-accommodation-marshall-monash/",
    "https://roomingkos.com.au/rooming-house-stay-nicholson/",
    "https://roomingkos.com.au/student-accommodation-johnston-house/",
    SPIRE_URL,
]
BUILDING_PAGE_URLS = [
    "https://roomingkos.com.au/student-accommodation-swanston/",
    "https://roomingkos.com.au/student-accommodation-dudley/",
    "https://roomingkos.com.au/student-accommodation-spire-apartments/",
    "https://roomingkos.com.au/student-accommodation-acacia/",
    "https://roomingkos.com.au/student-accommodation-marshall-monash/",
    "https://roomingkos.com.au/rooming-house-stay-nicholson/",
    "https://roomingkos.com.au/student-accommodation-johnston-house/",
    SPIRE_URL,
]
BUILDING_NAME_OVERRIDES = {
    "https://roomingkos.com.au/student-accommodation-swanston/": "RoomingKos Swanston",
    "https://roomingkos.com.au/student-accommodation-dudley/": "RoomingKos Dudley",
    "https://roomingkos.com.au/student-accommodation-spire-apartments/": "SPIRE by RoomingKos",
    "https://roomingkos.com.au/student-accommodation-acacia/": "Student Sanctuary - Acacia",
    "https://roomingkos.com.au/student-accommodation-marshall-monash/": "Marshall Monash",
    "https://roomingkos.com.au/rooming-house-stay-nicholson/": "Stay Nicholson",
    "https://roomingkos.com.au/student-accommodation-johnston-house/": "Johnston House",
    SPIRE_URL: "Spire Apartments",
}

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
ROOM_HEADING_EXCLUDES = {
    "available rooms",
    "the rooms",
    "rooms at marshall monash",
    "the facilities",
    "the location",
    "property features",
    "property details",
    "cleaning service",
    "community features",
    "maintenance & support",
    "total rooms",
    "total residents",
    "parking",
    "fully inclusive",
    "convenient",
    "rental",
    "no visa",
    "frequently asked",
    "find us on the map",
    "how it works",
    "the process",
    "the perfect space to build your future.",
    "your sanctuary starts here",
}
END_HEADINGS = {
    "property features",
    "the location",
    "scholarship recipient special offer",
    "find us on the map",
    "frequently asked",
    "the rooms",
    "the facilities",
    "about student sanctuary",
    "live the fitzroy life",
}


@dataclass
class Page:
    requested_url: str
    final_url: str
    status: int | None
    content_type: str
    body: str
    raw_path: str
    source_kind: str
    sitemap_lastmod: str = ""
    notes: str = ""


manifest_rows: list[dict[str, object]] = []
pages: dict[str, Page] = {}
image_rows: list[dict[str, str]] = []
starrez_source_rows: list[dict[str, str]] = []


def clean(value: object | None) -> str:
    if value is None:
        return ""
    return re.sub(r"\s+", " ", str(value).replace("\xa0", " ")).strip()


def lines_from_soup(soup: BeautifulSoup) -> list[str]:
    return [line for line in (clean(part) for part in soup.get_text("\n").splitlines()) if line]


def slug_for_url(url: str, suffix: str) -> str:
    parsed = urlparse(url)
    stem = f"{parsed.netloc}{parsed.path}".strip("/") or "index"
    stem = re.sub(r"[^A-Za-z0-9]+", "-", stem).strip("-").lower()
    digest = hashlib.sha1(url.encode("utf-8")).hexdigest()[:10]
    return f"{stem}-{digest}{suffix}"


def raw_folder(kind: str, url: str) -> Path:
    host = urlparse(url).netloc
    if "starrezhousing" in host:
        return RAW_DIR / "starrez"
    if "spireliving" in host:
        return RAW_DIR / "spire"
    if kind == "sitemap":
        return RAW_DIR / "sitemaps"
    return RAW_DIR / "roomingkos"


def sanitize_starrez_html(html: str) -> str:
    soup = BeautifulSoup(html, "lxml")
    for tag in soup.find_all(["input", "meta"]):
        attrs = " ".join(str(value).lower() for value in tag.attrs.values())
        if any(word in attrs for word in ("token", "csrf", "verification")):
            if tag.has_attr("value"):
                tag["value"] = "[redacted-public-form-token]"
            if tag.has_attr("content"):
                tag["content"] = "[redacted-public-form-token]"
    return str(soup)


def fetch(url: str, kind: str, sitemap_lastmod: str = "") -> Page:
    if url in pages:
        return pages[url]

    request = Request(
        url,
        headers={
            "User-Agent": USER_AGENT,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
    )
    status: int | None = None
    final_url = url
    content_type = ""
    raw = b""
    notes = ""
    try:
        with urlopen(request, timeout=30) as response:
            status = response.status
            final_url = response.geturl()
            content_type = response.headers.get("content-type", "")
            raw = response.read()
    except HTTPError as exc:
        status = exc.code
        final_url = exc.geturl()
        content_type = exc.headers.get("content-type", "")
        raw = exc.read()
        notes = clean(f"HTTPError: {exc.reason}")
    except URLError as exc:
        notes = clean(f"URLError: {exc.reason}")
    except Exception as exc:  # noqa: BLE001 - continue archiving other URLs.
        notes = clean(f"{type(exc).__name__}: {exc}")

    encoding = "utf-8"
    match = re.search(r"charset=([^;\s]+)", content_type, re.I)
    if match:
        encoding = match.group(1)
    body = raw.decode(encoding, "replace") if raw else ""

    save_body = body
    if STARREZ_HOST in urlparse(url).netloc or STARREZ_HOST in urlparse(final_url).netloc:
        save_body = sanitize_starrez_html(body)
        notes = clean(f"{notes}; starrez_html_sanitized_no_cookie_storage")

    suffix = ".xml" if "xml" in content_type.lower() or urlparse(url).path.endswith(".xml") else ".html"
    raw_path = ""
    if body:
        path = raw_folder(kind, url) / slug_for_url(url, suffix)
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(save_body, encoding="utf-8")
        raw_path = str(path.relative_to(OUT_DIR))

    page = Page(url, final_url, status, content_type, body, raw_path, kind, sitemap_lastmod, notes)
    pages[url] = page
    manifest_rows.append(
        {
            "source_kind": kind,
            "requested_url": url,
            "final_url": final_url,
            "http_status": status or "",
            "content_type": content_type,
            "bytes": len(raw),
            "raw_path": raw_path,
            "sitemap_lastmod": sitemap_lastmod,
            "fetched_at": SCRAPED_AT,
            "notes": notes,
        }
    )
    time.sleep(0.15)
    return page


def parse_sitemap(url: str) -> list[dict[str, str]]:
    page = fetch(url, "sitemap")
    if not page.body:
        return []
    root = ET.fromstring(page.body.encode("utf-8"))
    ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    rows: list[dict[str, str]] = []
    for node in root.findall(".//s:url", ns):
        loc = node.findtext("s:loc", default="", namespaces=ns)
        lastmod = node.findtext("s:lastmod", default="", namespaces=ns)
        if loc:
            rows.append({"loc": loc, "lastmod": lastmod, "type": "url"})
    for node in root.findall(".//s:sitemap", ns):
        loc = node.findtext("s:loc", default="", namespaces=ns)
        lastmod = node.findtext("s:lastmod", default="", namespaces=ns)
        if loc:
            rows.append({"loc": loc, "lastmod": lastmod, "type": "sitemap"})
    return rows


def soup(page: Page) -> BeautifulSoup:
    return BeautifulSoup(page.body, "lxml")


def heading(page_soup: BeautifulSoup) -> str:
    for name in ("h1", "title"):
        tag = page_soup.find(name)
        if tag:
            value = clean(tag.get_text(" ", strip=True))
            if value:
                return value
    return ""


def price_number(text: str) -> float | None:
    match = re.search(r"\$([0-9][0-9,.]*)", text)
    if not match:
        return None
    try:
        return float(match.group(1).replace(",", ""))
    except ValueError:
        return None


def display_price(value: float | None) -> str:
    if value is None:
        return ""
    return str(int(value)) if value.is_integer() else f"{value:.2f}".rstrip("0").rstrip(".")


def weekly_prices(text: str) -> list[float]:
    prices: list[float] = []
    for match in re.finditer(r"\$[0-9][0-9,.]*\s*(?:per\s+week|/wk|week)", text, re.I):
        value = price_number(match.group(0))
        if value is not None:
            prices.append(value)
    if not prices:
        for match in re.finditer(r"(?:from|rooms from)\s+\$[0-9][0-9,.]*", text, re.I):
            value = price_number(match.group(0))
            if value is not None:
                prices.append(value)
    return prices


def address_from_lines(lines: list[str]) -> str:
    text = "\n".join(lines)
    patterns = [
        r"(\d+\s*[-\u2013]\s*\d+\s+(?:Nicholson|Johnston)\s+(?:Street|St)\s+Fitzroy,?\s+VIC\s+\d{4})",
        r"((?:Unit\s*)?\d+[A-Za-z0-9/\- ]*\s+(?:[A-Za-z]+\s+){0,4}(?:Street|St|Road|Rd|Avenue|Ave|Drive|Dr|Grove|Parade|Court|Ct|Crescent|Cres|Lane|Ln),?\s+[A-Za-z ]+,?\s+VIC\s+\d{4})",
        r"(\d+[A-Za-z0-9/\- ]*\s+(?:Dandenong|Swanston|Dudley)\s+(?:Road|Rd|Street|St),?\s+[A-Za-z ]+(?:\s+VIC\s+\d{4})?)",
    ]
    for pattern in patterns:
        match = re.search(pattern, text, re.I)
        if match:
            return clean(match.group(1))
    return ""


def suburb_postcode(address: str) -> tuple[str, str]:
    for pattern in (r",\s*([A-Za-z ]+)\s+VIC\s+(\d{4})", r"\s([A-Za-z ]+),\s*VIC\s+(\d{4})"):
        match = re.search(pattern, address)
        if match:
            return clean(match.group(1)), match.group(2)
    return "", ""


def status_from_lines(lines: list[str], page_url: str = "", listing_text: str = "") -> str:
    top = "\n".join(lines[:80])
    if "student-accommodation-johnston-house" in page_url or "rooming-house-stay-nicholson" in page_url:
        return "Coming Soon"
    if re.search(r"\bcoming\s+soon\b", top, re.I):
        return "Coming Soon"
    if re.search(r"\bwaitlist\s+now\s+open\b", top, re.I):
        return "Waitlist"
    if re.search(r"\b(bookings?|booking)\s+now\s+open\b", top, re.I):
        return "Available"
    haystack = listing_text or top
    for value in ("Available", "Waitlist", "Coming Soon"):
        if re.search(rf"\b{value}\b", haystack, re.I):
            return value
    return ""


def available_from(text: str) -> str:
    patterns = [
        r"Available\s+from\s+([0-9]{1,2}/[0-9]{1,2}/[0-9]{4})",
        r"Available\s+from\s+([0-9]{1,2}(?:st|nd|rd|th)?\s+[A-Za-z]+\s+[0-9]{4})",
        r"launching\s+([A-Za-z]+,?\s+[0-9]{4})",
        r"launch\s+in\s+([A-Za-z]+\s+[0-9]{4})",
    ]
    for pattern in patterns:
        match = re.search(pattern, text, re.I)
        if match:
            return clean(match.group(1))
    return ""


def starrez_links(page_soup: BeautifulSoup, source_url: str) -> list[dict[str, str]]:
    rows = []
    for anchor in page_soup.find_all("a", href=True):
        href = urljoin(source_url, anchor["href"])
        if STARREZ_HOST in urlparse(href).netloc:
            rows.append({"source_page": source_url, "link_text": clean(anchor.get_text(" ", strip=True)), "url": href})
    return rows


def first_starrez(rows: list[dict[str, str]]) -> str:
    for row in rows:
        if re.search(r"apply|enquire|waitlist|join", row["link_text"], re.I):
            return row["url"]
    return rows[0]["url"] if rows else ""


def collect_images(page_soup: BeautifulSoup, source_url: str) -> None:
    seen: set[tuple[str, str]] = set()

    def add(url: str, alt: str, attr: str) -> None:
        if not url:
            return
        full_url = urljoin(source_url, url)
        key = (source_url, full_url)
        if key in seen:
            return
        seen.add(key)
        image_rows.append({"source_page": source_url, "image_url": full_url, "alt": alt, "attribute": attr})

    for img in page_soup.find_all("img"):
        alt = clean(img.get("alt", ""))
        for attr in ("src", "data-src", "data-lazy-src"):
            add(img.get(attr, ""), alt, attr)
        for part in img.get("srcset", "").split(","):
            add(part.strip().split(" ")[0], alt, "srcset")
    for source in page_soup.find_all("source"):
        for part in source.get("srcset", "").split(","):
            add(part.strip().split(" ")[0], "", "source.srcset")


def listing_cards(page: Page) -> dict[str, dict[str, str]]:
    page_soup = soup(page)
    rows = {}
    for anchor in page_soup.find_all("a", href=True):
        href = urljoin(page.final_url, anchor["href"])
        if "/properties/" not in urlparse(href).path:
            continue
        text = clean(anchor.get_text(" ", strip=True))
        if not text:
            continue
        address = re.sub(r"^(Available from [0-9/]+\s*)", "", text, flags=re.I)
        address = re.sub(r"^(Available|Waitlist|Coming Soon)\s+", "", address, flags=re.I)
        address = re.split(r"\s+Rooms?\s+(?:From|from)\s+\$", address, maxsplit=1)[0]
        rows[href.rstrip("/")] = {
            "source_listing_page": page.final_url,
            "listing_text": text,
            "status": status_from_lines([text], listing_text=text),
            "available_from": available_from(text),
            "price_from_weekly": display_price(price_number(text)),
            "card_address": clean(address),
        }
    return rows


def nearby(lines: list[str]) -> list[dict[str, str]]:
    start = next((idx for idx, line in enumerate(lines) if line.lower() == "the location"), -1)
    if start == -1:
        return []
    rows = []
    for idx in range(start + 1, min(start + 24, len(lines))):
        if re.fullmatch(r"[0-9.]+\s*(?:km|m)", lines[idx], re.I) and idx > start + 1:
            label = lines[idx - 1]
            if label.lower() not in {"the location", "available rooms"}:
                rows.append({"place": label, "distance": lines[idx]})
    return rows


def room_heading(text: str) -> bool:
    value = clean(text)
    lower = value.lower()
    if not value or len(value) > 90 or lower in ROOM_HEADING_EXCLUDES:
        return False
    if lower.startswith("price") or lower.startswith("from $") or "?" in lower:
        return False
    return any(keyword in lower for keyword in ROOM_KEYWORDS)


def feature(block: str, label: str) -> str:
    match = re.search(rf"{re.escape(label)}\s*:\s*([^\n]+)", block, re.I)
    return clean(match.group(1)) if match else ""


def room_description(lines: list[str]) -> str:
    descriptions = []
    skip = (
        "drawings are not to scale",
        "fixed term",
        "fixed-term",
        "lease to",
        "apply now",
        "video tour",
        "see room features",
        "per week",
        "bed type:",
        "bathroom type:",
        "fridge type:",
        "internet:",
        "bills & utilities:",
        "approximate size:",
    )
    for line in lines:
        lower = line.lower()
        if len(line) >= 30 and not any(word in lower for word in skip):
            descriptions.append(line)
            if len(descriptions) == 2:
                break
    return " ".join(descriptions)


def rooms_from_page(page: Page, page_name: str) -> list[dict[str, str]]:
    page_soup = soup(page)
    entries: list[tuple[str, str]] = []
    for tag in page_soup.find_all(["h1", "h2", "h3", "h4", "p", "li", "a"]):
        text = clean(tag.get_text(" ", strip=True))
        if text:
            entries.append((tag.name, text))

    marker = next(
        (
            idx
            for idx, (_, text) in enumerate(entries)
            if any(word in text.lower() for word in ("available rooms", "rooms at", "your sanctuary starts here"))
        ),
        -1,
    )
    candidates = [
        idx
        for idx, (tag, text) in enumerate(entries)
        if idx > marker and tag in {"h2", "h3", "h4"} and room_heading(text)
    ]
    candidate_set = set(candidates)
    rows = []
    seen = set()
    for idx in candidates:
        name = entries[idx][1]
        if name.lower() in seen:
            continue
        seen.add(name.lower())
        block_lines = []
        for j in range(idx + 1, len(entries)):
            tag, text = entries[j]
            if j in candidate_set:
                break
            if tag in {"h2", "h3"} and text.lower() in END_HEADINGS:
                break
            block_lines.append(text)
        block = "\n".join(block_lines)
        prices = weekly_prices(block)
        weekly = min(prices) if prices else None
        lease_lines = [
            clean(match.group(0))
            for match in re.finditer(
                r"(?:Lease\s+to|Fixed[- ]term lease options? available until|Fixed term lease option available until)[^\n.]*[.]?",
                block,
                re.I,
            )
        ]
        feature_bits = []
        for label in ("Bed type", "Bathroom type", "Fridge type", "Internet", "Bills & utilities", "Approximate size"):
            value = feature(block, label)
            if value:
                feature_bits.append(f"{label}: {value}")
        rows.append(
            {
                "property_url": page.final_url,
                "property_name": page_name,
                "room_type": name,
                "weekly_price": display_price(weekly),
                "all_weekly_prices": "; ".join(display_price(price) for price in prices),
                "lease_to": "; ".join(dict.fromkeys(lease_lines)),
                "description": room_description(block_lines),
                "bed_type": feature(block, "Bed type"),
                "bathroom_type": feature(block, "Bathroom type"),
                "fridge_type": feature(block, "Fridge type"),
                "internet": feature(block, "Internet"),
                "bills_utilities": feature(block, "Bills & utilities"),
                "approx_size": feature(block, "Approximate size"),
                "features": "; ".join(feature_bits),
                "scraped_at": SCRAPED_AT,
            }
        )
    return rows


def property_features(lines: list[str]) -> list[str]:
    start = next((idx for idx, line in enumerate(lines) if line.lower() == "property features"), -1)
    if start == -1:
        return []
    rows = []
    for line in lines[start + 1 :]:
        lower = line.lower()
        if lower in {"fully inclusive", "frequently asked", "questions"}:
            break
        if lower in {
            "property details",
            "cleaning service",
            "community features",
            "maintenance & support",
            "total rooms",
            "total residents",
            "parking",
        }:
            continue
        if len(line) <= 80 and not line.startswith("$"):
            rows.append(line)
    return list(dict.fromkeys(rows))


def parse_property(page: Page, listing_index: dict[str, dict[str, str]], starrez_final: dict[str, str]) -> tuple[dict[str, object], list[dict[str, str]]]:
    page_soup = soup(page)
    page_lines = lines_from_soup(page_soup)
    title = heading(page_soup)
    listing = listing_index.get(page.final_url.rstrip("/"), {})
    address = title if re.search(r"\bVIC\s+\d{4}\b", title) else address_from_lines(page_lines[:120])
    suburb, postcode = suburb_postcode(address)
    link_rows = starrez_links(page_soup, page.final_url)
    apply_url = first_starrez(link_rows)
    rooms = rooms_from_page(page, title)
    top = " ".join(page_lines[:120])
    row = {
        "name": title,
        "category": "rooming_house_property",
        "status": listing.get("status") or status_from_lines(page_lines, listing_text=top),
        "address": address,
        "suburb": suburb,
        "postcode": postcode,
        "source_url": page.final_url,
        "price_from_weekly": listing.get("price_from_weekly") or display_price(price_number(top)),
        "available_from": listing.get("available_from") or available_from(top),
        "apply_url": apply_url,
        "starrez_final_url": starrez_final.get(apply_url, ""),
        "nearby": nearby(page_lines),
        "property_features": property_features(page_lines),
        "room_types": rooms,
        "scraped_at": SCRAPED_AT,
    }
    return row, rooms


def parse_building(page: Page, starrez_final: dict[str, str]) -> tuple[dict[str, object], list[dict[str, str]]]:
    page_soup = soup(page)
    page_lines = lines_from_soup(page_soup)
    title = BUILDING_NAME_OVERRIDES.get(page.requested_url.rstrip("/") + "/", heading(page_soup))
    address = address_from_lines(page_lines[:160])
    suburb, postcode = suburb_postcode(address)
    link_rows = starrez_links(page_soup, page.final_url)
    apply_url = first_starrez(link_rows)
    rooms = rooms_from_page(page, title)
    prices = [price_number(room["weekly_price"]) for room in rooms if room.get("weekly_price")]
    prices = [price for price in prices if price is not None]
    top = " ".join(page_lines[:160])
    if "rooming-house-stay-nicholson" in page.final_url or "johnston-house" in page.final_url:
        category = "student_professional_development"
    elif "spireliving.com.au" in page.final_url:
        category = "spire_official_site"
    else:
        category = "student_accommodation_building"
    return (
        {
            "name": title,
            "category": category,
            "status": status_from_lines(page_lines, page.final_url),
            "address": address,
            "suburb": suburb,
            "postcode": postcode,
            "source_url": page.final_url,
            "price_from_weekly": display_price(min(prices)) if prices else display_price(price_number(top)),
            "available_from": available_from(top),
            "apply_url": apply_url,
            "starrez_final_url": starrez_final.get(apply_url, ""),
            "nearby": nearby(page_lines),
            "room_types_count": len(rooms),
            "scraped_at": SCRAPED_AT,
        },
        rooms,
    )


def starrez_rows(starrez_pages: list[Page]) -> list[dict[str, str]]:
    source_pages: dict[str, list[str]] = {}
    link_texts: dict[str, list[str]] = {}
    for row in starrez_source_rows:
        source_pages.setdefault(row["url"], []).append(row["source_page"])
        if row["link_text"]:
            link_texts.setdefault(row["url"], []).append(row["link_text"])
    rows = []
    for page in starrez_pages:
        page_soup = soup(page)
        text = page_soup.get_text(" ", strip=True).lower()
        url_text = f"{page.requested_url} {page.final_url}".lower()
        required = "yes" if any(word in text or word in url_text for word in ("register", "login", "application")) else "unknown"
        rows.append(
            {
                "requested_url": page.requested_url,
                "final_url": page.final_url,
                "http_status": str(page.status or ""),
                "title": heading(page_soup),
                "register_or_login_required": required,
                "source_pages": "; ".join(sorted(set(source_pages.get(page.requested_url, [])))),
                "link_texts": "; ".join(sorted(set(link_texts.get(page.requested_url, [])))),
                "raw_path": page.raw_path,
                "notes": page.notes,
                "scraped_at": SCRAPED_AT,
            }
        )
    return rows


def write_csv(path: Path, rows: list[dict[str, object]], fields: list[str]) -> None:
    delimiter = "\t" if path.suffix == ".tsv" else ","
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields, extrasaction="ignore", delimiter=delimiter)
        writer.writeheader()
        writer.writerows(rows)


def write_json(path: Path, data: object) -> None:
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def markdown_row(values: list[object]) -> str:
    return "| " + " | ".join(str(value).replace("\n", " ") for value in values) + " |"


def write_summary(properties: list[dict[str, object]], buildings: list[dict[str, object]], room_rows: list[dict[str, str]], starrez: list[dict[str, str]]) -> None:
    status_counts: dict[str, int] = {}
    for item in properties:
        status = str(item.get("status") or "Unknown")
        status_counts[status] = status_counts.get(status, 0) + 1
    lines = [
        "# RoomingKos Public Web Scrape Summary",
        "",
        f"Scraped at: `{SCRAPED_AT}`",
        "",
        "## Counts",
        "",
        f"- Rooming-house property pages from sitemap: {len(properties)}",
        f"- Building / official pages normalized: {len(buildings)}",
        f"- Room type rows: {len(room_rows)}",
        f"- StarRez public entrypoint rows: {len(starrez)}",
        f"- Image URL rows: {len(image_rows)}",
        "",
        "## Property Status Counts",
        "",
    ]
    lines.extend(f"- {status}: {count}" for status, count in sorted(status_counts.items()))
    lines.extend(["", "## Buildings", "", markdown_row(["Name", "Status", "Address", "From/wk", "Source"]), markdown_row(["---", "---", "---", "---", "---"])])
    for item in buildings:
        lines.append(markdown_row([item.get("name", ""), item.get("status", ""), item.get("address", ""), item.get("price_from_weekly", ""), item.get("source_url", "")]))
    lines.extend(["", "## Rooming-House Properties", "", markdown_row(["Status", "Address", "From/wk", "Available from", "Rooms"]), markdown_row(["---", "---", "---", "---", "---"])])
    for item in sorted(properties, key=lambda row: str(row.get("address", ""))):
        lines.append(markdown_row([item.get("status", ""), item.get("address", ""), item.get("price_from_weekly", ""), item.get("available_from", ""), len(item.get("room_types", []))]))
    (OUT_DIR / "summary.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


def write_readme(property_count: int, normalized_count: int, starrez_count: int) -> None:
    lines = [
        "# RoomingKos Public Web Scrape Archive",
        "",
        f"Created: {SCRAPED_AT}",
        f"Destination: `{OUT_DIR}`",
        "",
        "This folder archives public RoomingKos and Spire listing information for Kai reference work.",
        "It does not modify the Kai app and it does not include private resident/customer data.",
        "",
        "## Scope",
        "",
        "- RoomingKos public pages and sitemap-indexed rooming-house property pages.",
        "- Spire public marketing page.",
        "- StarRez public Register / Application entry screens linked from official public pages.",
        "",
        "StarRez collection stops at the public first screen. The scraper does not log in, create accounts, submit applications, upload documents, enter personal information, or make payments.",
        "",
        "## Key Files",
        "",
        "- `source_manifest.tsv` - every fetched URL, final URL, status, raw file path, and sitemap lastmod.",
        "- `raw_html/` - fetched HTML/XML snapshots; StarRez form-token values are redacted in saved HTML.",
        "- `data/buildings.json` - normalized student-accommodation/building pages.",
        "- `data/properties.json` and `data/properties.csv` - normalized rooming-house property pages.",
        "- `data/room_types.csv` - extracted room type, price, lease, and feature rows.",
        "- `data/starrez_public_entrypoints.csv` - Apply/Enquire links and first-screen status.",
        "- `image_url_manifest.csv` - image URLs only; images are not downloaded.",
        "- `summary.md` - human-readable rollup.",
        "- `verification_report.md` - integrity and safety checks.",
        "",
        "## Current Run Counts",
        "",
        f"- properties-sitemap URL count: {property_count}",
        f"- normalized property rows: {normalized_count}",
        f"- unique StarRez public entry URLs checked: {starrez_count}",
        "",
        "## Re-run",
        "",
        "```bash",
        "python3 scripts/scrape_roomingkos_public_web.py",
        "```",
    ]
    (OUT_DIR / "README.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


def sample_lines(properties: list[dict[str, object]], buildings: list[dict[str, object]]) -> list[str]:
    checks = [
        ("Swanston", buildings, "name"),
        ("Dudley", buildings, "name"),
        ("Spire", buildings, "name"),
        ("Acacia", buildings, "name"),
        ("Marshall Monash", buildings, "name"),
        ("1/85 Kanooka Grove", properties, "address"),
        ("1/22 Collins Street", properties, "address"),
    ]
    rows = []
    for label, haystack, field in checks:
        pattern = re.sub(r"[^a-z0-9]+", " ", label.lower()).strip()
        found = next((item for item in haystack if pattern in re.sub(r"[^a-z0-9]+", " ", f"{item.get(field, '')} {item.get('source_url', '')}".lower())), None)
        if found:
            rows.append(f"{label}: found ({found.get('name') or found.get('address')}, source={found.get('source_url')})")
        else:
            rows.append(f"{label}: NOT FOUND")
    return rows


def verify(property_count: int, properties: list[dict[str, object]], buildings: list[dict[str, object]], room_rows: list[dict[str, str]], starrez: list[dict[str, str]]) -> bool:
    failures = []
    source_urls = [str(item.get("source_url", "")) for item in properties]
    duplicates = sorted({url for url in source_urls if source_urls.count(url) > 1})
    if property_count != len(properties):
        failures.append(f"properties-sitemap count {property_count} does not match properties.json rows {len(properties)}")
    if any(not url for url in source_urls):
        failures.append("One or more property rows have an empty source_url.")
    if duplicates:
        failures.append(f"Duplicate source_url rows: {duplicates}")
    try:
        json.loads((DATA_DIR / "properties.json").read_text(encoding="utf-8"))
        json.loads((DATA_DIR / "buildings.json").read_text(encoding="utf-8"))
    except Exception as exc:  # noqa: BLE001
        failures.append(f"JSON parse check failed: {exc}")

    suspicious_patterns = [r"sk-[A-Za-z0-9]{20,}", r"BEGIN PRIVATE KEY", r"Set-Cookie:", r"refresh_token", r"access_token", r"DATABASE_URL="]
    suspicious_hits = []
    for path in OUT_DIR.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in {".md", ".tsv", ".csv", ".json", ".html", ".xml"}:
            continue
        text = path.read_text(encoding="utf-8", errors="ignore")
        for pattern in suspicious_patterns:
            if re.search(pattern, text, re.I):
                suspicious_hits.append(f"{path.relative_to(OUT_DIR)} matches {pattern}")
    if suspicious_hits:
        failures.append("Suspicious private-secret patterns found: " + "; ".join(suspicious_hits))

    lines = [
        "# Verification Report",
        "",
        f"Verified at: `{SCRAPED_AT}`",
        "",
        "## Integrity",
        "",
        f"- properties-sitemap count: {property_count}",
        f"- properties.json rows: {len(properties)}",
        f"- buildings.json rows: {len(buildings)}",
        f"- room_types.csv rows: {len(room_rows)}",
        f"- StarRez entry rows: {len(starrez)}",
        f"- source_url empty rows: {sum(1 for url in source_urls if not url)}",
        f"- duplicate source_url rows: {len(duplicates)}",
        "",
        "## Sample Checks",
        "",
    ]
    lines.extend(f"- {line}" for line in sample_lines(properties, buildings))
    lines.extend(
        [
            "",
            "## Safety",
            "",
            "- No cookie jar or browser profile is created.",
            "- StarRez saved HTML has public form-token values redacted.",
            "- Public StarRez URL parameters from official links are preserved for provenance.",
            "- No login, account creation, application submission, upload, personal-data entry, or payment step is performed.",
            "",
            "## Result",
            "",
            "FAILED" if failures else "PASSED",
        ]
    )
    lines.extend(f"- {failure}" for failure in failures)
    (OUT_DIR / "verification_report.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    return not failures


def main() -> int:
    for folder in [OUT_DIR, DATA_DIR, RAW_DIR / "roomingkos", RAW_DIR / "spire", RAW_DIR / "starrez", RAW_DIR / "sitemaps"]:
        folder.mkdir(parents=True, exist_ok=True)

    property_items: list[dict[str, str]] = []
    for sitemap_url in SITEMAPS:
        items = parse_sitemap(sitemap_url)
        if sitemap_url == PROPERTIES_SITEMAP_URL:
            property_items = [item for item in items if item["type"] == "url"]
    property_lastmod = {item["loc"].rstrip("/"): item.get("lastmod", "") for item in property_items}
    property_urls = sorted(property_lastmod)

    public_pages = [fetch(url, "spire_page" if "spireliving" in url else "roomingkos_page") for url in ROOMINGKOS_PAGE_URLS]
    property_pages = [fetch(url, "property_page", property_lastmod.get(url, "")) for url in property_urls]

    listing_index: dict[str, dict[str, str]] = {}
    for page in public_pages:
        if page.source_kind == "roomingkos_page":
            listing_index.update(listing_cards(page))
    for page in public_pages + property_pages:
        page_soup = soup(page)
        collect_images(page_soup, page.final_url)
        starrez_source_rows.extend(starrez_links(page_soup, page.final_url))

    unique_starrez_urls = sorted({row["url"] for row in starrez_source_rows})
    starrez_pages = [fetch(url, "starrez_entry") for url in unique_starrez_urls]
    starrez_final = {page.requested_url: page.final_url for page in starrez_pages}
    starrez = starrez_rows(starrez_pages)

    buildings: list[dict[str, object]] = []
    room_rows: list[dict[str, str]] = []
    for url in BUILDING_PAGE_URLS:
        building, rooms = parse_building(pages[url], starrez_final)
        buildings.append(building)
        room_rows.extend(rooms)

    properties: list[dict[str, object]] = []
    for page in property_pages:
        prop, rooms = parse_property(page, listing_index, starrez_final)
        properties.append(prop)
        room_rows.extend(rooms)

    property_csv_rows = [
        {
            "name": item.get("name", ""),
            "category": item.get("category", ""),
            "status": item.get("status", ""),
            "address": item.get("address", ""),
            "suburb": item.get("suburb", ""),
            "postcode": item.get("postcode", ""),
            "source_url": item.get("source_url", ""),
            "price_from_weekly": item.get("price_from_weekly", ""),
            "available_from": item.get("available_from", ""),
            "apply_url": item.get("apply_url", ""),
            "starrez_final_url": item.get("starrez_final_url", ""),
            "room_types_count": len(item.get("room_types", [])),
            "scraped_at": item.get("scraped_at", ""),
        }
        for item in properties
    ]

    write_json(DATA_DIR / "properties.json", properties)
    write_json(DATA_DIR / "buildings.json", buildings)
    write_csv(DATA_DIR / "properties.csv", property_csv_rows, ["name", "category", "status", "address", "suburb", "postcode", "source_url", "price_from_weekly", "available_from", "apply_url", "starrez_final_url", "room_types_count", "scraped_at"])
    write_csv(DATA_DIR / "room_types.csv", room_rows, ["property_url", "property_name", "room_type", "weekly_price", "all_weekly_prices", "lease_to", "description", "bed_type", "bathroom_type", "fridge_type", "internet", "bills_utilities", "approx_size", "features", "scraped_at"])
    write_csv(DATA_DIR / "starrez_public_entrypoints.csv", starrez, ["requested_url", "final_url", "http_status", "title", "register_or_login_required", "source_pages", "link_texts", "raw_path", "notes", "scraped_at"])
    write_csv(OUT_DIR / "image_url_manifest.csv", image_rows, ["source_page", "image_url", "alt", "attribute"])
    write_csv(OUT_DIR / "source_manifest.tsv", manifest_rows, ["source_kind", "requested_url", "final_url", "http_status", "content_type", "bytes", "raw_path", "sitemap_lastmod", "fetched_at", "notes"])

    write_summary(properties, buildings, room_rows, starrez)
    write_readme(len(property_urls), len(properties), len(starrez))
    ok = verify(len(property_urls), properties, buildings, room_rows, starrez)

    print(f"Output: {OUT_DIR}")
    print(f"Property sitemap URLs: {len(property_urls)}")
    print(f"Properties normalized: {len(properties)}")
    print(f"Buildings normalized: {len(buildings)}")
    print(f"Room type rows: {len(room_rows)}")
    print(f"StarRez URLs checked: {len(starrez)}")
    print(f"Verification: {'PASSED' if ok else 'FAILED'}")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
