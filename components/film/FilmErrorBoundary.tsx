"use client";

import { Component, type ReactNode } from "react";

type FilmErrorBoundaryProps = {
  children: ReactNode;
};

type FilmErrorBoundaryState = {
  failed: boolean;
};

/**
 * The film must never take the page down. Any runtime failure in an optional
 * scene subtree (e.g. the streamed GLB card failing to load or decode) renders
 * nothing and the procedural film continues.
 */
export class FilmErrorBoundary extends Component<FilmErrorBoundaryProps, FilmErrorBoundaryState> {
  state: FilmErrorBoundaryState = { failed: false };

  static getDerivedStateFromError(): FilmErrorBoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    // Always log, including production: this boundary once silently hid a
    // stack overflow in the card scene and cost a debugging round.
    console.error("[film] optional scene subtree failed; continuing without it", error);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
