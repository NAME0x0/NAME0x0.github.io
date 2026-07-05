"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { supportsViewTransitions } from "@/lib/view-transitions";

type TransitionLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  children: ReactNode;
};

function shouldUseNativeNavigation(event: MouseEvent<HTMLAnchorElement>, href: string) {
  return (
    event.defaultPrevented ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    event.button !== 0 ||
    href.startsWith("#") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  );
}

export function TransitionLink({ href, children, onClick, target, ...props }: TransitionLinkProps) {
  const router = useRouter();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);

    if (target || shouldUseNativeNavigation(event, href)) {
      return;
    }

    const destination = new URL(href, window.location.href);

    if (destination.origin !== window.location.origin) {
      return;
    }

    event.preventDefault();

    // Progressive enhancement: unsupported browsers fall back to instant client navigation.
    if (supportsViewTransitions(document)) {
      document.startViewTransition(() => {
        router.push(`${destination.pathname}${destination.search}${destination.hash}`);
      });
    } else {
      router.push(`${destination.pathname}${destination.search}${destination.hash}`);
    }
  }

  return (
    <Link href={href} target={target} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
