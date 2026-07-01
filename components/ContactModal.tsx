"use client";

import * as React from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { company, siteConfig } from "@/data/content";


type ContactModalContextValue = {
  open: () => void;
};

const ContactModalContext = React.createContext<ContactModalContextValue | null>(
  null
);

type FormStatus = "idle" | "submitting" | "success" | "error";

export function ContactModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [formStatus, setFormStatus] = React.useState<FormStatus>("idle");
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [nameError, setNameError] = React.useState<string | null>(null);
  const [contactError, setContactError] = React.useState<string | null>(null);
  const nameRef = React.useRef<HTMLInputElement>(null);
  const contactRef = React.useRef<HTMLInputElement>(null);
  const titleId = "contact-modal-title";

  function handleClose() {
    setOpen(false);
    // Reset after Dialog exit animation completes
    setTimeout(() => {
      setFormStatus("idle");
      setServerError(null);
      setNameError(null);
      setContactError(null);
    }, 350);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value.trim();
    const contact = (form.elements.namedItem("contact") as HTMLInputElement).value.trim();
    const message = (form.elements.namedItem("message") as HTMLTextAreaElement).value.trim();

    // Inline field validation — clear previous server error
    const newNameError = !name ? "Vyplňte prosím jméno." : null;
    const newContactError = !contact ? "Vyplňte prosím telefon nebo e-mail." : null;
    setNameError(newNameError);
    setContactError(newContactError);
    setServerError(null);

    if (newNameError || newContactError) {
      // Move focus to the first invalid field so keyboard and screen reader users land on the error
      if (newNameError) {
        nameRef.current?.focus();
      } else {
        contactRef.current?.focus();
      }
      return;
    }

    setFormStatus("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, contact, message }),
      });
      const data: { ok?: boolean; error?: string } = await res.json();
      if (!res.ok || !data.ok) {
        setServerError(data.error ?? "Nepodařilo se odeslat zprávu. Zkuste to prosím znovu.");
        setFormStatus("error");
      } else {
        setFormStatus("success");
      }
    } catch {
      setServerError("Připojení se nezdařilo. Zkontrolujte připojení k internetu a zkuste to znovu.");
      setFormStatus("error");
    }
  }

  const isSubmitting = formStatus === "submitting";

  return (
    <ContactModalContext.Provider value={{ open: () => setOpen(true) }}>
      {children}
      <Dialog open={open} onClose={handleClose} titleId={titleId}>
        {/* Header */}
        <div className="mb-7 text-center">
          <h2 id={titleId} className="font-display-lg text-2xl font-bold text-paper md:text-3xl">
            Kontaktujte nás — rádi poradíme
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-paper/60">
            Domluvte si schůzku, zeptejte se na sortiment nebo nám pošlete poptávku. Odpovídáme do 24 hodin.
          </p>
        </div>

        {/* Quick contact strip — phone + email, compact, visually secondary */}
        <div className="flex flex-col gap-5 border border-white/10 p-5 sm:flex-row sm:gap-0 sm:divide-x sm:divide-white/10">
          <a
            href={siteConfig.phoneHref}
            className="group flex flex-col gap-0.5 sm:w-1/2 sm:pr-8"
          >
            <span className="text-xs text-paper/40">Telefon · pracovní dny 8–16 h</span>
            <span className="text-xl font-bold text-brand transition-colors group-hover:text-brand-deep">
              {siteConfig.phone}
            </span>
          </a>
          <a
            href={`mailto:${siteConfig.email}`}
            className="group flex flex-col gap-0.5 sm:w-1/2 sm:pl-8"
          >
            <span className="text-xs text-paper/40">E-mail · odpovídáme do 24 h</span>
            <span className="break-all text-xl font-bold text-brand transition-colors group-hover:text-brand-deep">
              {siteConfig.email}
            </span>
          </a>
        </div>

        {/* Divider */}
        <div className="relative my-7 border-t border-white/10">
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#161b1f] px-3 text-xs text-paper/30">
            nebo formulářem
          </span>
        </div>

        {/* Success state */}
        {formStatus === "success" ? (
          <div className="flex flex-col items-center gap-4 py-6 text-center" role="status" aria-live="polite">
            <div className="flex h-12 w-12 items-center justify-center border border-brand/30 bg-brand/10">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path
                  d="M4 10l4.5 4.5L16 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="stroke-brand"
                />
              </svg>
            </div>
            <div>
              <p className="font-bold text-paper">Poptávka odeslána</p>
              <p className="mt-1 text-sm text-paper/60">
                Ozveme se vám do 24 hodin v pracovní dny.
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="mt-2 text-sm text-paper/50 underline-offset-2 hover:text-paper/80 hover:underline"
            >
              Zavřít okno
            </button>
          </div>
        ) : (
          /* Form — primary action */
          <form
            onSubmit={handleSubmit}
            className="space-y-3"
            noValidate
            aria-label="Kontaktní formulář"
          >
            <div>
              <label className="sr-only" htmlFor="cf-name">
                Jméno
              </label>
              <Input
                ref={nameRef}
                id="cf-name"
                name="name"
                type="text"
                required
                aria-required="true"
                aria-invalid={nameError ? "true" : undefined}
                aria-describedby={nameError ? "cf-name-error" : undefined}
                placeholder="Jméno"
                className="border-white/15 bg-white/5 text-paper placeholder:text-paper/45"
                disabled={isSubmitting}
              />
              {nameError && (
                <p id="cf-name-error" role="alert" className="mt-1.5 text-xs text-danger">
                  {nameError}
                </p>
              )}
            </div>

            <div>
              <label className="sr-only" htmlFor="cf-contact">
                Telefon nebo e-mail
              </label>
              <Input
                ref={contactRef}
                id="cf-contact"
                name="contact"
                type="text"
                required
                aria-required="true"
                aria-invalid={contactError ? "true" : undefined}
                aria-describedby={contactError ? "cf-contact-error" : undefined}
                placeholder="Telefon nebo e-mail pro odpověď"
                className="border-white/15 bg-white/5 text-paper placeholder:text-paper/45"
                disabled={isSubmitting}
              />
              {contactError && (
                <p id="cf-contact-error" role="alert" className="mt-1.5 text-xs text-danger">
                  {contactError}
                </p>
              )}
            </div>

            <div>
              <label className="sr-only" htmlFor="cf-message">
                Zpráva
              </label>
              <Textarea
                id="cf-message"
                name="message"
                rows={3}
                placeholder="Vaše zpráva (nepovinné)"
                className="border-white/15 bg-white/5 text-paper placeholder:text-paper/45"
                disabled={isSubmitting}
              />
            </div>

            <Button
              type="submit"
              className="w-full justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Odesílám…" : "Odeslat poptávku"}
            </Button>

            {serverError && (
              <p role="alert" aria-live="assertive" className="text-xs text-danger">
                {serverError}
              </p>
            )}
          </form>
        )}

        {/* Shop escape hatch — low visual weight, clearly secondary */}
        <div className="mt-8 border-t border-white/10 pt-6 text-center">
          <p className="mb-2 text-xs text-paper/40">
            Potřebujete pouze objednat materiál?
          </p>
          <a
            href={siteConfig.shopUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-paper/50 transition-colors hover:text-paper/80"
          >
            Přejít do e-shopu →
          </a>
        </div>

        {/* Company legal strip */}
        <div className="mt-5 border-t border-white/10 pt-5 text-center text-xs text-paper/35">
          {company.name} · IČO: {company.ico} · DIČ: {company.dic}
          {" · "}
          {company.address.street}, {company.address.city}
        </div>
      </Dialog>
    </ContactModalContext.Provider>
  );
}

export function useContactModal() {
  const ctx = React.useContext(ContactModalContext);
  if (!ctx) {
    throw new Error("useContactModal must be used within ContactModalProvider");
  }
  return ctx;
}
