export function StructuredData() {
  const personStructuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Muhammad Afsah Mumtaz",
    "alternateName": "NAME0x0",
    "description": "AI Developer and Creative Technologist with global experience across 7 countries, specializing in cinematic web experiences, machine learning, and interactive 3D graphics",
    "url": "https://name0x0.is-a.dev",
    "image": {
      "@type": "ImageObject",
      "url": "https://name0x0.is-a.dev/icon.svg",
      "width": 512,
      "height": 512,
      "caption": "Muhammad Afsah Mumtaz - AI Developer & Creative Technologist"
    },
    "sameAs": [
      "https://github.com/NAME0x0",
      "https://www.linkedin.com/in/muhammad-afsah-mumtaz",
      "https://twitter.com/NAME0X0_0"
    ],
    "jobTitle": "AI Developer & Creative Technologist",
    "worksFor": {
      "@type": "Organization",
      "name": "Independent Contractor",
      "description": "Freelance AI Development and Creative Technology Services"
    },
    "nationality": "Pakistani",
    "knowsAbout": [
      "Artificial Intelligence",
      "Machine Learning",
      "Deep Learning",
      "Web Development",
      "Three.js",
      "GSAP Animation",
      "Next.js",
      "React.js",
      "TypeScript",
      "Creative Technology",
      "Interactive Design",
      "WebGL",
      "3D Graphics",
      "User Experience Design",
      "Performance Optimization"
    ],
    "hasOccupation": {
      "@type": "Occupation",
      "name": "AI Developer & Creative Technologist",
      "occupationalCategory": "Technology",
      "skills": [
        "AI/ML Development",
        "Frontend Engineering", 
        "3D Web Graphics",
        "Interactive Design",
        "Performance Optimization"
      ]
    },
    "alumniOf": {
      "@type": "EducationalOrganization",
      "name": "University in United Kingdom",
      "location": "United Kingdom"
    },
    "addressCountry": "GB",
    "workLocation": [
      { "@type": "Country", "name": "Pakistan" },
      { "@type": "Country", "name": "Qatar" },
      { "@type": "Country", "name": "Saudi Arabia" },
      { "@type": "Country", "name": "Oman" },
      { "@type": "Country", "name": "United Arab Emirates" },
      { "@type": "Country", "name": "Hungary" }
    ]
  };

  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Muhammad Afsah Mumtaz Portfolio",
    "alternateName": "NAME0x0 Portfolio",
    "url": "https://name0x0.is-a.dev",
    "description": "Interactive cinematic portfolio showcasing AI development, creative technology projects, and cutting-edge web experiences with Three.js, GSAP, and Next.js",
    "author": {
      "@type": "Person",
      "name": "Muhammad Afsah Mumtaz",
      "url": "https://name0x0.is-a.dev"
    },
    "creator": {
      "@type": "Person", 
      "name": "Muhammad Afsah Mumtaz"
    },
    "publisher": {
      "@type": "Person",
      "name": "Muhammad Afsah Mumtaz"
    },
    "inLanguage": "en-US",
    "copyrightYear": 2024,
    "copyrightHolder": {
      "@type": "Person",
      "name": "Muhammad Afsah Mumtaz"
    },
    "genre": "Technology Portfolio",
    "keywords": "AI Developer, Creative Technologist, Three.js, GSAP, Next.js, Interactive Design, Machine Learning, WebGL",
    "mainEntity": {
      "@type": "Person",
      "name": "Muhammad Afsah Mumtaz"
    },
    "about": {
      "@type": "Thing",
      "name": "AI Development and Creative Technology",
      "description": "Portfolio showcasing expertise in artificial intelligence, machine learning, and interactive web technologies"
    },
    "license": "https://opensource.org/licenses/MIT"
  };

  const professionalServiceStructuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Muhammad Afsah Mumtaz - AI Development Services",
    "description": "Professional AI development and creative technology services including machine learning solutions, interactive web experiences, and 3D graphics implementation from a developer with global experience across 7 countries",
    "provider": {
      "@type": "Person",
      "name": "Muhammad Afsah Mumtaz"
    },
    "serviceType": [
      "AI Development",
      "Machine Learning Consulting", 
      "Interactive Web Development",
      "3D Graphics Implementation",
      "Performance Optimization",
      "Creative Technology Solutions"
    ],
    "areaServed": "Worldwide",
    "availableLanguage": ["English"],
    "url": "https://name0x0.is-a.dev",
    "email": "m.afsah.279@gmail.com"
  };

  const portfolioStructuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": "Muhammad Afsah Mumtaz - Interactive Portfolio",
    "description": "A cinematic, interactive portfolio showcasing cutting-edge AI development and creative technology projects",
    "author": {
      "@type": "Person",
      "name": "Muhammad Afsah Mumtaz"
    },
    "creator": {
      "@type": "Person",
      "name": "Muhammad Afsah Mumtaz"
    },
    "dateCreated": "2024-08-10",
    "dateModified": "2024-08-10",
    "genre": "Interactive Portfolio",
    "keywords": "portfolio, AI, machine learning, three.js, gsap, next.js, interactive design",
    "programmingLanguage": [
      "TypeScript",
      "JavaScript", 
      "HTML",
      "CSS",
      "GLSL"
    ],
    "runtimePlatform": "Web Browser",
    "operatingSystem": "Cross-platform",
    "applicationCategory": "Portfolio Website",
    "featureList": [
      "3D Graphics with Three.js",
      "Smooth GSAP Animations", 
      "Responsive Design",
      "Interactive AI Chat",
      "Performance Optimized",
      "Accessible Design"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(professionalServiceStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(portfolioStructuredData),
        }}
      />
    </>
  );
}