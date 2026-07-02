"use client";

import * as React from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { company, siteConfig } from "@/data/content";

// ── Validation helpers ────────────────────────────────────────────────────────

/** Czech IČO checksum (8 digits, padded with leading zeros). */
function validateIco(raw: string): boolean {
  const v = raw.replace(/\s/g, "").padStart(8, "0");
  if (!/^\d{8}$/.test(v)) return false;
  const d = v.split("").map(Number);
  const weights = [8, 7, 6, 5, 4, 3, 2];
  const sum = d.slice(0, 7).reduce((acc, n, i) => acc + n * weights[i], 0);
  const r = sum % 11;
  const check = r === 0 ? 1 : r === 1 ? 0 : 11 - r;
  return d[7] === check;
}

/** Basic Czech phone: optional +420, then 9 digits starting with non-zero. */
function validatePhone(phone: string): boolean {
  const v = phone.replace(/[\s\-().]/g, "");
  return /^(\+420)?[1-9][0-9]{8}$/.test(v);
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

// ── Types ─────────────────────────────────────────────────────────────────────

type ContactModalContextValue = { open: () => void };
const ContactModalContext = React.createContext<ContactModalContextValue | null>(null);

type FormStatus = "idle" | "submitting" | "success" | "error";
type AresStatus = "idle" | "loading" | "found" | "notfound" | "unavailable";

type FieldErrors = {
  ico?: string;
  firma?: string;
  kontaktOsoba?: string;
  telefon?: string;
  email?: string;
  dotaz?: string;
};

// ── Spinner icon ──────────────────────────────────────────────────────────────

function Spinner({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        strokeDasharray="40"
        strokeDashoffset="10"
      />
    </svg>
  );
}

// ── Field error paragraph ─────────────────────────────────────────────────────

function FieldError({ id, message }: { id: string; message: string }) {
  return (
    <p id={id} role="alert" className="mt-1.5 text-xs text-danger">
      {message}
    </p>
  );
}

// ── Provider ─────────────────────────────────────────────────────────────────

export function ContactModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [formStatus, setFormStatus] = React.useState<FormStatus>("idle");
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [errors, setErrors] = React.useState<FieldErrors>({});

  // Controlled fields that need cross-field logic
  const [ico, setIco] = React.useState("");
  const [firma, setFirma] = React.useState("");
  const [aresStatus, setAresStatus] = React.useState<AresStatus>("idle");
  const [aresName, setAresName] = React.useState("");

  const formRef = React.useRef<HTMLFormElement>(null);
  const titleId = "contact-modal-title";

  function resetState() {
    setFormStatus("idle");
    setServerError(null);
    setErrors({});
    setIco("");
    setFirma("");
    setAresStatus("idle");
    setAresName("");
  }

  function handleClose() {
    setIsOpen(false);
    setTimeout(resetState, 350); // after Dialog exit animation
  }

  // ── ARES lookup ─────────────────────────────────────────────────────────────

  async function lookupAres(icoValue: string) {
    setAresStatus("loading");
    setFirma("");
    setAresName("");
    try {
      const res = await fetch(
        `/api/ares?ico=${encodeURIComponent(icoValue)}`,
        { signal: AbortSignal.timeout(7000) }
      );
      const data: { obchodniJmeno?: string; error?: string } = await res.json();
      if (res.ok && data.obchodniJmeno) {
        setAresStatus("found");
        setAresName(data.obchodniJmeno);
        setFirma(data.obchodniJmeno);
      } else if (res.status === 404) {
        setAresStatus("notfound");
      } else {
        setAresStatus("unavailable");
      }
    } catch {
      setAresStatus("unavailable");
    }
  }

  function handleIcoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value.replace(/\D/g, "").slice(0, 8);
    setIco(val);
    if (aresStatus !== "idle") {
      setAresStatus("idle");
      setAresName("");
      setFirma("");
    }
    if (errors.ico) setErrors((prev) => ({ ...prev, ico: undefined }));
  }

  function handleIcoBlur() {
    if (!ico) return;
    if (validateIco(ico)) {
      lookupAres(ico.padStart(8, "0"));
    }
  }

  // ── Submit ──────────────────────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;

    const kontaktOsoba = (
      form.elements.namedItem("kontaktOsoba") as HTMLInputElement
    ).value.trim();
    const telefon = (
      form.elements.namedItem("telefon") as HTMLInputElement
    ).value.trim();
    const emailVal = (
      form.elements.namedItem("email") as HTMLInputElement
    ).value.trim();
    const dotaz = (
      form.elements.namedItem("dotaz") as HTMLTextAreaElement
    ).value.trim();

    const icoPadded = ico.padStart(8, "0");

    const newErrors: FieldErrors = {};
    if (!validateIco(ico)) newErrors.ico = "Zadejte platné IČO.";
    if (!firma.trim()) newErrors.firma = "Zadejte název firmy.";
    if (!kontaktOsoba) newErrors.kontaktOsoba = "Zadejte kontaktní osobu.";
    if (!validatePhone(telefon)) newErrors.telefon = "Zadejte platné telefonní číslo (+420 nebo 9 číslic).";
    if (!validateEmail(emailVal)) newErrors.email = "Zadejte platnou e-mailovou adresu.";
    if (!dotaz) newErrors.dotaz = "Vyplňte prosím dotaz.";

    setErrors(newErrors);
    setServerError(null);

    if (Object.keys(newErrors).length > 0) {
      const firstKey = Object.keys(newErrors)[0];
      const el = form.elements.namedItem(firstKey) as HTMLElement | null;
      el?.focus();
      return;
    }

    setFormStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ico: icoPadded,
          firma: firma.trim(),
          kontaktOsoba,
          telefon,
          email: emailVal,
          dotaz,
        }),
      });
      const data: { ok?: boolean; error?: string } = await res.json();
      if (!res.ok || !data.ok) {
        setServerError(
          data.error ?? "Nepodařilo se odeslat zprávu. Zkuste to prosím znovu."
        );
        setFormStatus("error");
      } else {
        setFormStatus("success");
      }
    } catch {
      setServerError(
        "Připojení se nezdařilo. Zkontrolujte připojení k internetu a zkuste to znovu."
      );
      setFormStatus("error");
    }
  }

  const isSubmitting = formStatus === "submitting";
  const firmaDisabled = isSubmitting || aresStatus === "loading";

  return (
    <ContactModalContext.Provider value={{ open: () => setIsOpen(true) }}>
      {children}
      <Dialog open={isOpen} onClose={handleClose} titleId={titleId}>

        {/* ── Header ── */}
        <div className="mb-7 text-center">
          <h2
            id={titleId}
            className="font-display-lg text-2xl font-bold text-paper md:text-3xl"
          >
            Kontaktujte nás — rádi poradíme
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-paper/60">
            Pošlete nám poptávku nebo dotaz. Odpovídáme do 24 hodin v pracovní dny.
          </p>
        </div>

        {/* ── Success state ── */}
        {formStatus === "success" ? (
          <div
            className="flex flex-col items-center gap-4 py-8 text-center"
            role="status"
            aria-live="polite"
          >
            <div className="flex h-12 w-12 items-center justify-center border border-brand/30 bg-brand/10">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
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
                Děkujeme. Ozveme se vám co nejdříve.
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

          /* ── Form ── */
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="space-y-3"
            noValidate
            aria-label="Kontaktní formulář"
          >
            {/* Row 1: IČO + Firma */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_2fr]">

              {/* IČO */}
              <div>
                <label className="sr-only" htmlFor="cf-ico">IČO</label>
                <Input
                  id="cf-ico"
                  name="ico"
                  type="text"
                  inputMode="numeric"
                  maxLength={8}
                  required
                  aria-required="true"
                  aria-invalid={errors.ico ? "true" : undefined}
                  aria-describedby={errors.ico ? "cf-ico-error" : undefined}
                  placeholder="IČO"
                  className="border-white/15 bg-white/5 text-paper placeholder:text-paper/45"
                  value={ico}
                  onChange={handleIcoChange}
                  onBlur={handleIcoBlur}
                  disabled={isSubmitting}
                />
                {errors.ico && <FieldError id="cf-ico-error" message={errors.ico} />}
              </div>

              {/* Firma — auto-filled by ARES */}
              <div>
                <label className="sr-only" htmlFor="cf-firma">Firma</label>
                <Input
                  id="cf-firma"
                  name="firma"
                  type="text"
                  required
                  aria-required="true"
                  aria-invalid={errors.firma ? "true" : undefined}
                  aria-describedby={
                    errors.firma
                      ? "cf-firma-error"
                      : aresStatus === "found"
                      ? "cf-firma-ares"
                      : undefined
                  }
                  placeholder={
                    aresStatus === "loading" ? "Ověřuji IČO…" : "Název firmy"
                  }
                  className="border-white/15 bg-white/5 text-paper placeholder:text-paper/45"
                  value={firma}
                  onChange={(e) => {
                    setFirma(e.target.value);
                    if (errors.firma)
                      setErrors((prev) => ({ ...prev, firma: undefined }));
                  }}
                  disabled={firmaDisabled}
                />
                {errors.firma && (
                  <FieldError id="cf-firma-error" message={errors.firma} />
                )}
                {aresStatus === "loading" && !errors.firma && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-paper/50">
                    <Spinner className="h-3 w-3" /> Ověřuji IČO v ARES…
                  </p>
                )}
                {aresStatus === "found" && !errors.firma && (
                  <p id="cf-firma-ares" className="mt-1.5 text-xs text-brand">
                    ✓ {aresName} nalezena
                  </p>
                )}
                {(aresStatus === "notfound" || aresStatus === "unavailable") && (
                  <p className="mt-1.5 text-xs text-paper/50">
                    {aresStatus === "notfound"
                      ? "Firma nenalezena — doplňte ručně."
                      : "ARES není dostupný — doplňte ručně."}
                  </p>
                )}
              </div>
            </div>

            {/* Row 2: Kontaktní osoba */}
            <div>
              <label className="sr-only" htmlFor="cf-kontaktOsoba">Kontaktní osoba</label>
              <Input
                id="cf-kontaktOsoba"
                name="kontaktOsoba"
                type="text"
                required
                aria-required="true"
                aria-invalid={errors.kontaktOsoba ? "true" : undefined}
                aria-describedby={errors.kontaktOsoba ? "cf-kontaktOsoba-error" : undefined}
                placeholder="Kontaktní osoba"
                className="border-white/15 bg-white/5 text-paper placeholder:text-paper/45"
                disabled={isSubmitting}
              />
              {errors.kontaktOsoba && (
                <FieldError id="cf-kontaktOsoba-error" message={errors.kontaktOsoba} />
              )}
            </div>

            {/* Row 3: Telefon + E-mail */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="sr-only" htmlFor="cf-telefon">Telefon</label>
                <Input
                  id="cf-telefon"
                  name="telefon"
                  type="tel"
                  required
                  aria-required="true"
                  aria-invalid={errors.telefon ? "true" : undefined}
                  aria-describedby={errors.telefon ? "cf-telefon-error" : undefined}
                  placeholder="Telefon"
                  className="border-white/15 bg-white/5 text-paper placeholder:text-paper/45"
                  disabled={isSubmitting}
                />
                {errors.telefon && (
                  <FieldError id="cf-telefon-error" message={errors.telefon} />
                )}
              </div>
              <div>
                <label className="sr-only" htmlFor="cf-email">E-mail</label>
                <Input
                  id="cf-email"
                  name="email"
                  type="email"
                  required
                  aria-required="true"
                  aria-invalid={errors.email ? "true" : undefined}
                  aria-describedby={errors.email ? "cf-email-error" : undefined}
                  placeholder="E-mail"
                  className="border-white/15 bg-white/5 text-paper placeholder:text-paper/45"
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <FieldError id="cf-email-error" message={errors.email} />
                )}
              </div>
            </div>

            {/* Row 4: Dotaz */}
            <div>
              <label className="sr-only" htmlFor="cf-dotaz">Dotaz</label>
              <Textarea
                id="cf-dotaz"
                name="dotaz"
                rows={4}
                required
                aria-required="true"
                aria-invalid={errors.dotaz ? "true" : undefined}
                aria-describedby={errors.dotaz ? "cf-dotaz-error" : undefined}
                placeholder="Váš dotaz nebo poptávka"
                className="border-white/15 bg-white/5 text-paper placeholder:text-paper/45"
                disabled={isSubmitting}
              />
              {errors.dotaz && (
                <FieldError id="cf-dotaz-error" message={errors.dotaz} />
              )}
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              className="w-full justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Spinner />
                  Odesílám…
                </span>
              ) : (
                "Odeslat poptávku"
              )}
            </Button>

            {serverError && (
              <p role="alert" aria-live="assertive" className="text-xs text-danger">
                {serverError}
              </p>
            )}
          </form>
        )}

        {/* ── Divider ── */}
        <div className="relative my-7 border-t border-white/10">
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#161b1f] px-3 text-xs text-paper/30">
            nebo kontaktujte přímo
          </span>
        </div>

        {/* ── Secondary contact strip — subdued, not blue, not large ── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-0 sm:divide-x sm:divide-white/10">
          <a
            href={siteConfig.phoneHref}
            className="group flex flex-col gap-0.5 sm:w-1/2 sm:pr-8"
          >
            <span className="text-xs text-paper/40">
              Telefon · pracovní dny 8–16 h
            </span>
            <span className="text-sm font-medium text-paper/60 transition-colors group-hover:text-paper/90">
              {siteConfig.phone}
            </span>
          </a>
          <a
            href={`mailto:${siteConfig.email}`}
            className="group flex flex-col gap-0.5 sm:w-1/2 sm:pl-8"
          >
            <span className="text-xs text-paper/40">
              E-mail · odpovídáme do 24 h
            </span>
            <span className="break-all text-sm font-medium text-paper/60 transition-colors group-hover:text-paper/90">
              {siteConfig.email}
            </span>
          </a>
        </div>

        {/* ── E-shop escape hatch — stays ── */}
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

        {/* ── Legal strip ── */}
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
