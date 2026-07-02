"use client";

import * as React from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { company, siteConfig } from "@/data/content";

// ── Validation ────────────────────────────────────────────────────────────────

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

function validateEmail(email: string): boolean {
  return email.trim().length > 0 && email.includes("@");
}

function validatePhone(phone: string): boolean {
  return /^\d{9,}$/.test(phone.replace(/[\s\-().+]/g, ""));
}

const DOTAZ_MIN = 3;
const DOTAZ_MAX = 10_000;

// ── Types ─────────────────────────────────────────────────────────────────────

type ContactModalContextValue = { open: () => void };
const ContactModalContext = React.createContext<ContactModalContextValue | null>(null);

type FormStatus = "idle" | "submitting" | "success" | "error";
type AresStatus = "idle" | "loading" | "found" | "notfound" | "unavailable";

// ── Small UI helpers ──────────────────────────────────────────────────────────

function Spinner({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"
        strokeDasharray="40" strokeDashoffset="10" />
    </svg>
  );
}

function FieldError({ id, message }: { id: string; message: string }) {
  return <p id={id} role="alert" className="mt-1.5 text-xs text-danger">{message}</p>;
}

// ── Provider ─────────────────────────────────────────────────────────────────

export function ContactModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [formStatus, setFormStatus] = React.useState<FormStatus>("idle");
  const [serverError, setServerError] = React.useState<string | null>(null);

  // Field values
  const [ico, setIco] = React.useState("");
  const [firma, setFirma] = React.useState("");
  const [firmaLocked, setFirmaLocked] = React.useState(false);
  const [kontaktOsoba, setKontaktOsoba] = React.useState("");
  const [telefon, setTelefon] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [dotaz, setDotaz] = React.useState("");

  // ARES state
  const [aresStatus, setAresStatus] = React.useState<AresStatus>("idle");
  const [aresName, setAresName] = React.useState("");

  // "touched" set — errors appear only after blur or submit attempt
  const [touched, setTouched] = React.useState<Set<string>>(new Set());

  // Refs for ARES race-condition prevention
  const aresTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const aresAbortRef = React.useRef<AbortController | null>(null);
  // Sync ref so the ARES effect can read firmaLocked without it being a dep
  const firmaLockedRef = React.useRef(false);
  firmaLockedRef.current = firmaLocked;

  const titleId = "contact-modal-title";

  // Stable close handler — must not change reference on re-renders (Dialog dep)
  const handleClose = React.useCallback(() => {
    setIsOpen(false);
    setTimeout(() => {
      setFormStatus("idle");
      setServerError(null);
      setIco("");
      setFirma("");
      setFirmaLocked(false);
      setKontaktOsoba("");
      setTelefon("");
      setEmail("");
      setDotaz("");
      setAresStatus("idle");
      setAresName("");
      setTouched(new Set());
    }, 350);
  }, []);

  // ── ARES: debounced, AbortController-guarded lookup ──────────────────────
  // Triggered onChange whenever ICO reaches 8 digits. Cancels previous
  // inflight request and pending timer before scheduling a new one.

  React.useEffect(() => {
    if (aresTimerRef.current) clearTimeout(aresTimerRef.current);
    if (aresAbortRef.current) aresAbortRef.current.abort();

    const cleaned = ico.replace(/\D/g, "");

    if (cleaned.length < 8) {
      // Incomplete — reset ARES, unlock firma only if ARES had filled it
      setAresStatus("idle");
      if (firmaLockedRef.current) {
        setFirma("");
        setFirmaLocked(false);
      }
      return;
    }

    const padded = cleaned.padStart(8, "0");
    setAresStatus("loading");

    aresTimerRef.current = setTimeout(async () => {
      const ctrl = new AbortController();
      aresAbortRef.current = ctrl;

      try {
        const res = await fetch(`/api/ares?ico=${encodeURIComponent(padded)}`, {
          signal: ctrl.signal,
        });
        const data: { obchodniJmeno?: string; error?: string } = await res.json();

        if (res.ok && data.obchodniJmeno) {
          setAresStatus("found");
          setAresName(data.obchodniJmeno);
          setFirma(data.obchodniJmeno);
          setFirmaLocked(true);
        } else if (res.status === 404) {
          setAresStatus("notfound");
          setFirmaLocked(false);
        } else {
          setAresStatus("unavailable");
          setFirmaLocked(false);
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") return; // superseded request
        setAresStatus("unavailable");
        setFirmaLocked(false);
      }
    }, 300);

    return () => {
      if (aresTimerRef.current) clearTimeout(aresTimerRef.current);
      if (aresAbortRef.current) aresAbortRef.current.abort();
    };
  }, [ico]); // firmaLockedRef is a ref — intentionally not a dep

  // ── Touch helpers ─────────────────────────────────────────────────────────

  const touch = React.useCallback((field: string) => {
    setTouched((prev) => {
      if (prev.has(field)) return prev; // no re-render if already touched
      return new Set([...prev, field]);
    });
  }, []);

  const isTouched = (field: string) => touched.has(field);

  // ── Derived errors (recomputed on every render — never sticky) ───────────

  const icoError = isTouched("ico") && ico && !validateIco(ico)
    ? "Neplatné IČO — zkontrolujte číslo."
    : null;

  const firmaError = isTouched("firma") && !firma.trim()
    ? "Zadejte název firmy."
    : null;

  const kontaktOsobaError = isTouched("kontaktOsoba") && !kontaktOsoba.trim()
    ? "Zadejte kontaktní osobu."
    : null;

  // Format-only validation — neither field is required
  const telefonError = isTouched("telefon") && telefon.trim() && !validatePhone(telefon)
    ? "Neplatné telefonní číslo."
    : null;

  const emailError = isTouched("email") && email.trim() && !validateEmail(email)
    ? "Neplatný e-mail."
    : null;

  const dotazLen = dotaz.trim().length;
  const dotazError = isTouched("dotaz")
    ? (dotazLen < DOTAZ_MIN ? `Dotaz musí mít alespoň ${DOTAZ_MIN} znaky.`
      : dotazLen > DOTAZ_MAX ? `Dotaz je příliš dlouhý (max ${DOTAZ_MAX.toLocaleString("cs")} znaků).`
      : null)
    : null;

  const showCharCount = dotazLen > 9_000;

  // ── Submit ────────────────────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Touch everything to reveal all errors
    setTouched(new Set(["ico", "firma", "kontaktOsoba", "telefon", "email", "dotaz"]));

    const valid =
      firma.trim() &&
      kontaktOsoba.trim() &&
      (!telefon.trim() || validatePhone(telefon)) &&
      (!email.trim() || validateEmail(email)) &&
      dotazLen >= DOTAZ_MIN &&
      dotazLen <= DOTAZ_MAX;

    if (!valid) return;

    setFormStatus("submitting");
    setServerError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ico: ico ? ico.padStart(8, "0") : "",
          firma: firma.trim(),
          kontaktOsoba: kontaktOsoba.trim(),
          telefon: telefon.trim(),
          email: email.trim(),
          dotaz: dotaz.trim(),
        }),
      });
      const data: { ok?: boolean; error?: string } = await res.json();
      if (!res.ok || !data.ok) {
        setServerError(data.error ?? "Nepodařilo se odeslat. Zkuste to znovu.");
        setFormStatus("error");
      } else {
        setFormStatus("success");
      }
    } catch {
      setServerError("Připojení se nezdařilo. Zkontrolujte internet a zkuste to znovu.");
      setFormStatus("error");
    }
  }

  const isSubmitting = formStatus === "submitting";

  return (
    <ContactModalContext.Provider value={{ open: () => setIsOpen(true) }}>
      {children}
      <Dialog open={isOpen} onClose={handleClose} titleId={titleId}>

        {/* Header */}
        <div className="mb-7 text-center">
          <h2 id={titleId} className="font-display-lg text-2xl font-bold text-paper md:text-3xl">
            Kontaktujte nás — rádi poradíme
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-paper/60">
            Pošlete nám poptávku nebo dotaz. Odpovídáme do 24 hodin v pracovní dny.
          </p>
        </div>

        {/* Success */}
        {formStatus === "success" ? (
          <div className="flex flex-col items-center gap-4 py-8 text-center" role="status" aria-live="polite">
            <div className="flex h-12 w-12 items-center justify-center border border-brand/30 bg-brand/10">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M4 10l4.5 4.5L16 6" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" className="stroke-brand" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-paper">Poptávka odeslána</p>
              <p className="mt-1 text-sm text-paper/60">Děkujeme. Ozveme se vám co nejdříve.</p>
            </div>
            <button type="button" onClick={handleClose}
              className="mt-2 text-sm text-paper/50 underline-offset-2 hover:text-paper/80 hover:underline">
              Zavřít okno
            </button>
          </div>
        ) : (

          /* Form */
          <form onSubmit={handleSubmit} className="space-y-3" noValidate aria-label="Kontaktní formulář">

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
                  placeholder="IČO"
                  className="border-white/15 bg-white/5 text-paper placeholder:text-paper/45"
                  value={ico}
                  onChange={(e) => setIco(e.target.value.replace(/\D/g, "").slice(0, 8))}
                  onBlur={() => touch("ico")}
                  disabled={isSubmitting}
                  aria-invalid={icoError ? "true" : undefined}
                  aria-describedby={icoError ? "cf-ico-error" : undefined}
                />
                {icoError && <FieldError id="cf-ico-error" message={icoError} />}
              </div>

              {/* Firma — auto-filled + locked by ARES, manual otherwise */}
              <div>
                <label className="sr-only" htmlFor="cf-firma">Název firmy</label>
                <Input
                  id="cf-firma"
                  name="firma"
                  type="text"
                  placeholder={aresStatus === "loading" ? "Ověřuji IČO…" : "Název firmy"}
                  className="border-white/15 bg-white/5 text-paper placeholder:text-paper/45 disabled:cursor-not-allowed disabled:opacity-50"
                  value={firma}
                  onChange={(e) => setFirma(e.target.value)}
                  onBlur={() => touch("firma")}
                  disabled={isSubmitting || firmaLocked || aresStatus === "loading"}
                  aria-invalid={firmaError ? "true" : undefined}
                  aria-describedby={
                    firmaError ? "cf-firma-error"
                    : aresStatus === "found" ? "cf-firma-ares"
                    : undefined
                  }
                />
                {firmaError && <FieldError id="cf-firma-error" message={firmaError} />}
                {aresStatus === "loading" && !firmaError && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-paper/50">
                    <Spinner className="h-3 w-3" /> Ověřuji v ARES…
                  </p>
                )}
                {aresStatus === "found" && !firmaError && (
                  <p id="cf-firma-ares" className="mt-1.5 text-xs text-brand">
                    ✓ {aresName} — ověřeno v ARES
                  </p>
                )}
                {(aresStatus === "notfound" || aresStatus === "unavailable") && (
                  <p className="mt-1.5 text-xs text-paper/50">
                    {aresStatus === "notfound"
                      ? "Firma nenalezena — doplňte ručně."
                      : "ARES nedostupný — doplňte ručně."}
                  </p>
                )}
              </div>
            </div>

            {/* Kontaktní osoba */}
            <div>
              <label className="sr-only" htmlFor="cf-kontaktOsoba">Kontaktní osoba</label>
              <Input
                id="cf-kontaktOsoba"
                name="kontaktOsoba"
                type="text"
                placeholder="Kontaktní osoba"
                className="border-white/15 bg-white/5 text-paper placeholder:text-paper/45"
                value={kontaktOsoba}
                onChange={(e) => setKontaktOsoba(e.target.value)}
                onBlur={() => touch("kontaktOsoba")}
                disabled={isSubmitting}
                aria-invalid={kontaktOsobaError ? "true" : undefined}
                aria-describedby={kontaktOsobaError ? "cf-kontaktOsoba-error" : undefined}
              />
              {kontaktOsobaError && <FieldError id="cf-kontaktOsoba-error" message={kontaktOsobaError} />}
            </div>

            {/* Telefon + E-mail — stačí jedno */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="sr-only" htmlFor="cf-telefon">Telefon</label>
                <Input
                  id="cf-telefon"
                  name="telefon"
                  type="tel"
                  placeholder="Telefon"
                  className="border-white/15 bg-white/5 text-paper placeholder:text-paper/45"
                  value={telefon}
                  onChange={(e) => setTelefon(e.target.value)}
                  onBlur={() => touch("telefon")}
                  disabled={isSubmitting}
                  aria-invalid={telefonError ? "true" : undefined}
                  aria-describedby={telefonError ? "cf-telefon-error" : undefined}
                />
                {telefonError && <FieldError id="cf-telefon-error" message={telefonError} />}
              </div>
              <div>
                <label className="sr-only" htmlFor="cf-email">E-mail</label>
                <Input
                  id="cf-email"
                  name="email"
                  type="email"
                  placeholder="E-mail"
                  className="border-white/15 bg-white/5 text-paper placeholder:text-paper/45"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => touch("email")}
                  disabled={isSubmitting}
                  aria-invalid={emailError ? "true" : undefined}
                  aria-describedby={emailError ? "cf-email-error" : undefined}
                />
                {emailError && <FieldError id="cf-email-error" message={emailError} />}
              </div>
            </div>

            {/* Dotaz */}
            <div>
              <label className="sr-only" htmlFor="cf-dotaz">Dotaz</label>
              <Textarea
                id="cf-dotaz"
                name="dotaz"
                rows={4}
                placeholder="Váš dotaz nebo poptávka"
                className="border-white/15 bg-white/5 text-paper placeholder:text-paper/45"
                value={dotaz}
                onChange={(e) => setDotaz(e.target.value)}
                onBlur={() => touch("dotaz")}
                disabled={isSubmitting}
                aria-invalid={dotazError ? "true" : undefined}
                aria-describedby={[
                  dotazError ? "cf-dotaz-error" : "",
                  showCharCount ? "cf-dotaz-count" : "",
                ].filter(Boolean).join(" ") || undefined}
              />
              <div className="mt-1 flex min-h-5 items-start justify-between gap-2">
                <div>
                  {dotazError && <FieldError id="cf-dotaz-error" message={dotazError} />}
                </div>
                {showCharCount && (
                  <p
                    id="cf-dotaz-count"
                    className={`shrink-0 text-xs tabular-nums ${dotazLen > DOTAZ_MAX ? "text-danger" : "text-paper/40"}`}
                  >
                    {dotazLen.toLocaleString("cs")}&thinsp;/&thinsp;{DOTAZ_MAX.toLocaleString("cs")}
                  </p>
                )}
              </div>
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full justify-center" disabled={isSubmitting}>
              {isSubmitting
                ? <span className="flex items-center gap-2"><Spinner />Odesílám…</span>
                : "Odeslat poptávku"
              }
            </Button>

            {serverError && (
              <p role="alert" aria-live="assertive" className="text-xs text-danger">{serverError}</p>
            )}
          </form>
        )}

        {/* Secondary strip: email + e-shop side by side (stacks on mobile) */}
        <div className="mt-6 border-t border-white/10 pt-5">
          <p className="mb-4 text-center text-xs text-paper/30">nebo kontaktujte přímo</p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-52">
            {/* E-mail */}
            <a
              href={`mailto:${siteConfig.email}`}
              className="group flex flex-col gap-0.5 text-center sm:text-left"
            >
              <span className="text-xs text-paper/55">E-mail · odpovídáme do 24 h</span>
              <span className="break-all text-sm font-medium text-paper/60 transition-colors group-hover:text-paper/90">
                {siteConfig.email}
              </span>
            </a>
            {/* E-shop */}
            <div className="flex flex-col gap-0.5 text-center sm:text-left">
              <span className="text-xs text-paper/55">Pouze materiál?</span>
              <a
                href={siteConfig.shopUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-paper/60 transition-colors hover:text-paper/90"
              >
                Přejít do e-shopu →
              </a>
            </div>
          </div>
        </div>

        {/* Legal strip — phone lives here only */}
        <div className="mt-5 border-t border-white/10 pt-5 text-center text-xs text-paper/50">
          {company.name} · IČO: {company.ico} · DIČ: {company.dic}
          {" · "}
          {company.address.street}, {company.address.city}
          {" · telefon: "}
          <a href={siteConfig.phoneHref} className="transition-colors hover:text-paper/55">
            {siteConfig.phone}
          </a>
        </div>

      </Dialog>
    </ContactModalContext.Provider>
  );
}

export function useContactModal() {
  const ctx = React.useContext(ContactModalContext);
  if (!ctx) throw new Error("useContactModal must be used within ContactModalProvider");
  return ctx;
}
