import { z } from "zod";

const UrlSchema = z.string().url();

const SentenceCountSchema = (min: number, max: number) =>
  z.string().trim().min(1).refine(
    (value) => {
      const count = value.match(/[.!?][)"']?(?:\s|$)/g)?.length ?? 0;
      return count >= min && count <= max;
    },
    { message: `Expected ${min}-${max} sentences.` },
  );

export const ProjectStatusSchema = z.enum([
  "MEASURED",
  "LIVE",
  "SHIPPED",
  "SHIPPED (MVP)",
  "SPEC / IN PROGRESS",
]);

export const ProjectMetricSchema = z
  .object({
    label: z.string().min(1),
    value: z.string().min(1),
    verified: z.boolean(),
  })
  .strict();

export const ProjectLinksSchema = z
  .object({
    repo: UrlSchema,
    demo: UrlSchema.optional(),
    adapter: UrlSchema.optional(),
    gist: UrlSchema.optional(),
  })
  .strict();

const BaseProjectSchema = z
  .object({
    slug: z.string().min(1),
    name: z.string().min(1),
    tagline: SentenceCountSchema(1, 1),
    status: ProjectStatusSchema,
    stack: z.array(z.string().min(1)).min(1),
    links: ProjectLinksSchema,
    chapter: z.number().int().min(0).max(7),
  })
  .strict();

export const TierOneProjectSchema = BaseProjectSchema.extend({
  tier: z.literal(1),
  summary: SentenceCountSchema(2, 4),
  metrics: z.array(ProjectMetricSchema),
  problem: z.string(),
  constraints: z.string(),
  architecture: z.string(),
  warStories: z.array(z.string()),
  framingRules: z.array(z.string()).optional(),
}).strict();

export const TierTwoProjectSchema = BaseProjectSchema.extend({
  tier: z.literal(2),
  summary: SentenceCountSchema(2, 4).optional(),
  metrics: z.array(ProjectMetricSchema).default([]),
}).strict();

export const ProjectSchema = z.discriminatedUnion("tier", [
  TierOneProjectSchema,
  TierTwoProjectSchema,
]);

export type Project = z.infer<typeof ProjectSchema>;
export type ProjectMetric = z.infer<typeof ProjectMetricSchema>;
export type ProjectStatus = z.infer<typeof ProjectStatusSchema>;

export const IdentitySchema = z
  .object({
    name: z.string().min(1),
    handle: z.string().min(1),
    lockup: z.string().min(1),
    positioning: z.string().min(1),
    role: z.string().min(1),
    location: z.string().min(1),
    visa: z.string().min(1),
    education: z.string().min(1),
    email: z.string().email(),
    openTo: z.array(z.string().min(1)),
    affiliations: z.array(z.string().min(1)),
    openSource: z.array(z.string().min(1)),
    socials: z
      .object({
        github: UrlSchema,
        linkedin: UrlSchema,
        x: UrlSchema,
        huggingface: UrlSchema,
      })
      .strict(),
  })
  .strict();

export type Identity = z.infer<typeof IdentitySchema>;

export const NowSchema = z
  .object({
    updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    building: z.array(z.string()),
    reading: z.array(z.string()),
    playing: z.array(z.string()),
    body: z.string().min(1),
  })
  .strict();

export type Now = z.infer<typeof NowSchema>;
