"use client";

import * as React from "react";
import Link from "next/link";

export const LIST_URL_KEY = "mediazona:list-url";

const cls =
  "mb-6 inline-flex min-h-[44px] items-center gap-1.5 font-label-md text-label-md uppercase tracking-wider text-slate transition-colors hover:text-ink";

// True only after a full page load from the homepage (navbar links are
// plain <a>). Client-side Link navigations keep a stale referrer, so they
// never match here and use the /#mediazona fallback instead.
function cameFromHome() {
  try {
    const ref = document.referrer ? new URL(document.referrer) : null;
    return !!ref && ref.origin === window.location.origin && ref.pathname === "/";
  } catch {
    return false;
  }
}

// "← Zpět" link in the same style as the specialization pages' back link.
//
// mode "home" (on /mediazona): after a full page load from the homepage,
// step back in history so the browser restores the exact scroll position.
// Otherwise (teaser click, direct visit) a plain link to /#mediazona lands
// on the Mediazóna strip of the homepage. history.back() after a
// client-side navigation was tested and did not restore the position.
//
// mode "list" (on an article): back to the list, keeping the tag filter
// the visitor had selected (remembered by ArticleList).
export function BackLink({ mode, children }: { mode: "home" | "list"; children: React.ReactNode }) {
  const [listHref, setListHref] = React.useState("/mediazona");

  React.useEffect(() => {
    if (mode !== "list") return;
    try {
      const saved = sessionStorage.getItem(LIST_URL_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of client-only storage
      if (saved?.startsWith("/mediazona")) setListHref(saved);
    } catch {
      // storage blocked — keep the plain fallback
    }
  }, [mode]);

  if (mode === "list") {
    return (
      <Link href={listHref} className={cls}>
        <span aria-hidden="true">←</span> {children}
      </Link>
    );
  }

  function onClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || window.history.length < 2) return;
    if (cameFromHome()) {
      e.preventDefault();
      window.history.back();
    }
  }

  return (
    // Plain <a>: the fallback is a full load, so the browser itself scrolls
    // to #mediazona once the homepage has laid out.
    // eslint-disable-next-line @next/next/no-html-link-for-pages -- full load intended (see above)
    <a href="/#mediazona" onClick={onClick} className={cls}>
      <span aria-hidden="true">←</span> {children}
    </a>
  );
}
