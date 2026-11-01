<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:080b12,55:0f2f5c,100:3b82f6&height=230&section=header&text=Class%2011%20ISC%20Resources&fontSize=44&fontColor=f2f6fb&fontAlignY=40&desc=Four%20subjects.%20Every%20file.%20One%20keyboard%20shortcut%20away.&descSize=17&descAlignY=62&animation=twinkling" alt="Class 11 ISC Resources" width="100%">

<img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=500&size=19&duration=3400&pause=900&color=60a5fa&center=true&vCenter=true&width=660&lines=Physics%2C%20Chemistry%2C%20Maths%2C%20English;A%20Drive%20folder%2C%20flattened%20into%20a%20tree%20you%20can%20walk;Ctrl%2BK%20beats%20clicking%20through%20folders" alt="Typing animation" />

<br />

<a href="https://11-isc-resources.pages.dev/"><img src="https://img.shields.io/badge/%E2%96%B6%20Open%20the%20library-3b82f6?style=for-the-badge&labelColor=0b1220&logo=cloudflarepages&logoColor=3b82f6" alt="Open the library" /></a>

</div>

<div align="center">

<img src="https://img.shields.io/badge/React-18-3b82f6?style=flat-square&labelColor=0b1220" alt="React 18" />
<img src="https://img.shields.io/badge/TypeScript-5.8-3178c6?style=flat-square&labelColor=0b1220" alt="TypeScript 5.8" />
<img src="https://img.shields.io/badge/Vite-6-646cff?style=flat-square&labelColor=0b1220" alt="Vite 6" />
<img src="https://img.shields.io/badge/Fuse.js-search-60a5fa?style=flat-square&labelColor=0b1220" alt="Fuse.js" />
<img src="https://img.shields.io/badge/Host-Cloudflare%20Pages-f38020?style=flat-square&labelColor=0b1220" alt="Cloudflare Pages" />
<img src="https://img.shields.io/badge/Backend-Google%20Drive-94a3b8?style=flat-square&labelColor=0b1220" alt="Google Drive" />

</div>

<br />

<div align="center">

### <a href="https://11-isc-resources.pages.dev/">11-isc-resources.pages.dev</a>

<sub>No login, no install. Pick a subject, open a file, read it in the page.</sub>

</div>

---

<div align="center">

## What it is

</div>

A study library for **ISC Class 11** — Physics, Chemistry, Maths and English — where the files live in a Google Drive folder and this site is the front door. Instead of scrolling a 40-item Drive listing that all looks the same, you get four subject cards, a folder tree you can walk into, and a search box that already knows the name of every file.

The site stores nothing. There is no database, no upload endpoint, no account. The only thing that ships in the repo is a JSON description of the folder tree plus each file's Drive ID; the viewer and the download link are both just Drive URLs built from that ID. That keeps the whole thing static and free to host, and it means the person curating the Drive folder never has to touch code — they run one script and commit the regenerated JSON.

<div align="center">

<sub>Four subject trees, <b>42 indexed files</b>, one search index. Everything else is a URL.</sub>

</div>

---

<div align="center">

## How you actually use it

</div>

<ol>
<li><b>Pick a subject.</b> Each card loads its own <code>/data/&lt;subject&gt;.json</code> tree and opens it in the same explorer. Nothing is bundled together, so Maths opening is not waiting on English.</li>
<li><b>Walk the folders.</b> The explorer keeps a path stack, so "back" always goes up exactly one level and the header tells you where you are. Moving in and out slides in the direction you are actually travelling.</li>
<li><b>Read or download.</b> A tap previews the PDF inside the page through Drive's own embed viewer; the download button hits Drive's <code>uc?export=download</code> endpoint directly. Big files never pass through the site.</li>
<li><b>Or skip the folders entirely.</b> <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>K</kbd> opens the search, fuzzy-matches on file name and path, and highlights the characters that matched.</li>
</ol>

<div align="center">

## What is inside

</div>

<ul>
<li><b>Fuzzy search over a prebuilt index</b> — <code>search-index.json</code> is flattened at build time (<code>{ name, id, path }</code> per file), so the search modal costs one small <code>fetch</code> and never walks the tree.</li>
<li><b>Path-aware results</b> — a hit shows the folder it came from, because "Formula Sheet.pdf" exists in more than one subject.</li>
<li><b>Sliding folder explorer</b> — a modal with a breadcrumb path, direction-aware transitions, and a preview panel that stays inside the same dialog.</li>
<li><b>Light and dark themes</b> — a single hook flips the <code>dark</code> class on the document; the palette is defined once in HSL custom properties in <code>src/index.css</code>.</li>
<li><b><code>/drive</code> redirect</b> — a Cloudflare Pages <code>_redirects</code> rule sends <code>/drive</code> straight to the source folder for anyone who would rather browse Drive raw.</li>
<li><b>Keyboard-first</b> — search, close, and folder navigation are all reachable without a mouse; the search field autofocuses and <kbd>Esc</kbd> closes the deepest open layer.</li>
</ul>

---

<div align="center">

## Stack

</div>

<ul>
<li><b>React 18 + TypeScript, built by Vite 6</b> — two routes, no server, so Vite's dev server and build are the whole toolchain.</li>
<li><b>Tailwind CSS + shadcn/ui</b> — Radix does the dialog, scroll and focus behaviour; the palette lives in one HSL block in <code>src/index.css</code>.</li>
<li><b>Fuse.js</b> — fuzzy matching over 42 items in the browser is faster than any round trip and needs no search backend.</li>
<li><b>Static JSON in <code>public/data/</code></b> — one tree per subject plus one flat index, all generated offline and committed.</li>
<li><b>Google Drive as the file store</b> — curated elsewhere, previewed and downloaded by URL, never copied into the repo.</li>
<li><b>Cloudflare Pages</b> — static output, edge cache and <code>_redirects</code> in the same place.</li>
</ul>

<div align="center">

<img src="https://skillicons.dev/icons?i=react,ts,vite,tailwind,cloudflare,git" alt="React, TypeScript, Vite, Tailwind, Cloudflare, Git" />

</div>

---

<div align="center">

## Under the hood

</div>

<details>
<summary><b>The folder tree is generated, not hand-written</b> — one Drive crawl produces all 42 entries</summary>

<br />

<p><code>generate-drive-json.js</code> authenticates with a Google service account (<code>service-account.json</code>, read-only scope), then walks the folder recursively. Two details make it survive a real Drive:</p>

<ul>
<li><b>Pagination.</b> Every level loops on <code>nextPageToken</code> until it runs out, so a folder with 300 files is not silently cut at 100.</li>
<li><b>Shortcuts.</b> Curators organise with Drive shortcuts, which come back as <code>application/vnd.google-apps.shortcut</code> rather than files. The crawler resolves each one to its target: a folder shortcut is recursed into as if it were a real child, a file shortcut is swapped for the target's real name and ID. A <code>seen</code> set stops the same target appearing twice.</li>
</ul>

<p>The output node shape is deliberately tiny, and it is the whole contract between the script and the UI:</p>

<pre><code>{ "name": "Maths - Formula Sheet.pdf", "type": "file",
  "id": "1ms1X7bkoF1igt8xFa_dCqTri_9IX8RbR", "path": "ISC - XI / Maths" }</code></pre>

</details>

<details>
<summary><b>Search is an index, not a tree walk</b></summary>

<br />

<p>The search modal fetches one flat array once, builds a memoised <code>Fuse</code> instance, and queries it with <code>includeMatches</code>. Results are capped at 20 and rendered with the matched character ranges wrapped in a highlight — the same ranges Fuse used to score the hit, so the highlight can never disagree with the ranking.</p>

<pre><code>new Fuse(allItems, {
  keys: [{ name: "name", weight: 0.7 }, { name: "path", weight: 0.3 }],
  threshold: 0.35, includeMatches: true, ignoreLocation: true,
});</code></pre>

<p>Because the index is generated alongside the trees, "the search is missing a file" and "the folder is missing a file" are the same bug, found in the same place.</p>

</details>

<details>
<summary><b>Opening a file without leaving the page</b></summary>

<br />

<p>A file node carries only an <code>id</code>, and every Drive URL the app needs is derived from it:</p>

<pre><code>preview  https://drive.google.com/file/d/&lt;id&gt;/preview        // iframe, in-place
download https://drive.google.com/uc?export=download&amp;id=&lt;id&gt;</code></pre>

<p>The preview sits in a sandboxed <code>&lt;iframe&gt;</code> inside the explorer dialog rather than opening a tab, so reading three papers in a row never leaves a pile of blank tabs behind.</p>

</details>

---

<div align="center">

## Project structure

</div>

<pre><code>11-isc-resources/
├── public/
│   ├── data/
│   │   ├── physics.json          # one folder tree per subject
│   │   ├── chemistry.json
│   │   ├── maths.json
│   │   ├── english.json
│   │   └── search-index.json     # flat { name, id, path } list for Fuse
│   └── _redirects                # /drive -> the Drive folder
├── generate-drive-json.js        # Drive crawl -> the JSON above
└── src/
    ├── pages/Index.tsx           # subject cards, modal state, theme
    ├── components/FileExplorer.tsx  # path stack + Drive preview
    └── components/SearchModal.tsx   # Fuse + Ctrl K + highlighting</code></pre>

---

<div align="center">

## Run it

</div>

<div align="center">

**Nothing to install:**

### <a href="https://11-isc-resources.pages.dev/">11-isc-resources.pages.dev</a>

</div>

<pre><code>git clone https://github.com/Jivaansh-Yadav/11-isc-resources.git
cd 11-isc-resources
npm install
npm run dev            # http://localhost:1176
npm run build          # static output for Cloudflare Pages</code></pre>

<p>To refresh the catalogue, download a service-account key for the Drive folder, save it as <code>service-account.json</code> in the repo root (it is gitignored), then run <code>node generate-drive-json.js</code> and commit whatever changed under <code>public/data/</code>.</p>

<div align="center">

<sub>Subject list, file metadata and every preview come from public Drive links — nothing here is gated, and there is no analytics of any kind.</sub>

</div>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:080b12,55:0f2f5c,100:3b82f6&height=110&section=footer&reversal=true" alt="" width="100%">
