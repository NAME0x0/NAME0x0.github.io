const DESCRIPTION =
  "I design sovereign computing systems across operating environments, AI workflows, and immersive interfaces.";
const SITE_URL = "https://name0x0.is-a.dev";

export function StructuredData() {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Muhammad Afsah Mumtaz",
    alternateName: "NAME0x0",
    jobTitle: "Systems Architect",
    description: DESCRIPTION,
    url: SITE_URL,
    image: `${SITE_URL}/icon.svg`,
    sameAs: ["https://github.com/NAME0x0"],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Muhammad Afsah Mumtaz Portfolio",
    url: SITE_URL,
    description: DESCRIPTION,
    author: {
      "@type": "Person",
      name: "Muhammad Afsah Mumtaz",
    },
    inLanguage: "en-US",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
    </>
  );
}
