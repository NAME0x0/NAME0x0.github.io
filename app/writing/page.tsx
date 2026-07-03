import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/content/writing";

export const metadata: Metadata = {
  title: "Writing",
  alternates: {
    types: {
      "application/rss+xml": [{ url: "/writing/rss.xml", title: "Writing RSS" }],
    },
  },
};

export default function WritingPage() {
  const posts = getAllPosts();

  return (
    <main id="main" className="px-6 py-section-y">
      <div className="mx-auto max-w-6xl space-y-12">
        <header className="max-w-[68ch] space-y-5">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-dim">{"// WRITING"}</p>
          <h1 className="font-display text-4xl font-bold text-ink">Writing</h1>
        </header>

        <section className="max-w-[68ch]">
          {posts.map((post) => (
            <article key={post.slug} className="border-t border-faint py-7">
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-dim">
                {post.frontmatter.date} · {post.readingMinutes} min read
              </p>
              <h2 className="font-display text-2xl font-bold text-ink">
                <Link
                  href={`/writing/${post.slug}`}
                  className="transition-colors hover:text-bone focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bone"
                >
                  {post.frontmatter.title}
                </Link>
              </h2>
              <p className="mt-3 text-dim">{post.frontmatter.description}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
