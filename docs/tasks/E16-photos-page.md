# Task E16 — /photos page (masonry + dome + infinite) + Human-section folder

Reference sources are in `docs/vendor-reference/` (ReactBits, MIT — David Haz). Adapt them; keep a one-line MIT credit comment at the top of each adapted component. gl-matrix is installed (InfiniteMenu needs it). Photos come from `lib/content/photos.ts` (10 files: professional, pfp_1-5, goofy_1-4). TypeScript strict.

## 1. Adapt the three galleries into components/gallery/
Port each from its .jsx + .css reference into a typed TSX + Tailwind/module. Recolor to our palette (void #000, ink #E8E4DE, dim #8A8578, faint #3A3832, bone #C4B5A0, signal #E3B341, paper #F2EDE4, soot #1C1A17). Remove demo defaults; accept our PhotoEntry[].
- **Masonry.tsx** (from Masonry.jsx/css): GSAP entrance, variable-height columns preserving each image's natural aspect (THIS SOLVES THE CROP — no fixed frame, full photos shown). Responsive column count (2 mobile / 3 tablet / 4 desktop). Items are our photos (need intrinsic dimensions — extend lib/content/photos.ts to read width/height via a tiny header parse OR sharp at build; store w/h in PhotoEntry so masonry can lay out without CLS). bone hover accent instead of the demo's color shift.
- **DomeGallery.tsx** (from DomeGallery.jsx/css): CSS-3D drag-to-rotate dome of the photos. Palette overlay/background (void). Keep drag + inertia. Full images (object-cover within each tile is fine here since tiles are uniform, but prefer showing whole — use fit="contain" option if the source supports).
- **InfiniteSphere.tsx** (from InfiniteMenu.jsx/css): WebGL sphere via gl-matrix. Map our photos as tiles; drag-spin with momentum. The demo shows a title/description + action button per focused item — REPLACE with just the photo kind label ("off duty" / "profile" / "headshot") in mono, and NO action button (these are personal photos, not links). void background.

## 2. /photos route — app/photos/page.tsx (server) + PhotosView client
- Server page: metadata title "Photos", loads photos, passes to a client `PhotosView`. If zero photos, render an in-voice empty state ("// no photos yet").
- `PhotosView` ("use client"): a view switcher — three mono toggle labels `MASONRY / DOME / SPHERE` (signal underline on active). Default MASONRY (works for everyone). DOME and SPHERE are gated: use checkFilmGate() — if it fails, disable those toggles (dim, title="needs a capable GPU") and stay on masonry. Reduced-motion: masonry only, toggles hidden.
- Overline `// GALLERY`, a one-line intro ("Off the clock."), then the active view. Header/Footer via layout as usual.
- Add /photos to sitemap.ts and the nav (nav wiring is task E17; here just the route + sitemap).

## 3. Human section: replace PhotoDeck with Folder
- Adapt `Folder.tsx` from Folder.jsx/css: the folder icon with a few peeking thumbnails (feed it 3 photos as the peeking papers). Palette: bone/faint folder, soot accents. On hover it opens; on click it navigates to /photos (use the existing TransitionLink/router).
- In app/page.tsx #human: remove `<PhotoDeck>`, insert `<Folder>` (labeled "photos →" in mono beneath) in the same right-column slot above Tangled. Keep PhotoDeck.tsx + PhotoDeckMotion.tsx as unused elements (do not delete).

## 4. photos.ts dimensions
Extend `lib/content/photos.ts` PhotoEntry with `width` and `height` (read from the file headers at build — reuse the jpeg/png size-parse approach; sharp is available as a devDependency if simpler). Masonry uses these to reserve space (no layout shift).

## Constraints & checks
- No cropping of people on /photos (masonry shows full images).
- 3D views gated + code-split (dome/sphere behind dynamic import so /photos first-load stays lean; report /photos first-load JS).
- MIT credit comment retained in each adapted file. Delete docs/vendor-reference/ ONLY the three files you fully consumed here (Masonry, DomeGallery, InfiniteMenu, Folder) — leave PillNav + StaggeredMenu for task E17.
- `npx tsc --noEmit`, `npm run lint`, `npx next build`; report files + results + /photos first-load JS.
