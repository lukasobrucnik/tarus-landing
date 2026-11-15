"use client";

import * as React from "react";
import Link from "next/link";

type State = "idle" | "sending" | "done" | "error";

export function NewsletterForm({ source }: { source: string }) {
  const [state, setState] = React.useState<State>("idle");
  const [message, setMessage] = React.useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setState("sending");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          website: form.get("website"),
          source,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Přihlášení se nepodařilo.");
      setState("done");
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "Přihlášení se nepodařilo.");
    }
  }

  return (
    <section className="bg-ink px-6 py-10 text-paper md:px-10 md:py-12" aria-labelledby="newsletter-title">
      <div className="grid gap-8 md:grid-cols-[1fr_1.1fr] md:items-end">
        <div>
          <h2 id="newsletter-title" className="mb-3 font-display-lg text-2xl font-bold md:text-3xl">
            Nové články a akce do e-mailu
          </h2>
          <p className="text-paper/65">
            Jednou za čas pošleme nové porovnání, návod nebo slevu na materiál. Žádný spam, odhlásit se
            můžete jedním klikem.
          </p>
        </div>

        {state === "done" ? (
          <p role="status" className="border-l-2 border-brand pl-4 text-paper">
            Hotovo. Další článek vám přijde do e-mailu.
          </p>
        ) : (
          <form onSubmit={onSubmit} noValidate={false}>
            <div className="flex flex-col gap-3 sm:flex-row">
              <label htmlFor="newsletter-email" className="sr-only">
                E-mail
              </label>
              <input
                id="newsletter-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="vas@email.cz"
                className="min-h-[48px] flex-1 border border-paper/25 bg-transparent px-4 text-paper placeholder:text-paper/40 focus-visible:border-brand focus-visible:outline-none"
              />
              {/* Honeypot */}
              <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
              <button
                type="submit"
                disabled={state === "sending"}
                className="min-h-[48px] bg-brand px-6 font-label-md text-label-md uppercase tracking-wider text-ink transition-colors hover:bg-paper disabled:opacity-50"
              >
                {state === "sending" ? "Odesílám…" : "Odebírat"}
              </button>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-paper/50">
              Odesláním souhlasíte se zasíláním novinek od TARUS obchodní služby s.r.o. Více v{" "}
              <Link href="/privacy" className="underline hover:text-paper">
                zásadách ochrany soukromí
              </Link>
              .
            </p>
            {state === "error" && (
              <p role="alert" className="mt-2 text-sm text-danger">
                {message}
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
