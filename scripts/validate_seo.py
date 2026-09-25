import json
import re
import xml.etree.ElementTree as ET
from pathlib import Path

def test_index_html():
    index_path = Path("index.html")
    assert index_path.exists(), "index.html missing"
    html = index_path.read_text(encoding="utf-8")

    # 1. Canonical tag check
    assert '<link rel="canonical" href="https://cloviswebdesign.com/" />' in html, "Missing canonical link"

    # 2. Geo tags check
    assert '<meta name="geo.region" content="US-CA" />' in html, "Missing geo.region"
    assert '<meta name="geo.placename" content="Clovis" />' in html, "Missing geo.placename"
    assert '<meta name="geo.position" content="36.8252;-119.7029" />' in html, "Missing geo.position"
    assert '<meta name="ICBM" content="36.8252, -119.7029" />' in html, "Missing ICBM"

    # 3. OpenGraph & Twitter tags
    assert '<meta property="og:title"' in html, "Missing og:title"
    assert '<meta property="og:image"' in html, "Missing og:image"
    assert '<meta name="twitter:card"' in html, "Missing twitter:card"

    # 4. JSON-LD check
    match = re.search(r'<script type="application/ld\+json">(.*?)</script>', html, re.DOTALL)
    assert match, "JSON-LD script tag not found"
    data = json.loads(match.group(1).strip())
    assert data["@context"] == "https://schema.org", "Invalid @context"
    graph = data.get("@graph", [])
    assert len(graph) >= 4, f"Expected at least 4 graph entities, got {len(graph)}"

    biz = next((x for x in graph if x.get("@id") == "https://cloviswebdesign.com/#business"), None)
    assert biz is not None, "Business entity missing from @graph"
    assert "ProfessionalService" in biz["@type"], "ProfessionalService missing from @type"
    assert "LocalBusiness" in biz["@type"], "LocalBusiness missing from @type"
    assert biz["name"] == "Clovis Web Design", f"Incorrect business name: {biz.get('name')}"
    assert biz["telephone"] == "+15595753014", f"Incorrect phone: {biz.get('telephone')}"
    assert biz["geo"]["latitude"] == 36.8252, "Latitude mismatch"
    assert biz["geo"]["longitude"] == -119.7029, "Longitude mismatch"
    assert biz["address"]["addressLocality"] == "Clovis", "Address locality mismatch"
    assert biz["address"]["postalCode"] == "93612", "Postal code mismatch"
    assert biz["founder"]["name"] == "Adam Youssef", "Founder mismatch"
    assert len(biz["areaServed"]) >= 6, "Expected at least 6 service areas"
    assert len(biz["hasOfferCatalog"]["itemListElement"]) >= 3, "Expected at least 3 offers"
    assert len(biz["review"]) == 2, "Expected 2 client reviews"
    assert biz["aggregateRating"]["ratingValue"] == "5.0", "Expected 5.0 aggregate rating"

    print("PASS: index.html SEO, Geo, Social & JSON-LD validated perfectly.")

def test_sitemap():
    sitemap_path = Path("public/sitemap.xml")
    assert sitemap_path.exists(), "public/sitemap.xml missing"
    tree = ET.parse(sitemap_path)
    root = tree.getroot()
    urls = [elem.text for elem in root.findall("{http://www.sitemaps.org/schemas/sitemap/0.9}url/{http://www.sitemaps.org/schemas/sitemap/0.9}loc")]
    assert "https://cloviswebdesign.com/" in urls, "Main URL missing from sitemap"
    assert "https://cloviswebdesign.com/boost" in urls, "Boost URL missing from sitemap"
    print("PASS: public/sitemap.xml validated with URLs:", urls)

def test_robots():
    robots_path = Path("public/robots.txt")
    assert robots_path.exists(), "public/robots.txt missing"
    content = robots_path.read_text(encoding="utf-8")
    assert "Sitemap: https://cloviswebdesign.com/sitemap.xml" in content, "Sitemap line missing from robots.txt"
    print("PASS: public/robots.txt validated.")

def test_manifest():
    manifest_path = Path("public/site.webmanifest")
    assert manifest_path.exists(), "public/site.webmanifest missing"
    data = json.loads(manifest_path.read_text(encoding="utf-8"))
    assert data["name"] == "Clovis Web Design", "Manifest name mismatch"
    assert len(data["icons"]) >= 2, "Manifest missing icons"
    print("PASS: public/site.webmanifest validated.")

def test_assets():
    required_assets = [
        "public/favicon.ico",
        "public/images/apple-touch-icon.png",
        "public/images/favicon-32x32.png",
        "public/images/favicon-16x16.png",
        "public/images/icon-192.png",
        "public/images/icon-512.png",
        "public/images/clovis-web-design-logo.png",
        "public/images/clovis-logo.jpg",
        "public/images/clovis-cover.jpg",
    ]
    for asset in required_assets:
        p = Path(asset)
        assert p.exists(), f"Asset {asset} missing!"
        assert p.stat().st_size > 0, f"Asset {asset} is empty!"
    print("PASS: All required icon and image assets present and non-empty.")

def test_dist_html():
    dist_path = Path("dist/index.html")
    assert dist_path.exists(), "dist/index.html missing"
    html = dist_path.read_text(encoding="utf-8")
    assert '<link rel="canonical" href="https://cloviswebdesign.com/" />' in html, "Missing canonical link in dist"
    assert '<meta name="geo.region" content="US-CA" />' in html, "Missing geo.region in dist"
    assert '<meta property="og:image" content="https://cloviswebdesign.com/images/clovis-cover.jpg" />' in html, "Missing og:image in dist"
    match = re.search(r'<script type="application/ld\+json">(.*?)</script>', html, re.DOTALL)
    assert match, "JSON-LD script tag not found in dist"
    data = json.loads(match.group(1).strip())
    assert len(data.get("@graph", [])) >= 4, "dist JSON-LD graph incomplete"
    print("PASS: dist/index.html verified completely.")

if __name__ == "__main__":
    test_index_html()
    test_sitemap()
    test_robots()
    test_manifest()
    test_assets()
    test_dist_html()
    print("\nALL SEO & GEO CHECKS PASSED 100%!")
