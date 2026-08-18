#!/usr/bin/env python3
from pathlib import Path
import hashlib, json, tarfile, zipfile
ROOT=Path(__file__).resolve().parent
M=json.loads((ROOT/"EVIDENCE_MANIFEST.json").read_text(encoding="utf-8"))
def sha(p): return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def ok(label,cond,detail=""):
 print(("PASS" if cond else "FAIL")+": "+label+(" — "+detail if detail else ""))
 if not cond: raise AssertionError(label)
cz=ROOT/"source"/M["controlling_frozen_zip"]["file"]
ok("controlling frozen ZIP SHA-256",sha(cz)==M["controlling_frozen_zip"]["sha256"],sha(cz))
tp=ROOT/"transport"/M["transport_envelope"]["file"]
with tarfile.open(tp,"r:*") as tf:
 c=[m for m in tf.getmembers() if m.isfile() and m.name.endswith(".zip")]
 ok("transport TAR contains one ZIP object",len(c)==1,str([m.name for m in c]))
 inner=tf.extractfile(c[0]).read(); ih=hashlib.sha256(inner).hexdigest(); ok("TAR inner ZIP equals controlling frozen ZIP",ih==M["controlling_frozen_zip"]["sha256"],ih)
with zipfile.ZipFile(cz) as zf:
 names=set(zf.namelist())
 for case,rec in M["frozen_packets"].items():
  p=ROOT/"packets"/rec["file"]; ok(f"{case} frozen packet SHA-256",sha(p)==rec["sha256"],sha(p)); ok(f"{case} frozen packet bytes",p.stat().st_size==rec["bytes"],str(p.stat().st_size)); ok(f"{case} packet present in controlling ZIP",rec["file"] in names); ok(f"{case} controlling ZIP bytes equal extracted file",zf.read(rec["file"])==p.read_bytes())
  frozen=p.read_bytes(); out=M["outbound_http_bodies"][case]; ok(f"{case} frozen file has terminal LF",frozen.endswith(b"\n")); norm=frozen[:-1]; ok(f"{case} outbound bytes = frozen minus LF",len(norm)==out["bytes"],str(len(norm))); nh=hashlib.sha256(norm).hexdigest(); ok(f"{case} outbound SHA-256 = frozen minus LF",nh==out["sha256"],nh)
for case,rec in M["engineering_view_outputs"].items():
 p=ROOT/"outputs"/rec["file"]; ok(f"Engineering View {case} SHA-256",sha(p)==rec["sha256"],sha(p)); ok(f"Engineering View {case} bytes",p.stat().st_size==rec["bytes"],str(p.stat().st_size))
adj=M["independent_adjudication"]; p=ROOT/"adjudication"/adj["record_file"]; ok("independent adjudication text SHA-256",sha(p)==adj["record_sha256"],sha(p))
print("\nT4 v1.1 evidence verification: PASS")
