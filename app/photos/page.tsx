import type { Metadata } from "next";
import { PhotosView } from "@/components/gallery/PhotosView";
import { getPhotos } from "@/lib/content/photos";

export const metadata: Metadata = {
  title: "Photos",
};

export default function PhotosPage() {
  const photos = getPhotos();

  return (
    <main id="main" className="px-6 py-section-y">
      <section className="mx-auto max-w-6xl space-y-8">
        <div>
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.18em] text-dim">{"// GALLERY"}</p>
          <h1 className="font-display text-5xl font-bold text-ink">Photos</h1>
          <p className="mt-4 text-xl text-bone">Off the clock.</p>
        </div>
        {photos.length > 0 ? <PhotosView photos={photos} /> : <p className="font-mono text-sm uppercase tracking-[0.14em] text-dim">{"// no photos yet"}</p>}
      </section>
    </main>
  );
}
