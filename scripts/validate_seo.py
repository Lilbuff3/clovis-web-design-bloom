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
    assert '<meta name="geo.position" content="36.8346;-119.6596" />' in html, "Missing geo.position"
    assert '<meta name="ICBM" content="36.8346, -119.6596" />' in html, "Missing ICBM"

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
    assert len(graph) >= 5, f"Expected at least 5 graph entities, got {len(graph)}"

    biz = next((x for x in graph if x.get("@id") == "https://cloviswebdesign.com/#business"), None)
    assert biz is not None, "Business entity missing from @graph"
    assert "ProfessionalService" in biz["@type"], "ProfessionalService missing from @type"
    assert "LocalBusiness" in biz["@type"], "LocalBusiness missing from @type"
    assert biz["name"] == "Clovis Web Design", f"Incorrect business name: {biz.get('name')}"
    assert biz["telephone"] == "+15595753014", f"Incorrect phone: {biz.get('telephone')}"
    assert biz["geo"]["latitude"] == 36.8346, "Latitude mismatch"
    assert biz["geo"]["longitude"] == -119.6596, "Longitude mismatch"
    assert biz["address"]["addressLocality"] == "Clovis", "Address locality mismatch"
    assert biz["address"]["postalCode"] == "93619", "Postal code mismatch"
    assert "streetAddress" not in biz["address"], "Fictitious streetAddress should not be present for SAB"
    assert biz["founder"]["name"] == "Adam Youssef", "Founder mismatch"
    assert len(biz["areaServed"]) >= 6, "Expected at least 6 service areas"
    assert any(a.get("@type") == "GeoCircle" for a in biz["areaServed"]), "Missing GeoCircle in areaServed"
    assert len(biz["hasOfferCatalog"]["itemListElement"]) >= 4, "Expected at least 4 offers"
    assert len(biz["review"]) == 2, "Expected 2 client reviews"
    assert "aggregateRating" not in biz, "Self-published aggregateRating earns no stars on LocalBusiness; keep it out"
    
    # Entity disambiguation: client sites must be in workExample, NOT sameAs
    assert "https://bigbrosdumpster.com" not in biz.get("sameAs", []), "Client site wrongly placed in sameAs"
    assert "https://www.kidneyspecialistinc.com" not in biz.get("sameAs", []), "Client site wrongly placed in sameAs"
    assert any("kidneyspecialistinc.com" in w.get("url", "") for w in biz.get("workExample", [])), "Missing Kidney Specialist in workExample"
    assert any("bigbrosdumpster.com" in w.get("url", "") for w in biz.get("workExample", [])), "Missing Big Bros in workExample"

    # BreadcrumbList check
    breadcrumbs = next((x for x in graph if x.get("@type") == "BreadcrumbList"), None)
    assert breadcrumbs is not None, "BreadcrumbList missing from @graph"

    print("PASS: index.html SEO, Geo, Social & JSON-LD validated perfectly.")

def test_boost_html():
    for filename in ["dist/boost/index.html", "dist/boost.html"]:
        boost_path = Path(filename)
        assert boost_path.exists(), f"{filename} missing"
        html = boost_path.read_text(encoding="utf-8")

        # 1. Canonical tag must point directly to /boost
        assert '<link rel="canonical" href="https://cloviswebdesign.com/boost" />' in html, f"Missing /boost canonical link in {filename}"

        # 2. Title must be Conversion Boost
        assert "Conversion Boost™" in html, f"Missing Conversion Boost in title for {filename}"

        # 3. OpenGraph and Twitter tags
        assert '<meta property="og:url" content="https://cloviswebdesign.com/boost" />' in html, f"Missing og:url /boost in {filename}"
        assert '<meta name="twitter:url" content="https://cloviswebdesign.com/boost" />' in html, f"Missing twitter:url /boost in {filename}"

        # 4. No relative ./ asset paths that break on nested paths
        assert 'href="./favicon' not in html, f"Relative favicon path found in {filename}"
        assert 'href="./site.webmanifest' not in html, f"Relative manifest path found in {filename}"

        # 5. Dedicated Schema.org for /boost
        match = re.search(r'<script type="application/ld\+json">(.*?)</script>', html, re.DOTALL)
        assert match, f"JSON-LD script tag not found in {filename}"
        data = json.loads(match.group(1).strip())
        graph = data.get("@graph", [])
        
        webpage = next((x for x in graph if x.get("@id") == "https://cloviswebdesign.com/boost#webpage"), None)
        assert webpage is not None, f"Boost WebPage entity missing from {filename}"
        assert webpage["url"] == "https://cloviswebdesign.com/boost", f"Boost WebPage url mismatch in {filename}"

        service = next((x for x in graph if x.get("@id") == "https://cloviswebdesign.com/boost#service"), None)
        assert service is not None, f"Boost Service entity missing from {filename}"
        assert service["name"] == "Conversion Boost™ — Speed & Local Search Audit", f"Boost Service name mismatch in {filename}"

        bc = next((x for x in graph if x.get("@id") == "https://cloviswebdesign.com/boost#breadcrumbs"), None)
        assert bc is not None, f"Boost BreadcrumbList missing in {filename}"
        assert len(bc["itemListElement"]) == 2, f"Boost breadcrumbs should have 2 levels in {filename}"

    print("PASS: dist/boost/index.html & dist/boost.html dedicated SEO & Schema validated perfectly.")

def test_sitemap():
    sitemap_path = Path("public/sitemap.xml")
    assert sitemap_path.exists(), "public/sitemap.xml missing"
    tree = ET.parse(sitemap_path)
    root = tree.getroot()
    urls = [elem.text for elem in root.findall("{http://www.sitemaps.org/schemas/sitemap/0.9}url/{http://www.sitemaps.org/schemas/sitemap/0.9}loc")]
    assert "https://cloviswebdesign.com/" in urls, "Main URL missing from sitemap"
    assert "https://cloviswebdesign.com/boost" in urls, "Boost URL missing from sitemap"
    assert "https://cloviswebdesign.com/medical-websites" in urls, "Medical page URL missing from sitemap"
    print("PASS: public/sitemap.xml validated with URLs:", urls)

def test_robots():
    robots_path = Path("public/robots.txt")
    assert robots_path.exists(), "public/robots.txt missing"
    content = robots_path.read_text(encoding="utf-8")
    assert "Sitemap: https://cloviswebdesign.com/sitemap.xml" in content, "Sitemap line missing from robots.txt"
    assert "Host: cloviswebdesign.com" in content, "Host line missing from robots.txt"
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
    assert len(data.get("@graph", [])) >= 5, "dist JSON-LD graph incomplete"
    print("PASS: dist/index.html verified completely.")

def test_dist_medical():
    html = Path("dist/medical-websites.html").read_text(encoding="utf-8")
    assert '<link rel="canonical" href="https://cloviswebdesign.com/medical-websites" />' in html, "Medical page canonical wrong"
    assert "<title>Medical Practice Websites" in html, "Medical page title missing"
    match = re.search(r'<script type="application/ld\+json">(.*?)</script>', html, re.DOTALL)
    graph = json.loads(match.group(1))["@graph"]
    types = [str(x.get("@type")) for x in graph]
    assert "Service" in types and "FAQPage" in types and "BreadcrumbList" in types, f"Medical JSON-LD incomplete: {types}"
    root = html.split('<div id="root">', 1)[1]
    assert "second front desk" in root and "Kidney Specialist" in root, "Medical page body not prerendered"
    print("PASS: dist/medical-websites.html has its own canonical, title, schema and prerendered body.")

def test_live():
    import urllib.request
    urls_to_test = [
        "https://cloviswebdesign.com/",
        "https://cloviswebdesign.com/robots.txt",
        "https://cloviswebdesign.com/sitemap.xml",
        "https://cloviswebdesign.com/site.webmanifest",
        "https://cloviswebdesign.com/boost",
    ]
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
    for u in urls_to_test:
        req = urllib.request.Request(u, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as resp:
            code = resp.getcode()
            content = resp.read().decode("utf-8")
            assert code == 200, f"HTTP {code} on {u}"
            if u == "https://cloviswebdesign.com/":
                assert '<link rel="canonical" href="https://cloviswebdesign.com/" />' in content, "Live missing canonical"
                assert '<meta name="geo.region" content="US-CA" />' in content, "Live missing geo"
                assert 'application/ld+json' in content, "Live missing JSON-LD"
                print("PASS: Live https://cloviswebdesign.com/ verified with Schema.org & Meta tags!")
            elif "robots.txt" in u:
                assert "Sitemap: https://cloviswebdesign.com/sitemap.xml" in content, "Live missing sitemap in robots"
                print("PASS: Live robots.txt verified!")
            elif "sitemap.xml" in u:
                assert "https://cloviswebdesign.com/boost" in content, "Live sitemap missing boost"
                print("PASS: Live sitemap.xml verified!")
            elif "site.webmanifest" in u:
                data = json.loads(content)
                assert data["name"] == "Clovis Web Design", "Live manifest name mismatch"
                print("PASS: Live site.webmanifest verified!")
            elif "boost" in u:
                assert '<link rel="canonical" href="https://cloviswebdesign.com/boost" />' in content, "Live /boost missing canonical link"
                assert "Conversion Boost" in content, "Live /boost missing Conversion Boost in title/content"
                assert 'https://cloviswebdesign.com/boost#service' in content, "Live /boost missing service schema"
                print("PASS: Live /boost endpoint verified with dedicated Canonical, Title & Schema!")

if __name__ == "__main__":
    test_index_html()
    test_sitemap()
    test_robots()
    test_manifest()
    test_assets()
    test_dist_html()
    test_boost_html()
    test_dist_medical()
    test_live()
    print("\nALL SEO & GEO CHECKS PASSED 100%!")
