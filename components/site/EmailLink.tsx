import type { ReactNode } from "react";
import { identity } from "@/content/identity";
import { TrackedLink } from "@/components/site/TrackedLink";

type EmailLinkProps = {
  children?: ReactNode;
  className?: string;
};

export function EmailLink({ children, className }: EmailLinkProps) {
  const [localPart, domainPart] = identity.email.split("@");
  const emailHref = `mailto:${localPart}@${domainPart}`;

  return (
    <TrackedLink href={emailHref} event={{ name: "email_clicked" }} className={className} external>
      {children ?? (
        <>
          {localPart} [at] {domainPart}
        </>
      )}
    </TrackedLink>
  );
}
