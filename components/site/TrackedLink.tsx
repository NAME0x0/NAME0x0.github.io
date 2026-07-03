"use client";

import Link from "next/link";
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { trackAnalyticsEvent, type AnalyticsEvent } from "@/lib/analytics";

type TrackedLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  event: AnalyticsEvent;
  children: ReactNode;
  external?: boolean;
};

export function TrackedLink({
  href,
  event,
  children,
  className,
  external = false,
  onClick,
  rel,
  target,
  ...props
}: TrackedLinkProps) {
  function handleClick(clickEvent: MouseEvent<HTMLAnchorElement>) {
    onClick?.(clickEvent);

    if (!clickEvent.defaultPrevented) {
      trackAnalyticsEvent(event);
    }
  }

  if (external) {
    const isMailto = href.startsWith("mailto:");
    const resolvedTarget = isMailto ? target : target ?? "_blank";
    const resolvedRel = resolvedTarget === "_blank" ? rel ?? "noopener noreferrer" : rel;

    return (
      <a
        href={href}
        className={className}
        target={resolvedTarget}
        rel={resolvedRel}
        onClick={handleClick}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
