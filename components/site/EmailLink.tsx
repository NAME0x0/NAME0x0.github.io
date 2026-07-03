import type { ReactNode } from "react";
import { identity } from "@/content/identity";

type EmailLinkProps = {
  children?: ReactNode;
  className?: string;
};

export function EmailLink({ children, className }: EmailLinkProps) {
  const [localPart, domainPart] = identity.email.split("@");
  const emailHref = `mailto:${localPart}@${domainPart}`;

  return (
    <a href={emailHref} className={className}>
      {children ?? (
        <>
          {localPart} [at] {domainPart}
        </>
      )}
    </a>
  );
}
