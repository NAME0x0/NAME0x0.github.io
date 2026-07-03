import { track } from "@vercel/analytics";

type Chapter = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type AnalyticsEvent =
  | { name: "chapter_reached"; properties: { chapter: Chapter } }
  | { name: "case_study_opened"; properties: { slug: string } }
  | { name: "demo_clicked"; properties: { slug: string } }
  | { name: "cv_downloaded" }
  | { name: "email_clicked" }
  | { name: "github_clicked" }
  | { name: "writing_read_50pct"; properties: { slug: string } };

export function trackAnalyticsEvent(event: AnalyticsEvent) {
  if ("properties" in event) {
    track(event.name, event.properties);
    return;
  }

  track(event.name);
}
