"use client";

import * as React from "react";
import Link from "next/link";

type State = "idle" | "sending" | "done" | "error";

// Quiet signup box — same bordered style as the "Nenašli jste odpověď?" box,
// not a standalone section competing with the content.
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
    <section
      className="flex flex-col gap-6 border border-slate/15 p-6 md:flex-row md:items-center md:justify-between md:p-8"
      aria-labelledby="newsletter-title"
    >
      <div className="md:max-w-md">
        <h2 id="newsletter-title" className="mb-1 font-display-lg text-xl font-bold text-ink">
          Novinky do e-mailu
        </h2>
        <p className="text-slate">Nové články, návody a akce. Občas, bez spamu.</p>
      </div>

      {state === "done" ? (
        <p role="status" className="text-ink md:text-right">
          Hotovo, jste přihlášeni.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="w-full md:max-w-md">
          <div className="flex flex-col gap-2 sm:flex-row">
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
              className="min-h-[44px] flex-1 border border-slate/30 bg-paper px-3.5 text-sm text-ink placeholder:text-slate/50 focus-visible:border-brand-deep focus-visible:outline-none"
            />
            {/* Honeypot */}
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
            <button
              type="submit"
              disabled={state === "sending"}
              className="min-h-[44px] border border-slate/30 px-6 font-label-md text-label-md uppercase tracking-wider text-ink transition-colors hover:border-brand hover:bg-brand/5 disabled:opacity-50"
            >
              {state === "sending" ? "Odesílám…" : "Odebírat"}
            </button>
          </div>
          <p className="mt-2 text-xs text-slate/80">
            Odesláním souhlasíte se zasíláním novinek.{" "}
            <Link href="/privacy" className="underline hover:text-ink">
              Ochrana soukromí
            </Link>
          </p>
          {state === "error" && (
            <p role="alert" className="mt-2 text-sm text-danger">
              {message}
            </p>
          )}
        </form>
      )}
    </section>
  );
}
