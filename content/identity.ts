import { IdentitySchema, type Identity } from "@/lib/content/schema";

export const identity = IdentitySchema.parse({
  name: "Muhammad Afsah Mumtaz",
  handle: "NAME0x0",
  lockup: "Muhammad Afsah Mumtaz \u2014 NAME0x0",
  positioning: "I build machines that think, on hardware that shouldn't be able to.",
  role: "Systems & ML engineer",
  location: "Dubai, UAE",
  visa: "UAE Golden Visa \u2014 no sponsorship needed",
  education: "BSc (Hons) IT, Middlesex University Dubai",
  email: "m.afsah.279@gmail.com",
  openTo: [
    "AI/ML/software engineering internships and junior roles (Dubai/Abu Dhabi or remote)",
    "Freelance / contract web work",
  ],
  affiliations: [
    "Chairman, MDX Computing Society",
    "Committee Chair, BCS Student Chapter",
    "2\u00d7 hackathon runner-up (Odoo Hackathon Dubai; Curtin University Dubai, Nov 2025)",
  ],
  openSource: ["FluentFlyout auto-update system", "HAGI research contributor"],
  socials: {
    github: "https://github.com/NAME0x0",
    linkedin: "https://www.linkedin.com/in/muhammad-afsah-mumtaz/",
    x: "https://x.com/NAME0X0_0",
    huggingface: "https://huggingface.co/NAME0x0",
  },
}) satisfies Identity;
