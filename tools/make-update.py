#!/usr/bin/env python3
"""Package the files to upload to Hostinger public_html.

  python3 tools/make-update.py --bump   -> bumps ?v=N to N+1 in index.html, then packages deploy/update-vN+1
  python3 tools/make-update.py          -> re-packages the current version (ONLY if that version was never uploaded)

Rules enforced: every ?v= in index.html is identical; config.js is NEVER packaged (the live one holds the
production endpoint); packaged files are byte-identical to the repo; deploy/LATEST.txt names the newest package.
"""
import re, sys, shutil, filecmp, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
FILES = ["index.html", "app.js", "styles.css", "translations.js", "extras.js"]
idx = ROOT / "index.html"; h = idx.read_text()
vs = set(re.findall(r'\?v=(\d+)', h)); assert len(vs) == 1, f"mixed versions in index.html: {vs}"
v = int(vs.pop())
if "--bump" in sys.argv:
    v += 1; h = re.sub(r'\?v=\d+', f'?v={v}', h); idx.write_text(h)
out = ROOT / "deploy" / f"update-v{v}"; out.mkdir(parents=True, exist_ok=True)
for f in FILES:
    shutil.copy2(ROOT / f, out / f); assert filecmp.cmp(ROOT / f, out / f, shallow=False)
assert not (out / "config.js").exists(), "config.js must never be in an upload package"
(out / "README.txt").write_text(
    f"Upload v{v}\n\nHostinger > File Manager > public_html: upload these 5 files and choose Replace:\n  "
    + "\n  ".join(FILES) + "\n\nDo NOT upload config.js (the live one has the production settings).\n"
    "After upload open https://freeworkshop.sucollection.shop on the phone; the page source must show ?v=" + str(v) + ".\n")
(ROOT / "deploy" / "LATEST.txt").write_text(f"update-v{v}\n")
print(f"packaged deploy/update-v{v}: {', '.join(FILES)}")
