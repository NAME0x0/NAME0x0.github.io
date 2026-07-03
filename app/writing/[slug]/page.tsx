import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { ReadProgress } from "@/components/site/ReadProgress";
import { getAllPosts, getPostBySlug } from "@/lib/content/writing";

type WritingDetailPageProps = {
  params: {
    slug: string;
  };
};

const linkClass =
  "text-bone underline decoration-bone/40 underline-offset-4 transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bone";

const mdxComponents = {
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mt-12 border-t border-faint pt-8 font-display text-3xl font-bold text-ink" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="mt-8 font-display text-2xl font-bold text-ink" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => <p className="mt-5 text-ink" {...props} />,
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a className={linkClass} {...props} />,
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="mt-5 list-disc space-y-2 pl-6 text-ink" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="mt-5 list-decimal space-y-2 pl-6 text-ink" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => <li className="pl-1" {...props} />,
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre className="mt-5 overflow-x-auto border border-faint bg-soot p-4 font-mono text-sm text-ink" {...props} />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code className="border border-faint bg-soot px-1.5 py-0.5 font-mono text-sm text-ink" {...props} />
  ),
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="mt-5 overflow-x-auto border border-faint">
      <table className="w-full border-collapse text-left text-sm" {...props} />
    </div>
  ),
  th: (props: React.ThHTMLAttributes<HTMLTableCellElement>) => (
    <th className="border-b border-faint px-4 py-3 font-mono text-xs uppercase tracking-[0.14em] text-dim" {...props} />
  ),
  td: (props: React.TdHTMLAttributes<HTMLTableCellElement>) => (
    <td className="border-b border-faint/70 px-4 py-3 text-ink" {...props} />
  ),
};

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: WritingDetailPageProps): Metadata {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return {};
  }

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
  };
}

export default function WritingDetailPage({ params }: WritingDetailPageProps) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <main id="main" className="px-6 py-section-y">
      <article className="mx-auto max-w-6xl">
        <header className="max-w-[68ch] space-y-5">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-dim">{"// WRITING"}</p>
          <h1 className="font-display text-4xl font-bold text-ink">{post.frontmatter.title}</h1>
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-dim">
            {post.frontmatter.date} · {post.readingMinutes} min read
          </p>
          {post.frontmatter.tags.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {post.frontmatter.tags.map((tag) => (
                <li key={tag} className="border border-faint px-3 py-1 font-mono text-xs uppercase tracking-[0.12em] text-dim">
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}
          {post.frontmatter.sourceGist ? (
            <p className="text-dim">
              Also published as a{" "}
              <a href={post.frontmatter.sourceGist} target="_blank" rel="noopener noreferrer" className={linkClass}>
                gist
              </a>
            </p>
          ) : null}
        </header>

        <div className="mt-12 max-w-[68ch] text-base leading-7 text-ink">
          <MDXRemote
            source={post.content}
            components={mdxComponents}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
              },
            }}
          />
        </div>
        <ReadProgress slug={post.slug} />
      </article>
    </main>
  );
}
