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

/**
 * Read-this-before-editing:
 * There is no backend yet (this is a static Next.js app with no API
 * route wired up). Rather than faking a "message sent" confirmation
 * that does nothing, the form falls back to opening the user's e-mail
 * client with a prefilled message — an honest, zero-backend solution.
 * Before launch, replace handleSubmit with a real POST to an API
 * route / Formspree / Netlify Forms endpoint.
 */
export function ContactModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [status, setStatus] = React.useState<string | null>(null);
  const [nameError, setNameError] = React.useState(false);
  const [contactError, setContactError] = React.useState(false);
  const titleId = "contact-modal-title";

  function handleClose() {
    setOpen(false);
    setStatus(null);
    setNameError(false);
    setContactError(false);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value.trim();
    const contact = (
      form.elements.namedItem("contact") as HTMLInputElement
    ).value.trim();
    const message = (
      form.elements.namedItem("message") as HTMLTextAreaElement
    ).value.trim();

    if (!name || !contact) {
      setNameError(!name);
      setContactError(!contact);
      setStatus("Vyplňte prosím jméno a telefon nebo e-mail.");
      return;
    }

    setNameError(false);
    setContactError(false);
    const subject = encodeURIComponent(`Poptávka z webu — ${name}`);
    const body = encodeURIComponent(
      `Jméno: ${name}\nKontakt: ${contact}\n\nZpráva:\n${message || "(bez zprávy)"}`
    );
    window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${body}`;
    setStatus(`Otevírá se e-mailový klient s předvyplněnou zprávou. Pokud se nic nestalo, napište přímo na ${siteConfig.email}.`);
  }

  return (
    <ContactModalContext.Provider value={{ open: () => setOpen(true) }}>
      {children}
      <Dialog open={open} onClose={handleClose} titleId={titleId}>
        <div className="mb-10 text-center">
          <h2 id={titleId} className="font-display-lg text-2xl font-bold text-paper md:text-3xl">
            Kontaktujte nás — rádi poradíme
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-paper/60">
            Domluvte si schůzku, zeptejte se na sortiment nebo nám pošlete poptávku. Odpovídáme do 24 hodin.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 md:gap-10 md:divide-x md:divide-white/10">
          <div className="text-center md:pr-8 md:text-left">
            <span className="text-2xl" aria-hidden="true">
              📞
            </span>
            <h3 className="mb-2 mt-3 font-display-lg text-lg font-bold text-paper">
              Telefon
            </h3>
            <p className="mb-4 text-sm text-paper/60">
              Nejrychlejší odpověď, pracovní dny 8–16 h.
            </p>
            <a
              href={siteConfig.phoneHref}
              className="font-display-lg text-xl font-bold text-brand transition-colors hover:text-brand-deep"
            >
              {siteConfig.phone}
            </a>
          </div>

          <div className="text-center md:px-8 md:text-left">
            <span className="text-2xl" aria-hidden="true">
              ✉️
            </span>
            <h3 className="mb-2 mt-3 font-display-lg text-lg font-bold text-paper">
              E-mail
            </h3>
            <p className="mb-4 text-sm text-paper/60">
              Napište popis poptávky, ozveme se do 24 hodin.
            </p>
            <a
              href={`mailto:${siteConfig.email}`}
              className="break-all font-display-lg text-xl font-bold text-brand transition-colors hover:text-brand-deep"
            >
              {siteConfig.email}
            </a>
          </div>

          <div className="text-left md:pl-8">
            <span className="text-2xl" aria-hidden="true">
              📝
            </span>
            <h3 className="mb-2 mt-3 font-display-lg text-lg font-bold text-paper">
              Formulář
            </h3>
            <p className="mb-4 text-sm text-paper/60">
              Zeptejte se nebo si domluvte schůzku přímo odsud.
            </p>

            <form
              onSubmit={handleSubmit}
              className="space-y-3"
              noValidate
              aria-describedby="cf-status"
            >
              <label className="sr-only" htmlFor="cf-name">
                Jméno
              </label>
              <Input
                id="cf-name"
                name="name"
                type="text"
                required
                aria-required="true"
                aria-invalid={nameError ? "true" : undefined}
                placeholder="Jméno"
                className="border-white/15 bg-white/5 text-paper placeholder:text-paper/45"
              />
              <label className="sr-only" htmlFor="cf-contact">
                Telefon nebo e-mail
              </label>
              <Input
                id="cf-contact"
                name="contact"
                type="text"
                required
                aria-required="true"
                aria-invalid={contactError ? "true" : undefined}
                placeholder="Telefon nebo e-mail pro odpověď"
                className="border-white/15 bg-white/5 text-paper placeholder:text-paper/45"
              />
              <label className="sr-only" htmlFor="cf-message">
                Zpráva
              </label>
              <Textarea
                id="cf-message"
                name="message"
                rows={3}
                placeholder="Vaše zpráva (nepovinné)"
                className="border-white/15 bg-white/5 text-paper placeholder:text-paper/45"
              />
              <Button type="submit" className="w-full justify-center">
                Odeslat poptávku
              </Button>
              <p
                id="cf-status"
                role="status"
                aria-live="polite"
                className={`text-xs ${(nameError || contactError) ? "text-danger" : "text-paper/60"}`}
              >
                {status}
              </p>
            </form>
          </div>
        </div>

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
