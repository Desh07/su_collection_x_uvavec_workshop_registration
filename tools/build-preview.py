#!/usr/bin/env python3
"""Build a single-file preview of the CURRENT repo files (no server, no web needed).

  python3 tools/build-preview.py              -> deploy/workshop-preview.html (whole page)
  python3 tools/build-preview.py --section learn   (or a selector, e.g. --section .final-cta)
                                              -> deploy/preview-learn.html (only that section, for close checks)

Fails loudly if anything is left un-inlined, so a broken/unstyled preview is never handed over.
"""
import base64, re, sys, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
def b64(p, mime): return f"data:{mime};base64," + base64.b64encode((ROOT / p).read_bytes()).decode()

def build():
    h = (ROOT / "index.html").read_text()
    css = (ROOT / "styles.css").read_text().replace("url('tharu_digital_mahee.ttf')", "url('" + b64("tharu_digital_mahee.ttf", "font/ttf") + "')")
    h, n = re.subn(r'<link rel="stylesheet" href="styles\.css\?v=\d+"\s*/?>', lambda m: "<style>" + css + "</style>", h)
    assert n == 1, "styles.css link not found/inlined"
    for f in ["config.js", "translations.js", "app.js", "extras.js"]:
        js = (ROOT / f).read_text().replace("</script", "<\\/script")
        h, n = re.subn(r'<script src="' + re.escape(f) + r'\?v=\d+"( defer)?></script>', lambda m: "<script>" + js + "</script>", h)
        assert n == 1, f"{f} not inlined"
    for f in ["su-collection-sewing-v2.png", "logo-su-transparent.png", "logo-uva-transparent.png", "whatsapp.png"]:
        h = h.replace(f'"{f}"', '"' + b64(f, "image/png") + '"')
    left = [m for m in re.findall(r'(?:src|href)="([^"]+)"', h) if not m.startswith(("data:", "http", "#", "${"))]
    assert not left, f"un-inlined local files: {left}"
    return h

def isolate(h, section_id):
    js = ("<script>(function(){var l=document.querySelector('%s');if(!l)return;var p=l;"
          "while(p.parentElement&&p.parentElement!==document.body){var s=p.previousElementSibling;while(s){var n=s.previousElementSibling;s.remove();s=n}p=p.parentElement}"
          "var s=p.previousElementSibling;while(s){var n=s.previousElementSibling;if(s.tagName!=='SCRIPT')s.remove();s=n}"
          "document.querySelectorAll('.quiz-overlay,.sticky-cta').forEach(function(e){e.remove()})})()</script></body>") % section_id
    return h.replace("</body>", js)

if __name__ == "__main__":
    page = build()
    if "--section" in sys.argv:
        sid = sys.argv[sys.argv.index("--section") + 1]
        sel = sid if sid[0] in ".#[" else "#" + sid
        name = re.sub(r"[^a-z0-9-]", "", sid.lower()) or "section"
        out = ROOT / "deploy" / f"preview-{name}.html"; out.write_text(isolate(page, sel))
    else:
        out = ROOT / "deploy" / "workshop-preview.html"; out.write_text(page)
    print("built", out.relative_to(ROOT), f"{out.stat().st_size//1024} KB")
