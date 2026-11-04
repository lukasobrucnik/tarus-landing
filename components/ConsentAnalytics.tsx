"use client";

import * as React from "react";
import { GoogleAnalytics } from "@next/third-parties/google";

const STORAGE_KEY = "tarus-cookie-consent";

// GA is mounted only after the visitor accepts in CookieBanner.
export function ConsentAnalytics({ gaId }: { gaId: string }) {
  const [accepted, setAccepted] = React.useState(false);

  React.useEffect(() => {
    const sync = () => setAccepted(window.localStorage.getItem(STORAGE_KEY) === "accepted");
    sync();
    window.addEventListener("tarus-consent", sync);
    return () => window.removeEventListener("tarus-consent", sync);
  }, []);

  return accepted ? <GoogleAnalytics gaId={gaId} /> : null;
}
