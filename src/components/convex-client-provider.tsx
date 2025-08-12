"use client";

import { ReactNode } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

// Use a fallback URL for development when environment variable is not set
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://demo.convex.dev";
const convex = new ConvexReactClient(convexUrl);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
