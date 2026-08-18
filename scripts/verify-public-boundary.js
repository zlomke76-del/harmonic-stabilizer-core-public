const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const assert = (condition, message) => {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exitCode = 1;
  }
};

const readme = read('README.md');
const boundary = read('V4_PUBLIC_BOUNDARY.md');
const docs = read('docs.html');
const publicDocs = read('public/docs.html');
const pkg = JSON.parse(read('package.json'));

assert(pkg.version === '4.0.0-public.1', 'package version must identify the V4 public contract release');
assert(readme.includes('does not contain the sovereign production Harmonic runtime'), 'README must preserve the public/private runtime boundary');
assert(readme.includes('D3 — provenance dependency not demonstrated'), 'README must preserve the T4 non-result');
assert(boundary.includes('Evidence is not runtime configuration'), 'boundary document must prevent evidence/runtime conflation');
assert(docs.includes('runtime_version: 4.0.0'), 'docs must identify production runtime version 4.0.0');
assert(docs.includes('v4-single-call'), 'docs must identify v4-single-call');
assert(docs === publicDocs, 'root docs.html and public/docs.html must remain byte-identical');

if (!process.exitCode) console.log('PASS: V4 public contract/repository boundary');
