"use client";

import * as React from "react";
import { Play } from "lucide-react";

// Click-to-load ("lite") embed: the YouTube iframe (~1 MB of JS, third-party
// cookies) loads only after the visitor clicks play. Keeps the article fast
// and avoids setting YouTube cookies before any interaction. Uses the
// youtube-nocookie domain for the same reason.
export function YouTubeEmbed({
  id,
  title,
  duration,
}: {
  id?: string;
  title: string;
  duration?: string;
}) {
  const [playing, setPlaying] = React.useState(false);

  if (!id) {
    return (
      <figure className="my-10">
        <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 border border-dashed border-slate/30 bg-paper-dim text-center">
          <Play size={28} className="text-slate/50" aria-hidden="true" />
          <p className="font-label-md text-label-md uppercase tracking-wider text-slate">
            Video připravujeme
          </p>
        </div>
        <figcaption className="mt-3 text-sm text-slate">{title}</figcaption>
      </figure>
    );
  }

  return (
    <figure className="my-10">
      <div className="relative aspect-video w-full overflow-hidden bg-ink">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Přehrát video: ${title}`}
            className="group absolute inset-0 h-full w-full"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
            />
            <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-brand text-ink transition-transform group-hover:scale-105">
              <Play size={26} fill="currentColor" aria-hidden="true" />
            </span>
          </button>
        )}
      </div>
      <figcaption className="mt-3 flex items-center justify-between gap-4 text-sm text-slate">
        <span>{title}</span>
        {duration && <span className="shrink-0 font-label-md uppercase tracking-wider">{duration}</span>}
      </figcaption>
    </figure>
  );
}
