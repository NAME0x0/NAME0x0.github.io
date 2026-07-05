import Link from "next/link";
import { identity } from "@/content/identity";
import { ClaimsFooterStatus } from "@/components/site/ClaimsFooterStatus";
import { EmailLink } from "@/components/site/EmailLink";
import { LastCommit } from "@/components/site/LastCommit";
import { Scramble } from "@/components/site/Scramble";
import { TrackedLink } from "@/components/site/TrackedLink";

const socialLinks = [
  { label: "GitHub", href: identity.socials.github },
  { label: "LinkedIn", href: identity.socials.linkedin },
  { label: "X", href: identity.socials.x },
  { label: "HuggingFace", href: identity.socials.huggingface },
] as const;

const focusClass =
  "transition-colors hover:text-bone focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bone";

export function Footer() {
  return (
    <footer className="border-t border-faint/80 px-6 py-12">
      <div className="mx-auto grid max-w-6xl gap-8 text-sm text-dim md:grid-cols-[1fr_auto]">
        <div className="space-y-3">
          <Link href="/" className={`block font-display text-base font-bold text-ink ${focusClass}`}>
            {identity.lockup}
          </Link>
          <EmailLink className={`inline-flex font-mono text-xs uppercase tracking-[0.12em] ${focusClass}`} />
          <p>
            {identity.location} · {identity.visa}
          </p>
          <LastCommit />
          <ClaimsFooterStatus />
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-3 font-mono text-xs uppercase tracking-[0.12em]">
          {socialLinks.map((link) => (
            link.label === "GitHub" ? (
              <TrackedLink
                key={link.href}
                href={link.href}
                event={{ name: "github_clicked" }}
                className={focusClass}
                external
              >
                <Scramble>{link.label}</Scramble>
              </TrackedLink>
            ) : (
              <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className={focusClass}>
                <Scramble>{link.label}</Scramble>
              </a>
            )
          ))}
        </div>
      </div>
    </footer>
  );
}
