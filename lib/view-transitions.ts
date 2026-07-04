export type ViewTransitionDocument = Document & {
  startViewTransition: (callback: () => void) => unknown;
};

export function supportsViewTransitions(documentRef: Document): documentRef is ViewTransitionDocument {
  return "startViewTransition" in documentRef;
}
