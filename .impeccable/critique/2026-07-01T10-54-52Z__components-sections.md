---
target: full site sections
total_score: 26
p0_count: 1
p1_count: 2
timestamp: 2026-07-01T10-54-52Z
slug: components-sections
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Contact form has no loading/success state; `mailto:` fails silently on systems with no mail client |
| 2 | Match System / Real World | 3 | Czech copy is natural and accurate; `Naše cesta` heading is a cliché; emoji icons in modal clash with typographic system |
| 3 | User Control and Freedom | 3 | Modal dismissal and carousel nav are solid; Specializace hover→click split model is undisclosed |
| 4 | Consistency and Standards | 3 | `!important` Tailwind overrides on button padding across three call sites; Realizace stat display uses raw type outside token system |
| 5 | Error Prevention | 2 | `type="text"` contact field accepts malformed input; `noValidate` bypasses browser defaults; validation only checks empty |
| 6 | Recognition Rather Than Recall | 3 | Active tab, carousel position, and sticky nav solid; Brands marquee has no pause affordance on mobile |
| 7 | Flexibility and Efficiency | 2 | No direct phone link in mobile sticky nav; Specializace hover activation invisible to keyboard users |
| 8 | Aesthetic and Minimalist Design | 3 | WhyTarus stat list is best-in-class; FinalCta dot-pattern adds noise; emoji icons break modal minimalism |
| 9 | Error Recovery | 2 | Single bottom-status error message, no inline field-adjacent feedback, no focus move to first invalid field |
| 10 | Help and Documentation | 3 | Response time promise in modal is well-set; no product depth or delivery geography surfaced before contact |
| **Total** | | **26/40** | **Acceptable — significant improvements needed** |

## Anti-Patterns Verdict

**LLM assessment**: Not AI slop. The WhyTarus editorial stat list rejects the card-grid default. Single-family weight-contrast typography is deliberate. No gradient text, no glassmorphism, no cream background, no hero-metric template. Closest tells: FinalCta dot-pattern background (SaaS-adjacent), `Naše cesta` timeline (most commonly generated Czech company section), emoji icons in ContactModal (📞 ✉️ 📝) are the single most incongruous element on the entire site.

**Deterministic scan**: Exit code 0 — zero findings. No banned patterns detected across `components/` and `app/` directories.

## Priority Issues

**[P0] Contact form submits via `mailto:` with no backend and no reliable delivery**
- Why it matters: On corporate systems without a configured mail client, the form fails silently and TARUS loses every lead from those environments.
- Fix: Implement a real form endpoint (Next.js API route + Resend or Formspree). Add loading spinner, success confirmation, error retry.
- Command: /impeccable harden

**[P1] Form error feedback is color-only and non-proximate**
- Why it matters: Single bottom-status string in danger-red; no inline error adjacent to failing input; fails WCAG 1.3.3 and 3.3.1.
- Fix: Add `<p role="alert">` below each invalid input. Add `border-danger` to invalid inputs. Focus first invalid field on failed submit.
- Command: /impeccable harden

**[P1] ContactModal presents three equal-weight contact channels at peak conversion intent**
- Why it matters: Choice paralysis at the exact moment of highest intent. Emoji icons break the typographic-only design system.
- Fix: Promote form to primary position. Compress phone + email to a compact strip. Remove emoji icons.
- Command: /impeccable layout

**[P2] OFirme section is an emotional valley with no visual distinction**
- Why it matters: Generic 2-column text/placeholder layout after the high-energy Realizace section. Pavel will skip it.
- Fix: Add a pull-quote testimonial blockquote or replace placeholder image with a technical diagram.
- Command: /impeccable bolder

**[P2] NaseCesta heading and structure are generic corporate scaffolding**
- Why it matters: `Naše cesta` + 5-node equal-weight timeline contradicts the anti-reference list and signals marketing over expertise.
- Fix: Reframe as a technical capability timeline, or cut the section and merge content into OFirme.
- Command: /impeccable distill

## Persona Red Flags

**Jordan**: No pricing signal; no third-party social proof; CTA modal affordance missing; e-shop presented 4× as secondary with no description of what's in it.

**Casey**: Specializace label→image connection breaks on mobile scroll; Brands marquee no tap-to-pause; footer legal links point to `#`.

**Pavel**: `mailto:` labeled as "Otevírá se e-mailový klient..."; no delivery geography; no product depth/SKU count; no callback option despite 24h response promise.

## Minor Observations

- Navbar E-shop `text-paper/50` may not meet WCAG 1.4.3 3:1 for non-decorative text
- FinalCta body copy repeats hero pitch verbatim — closing CTA should escalate, not replay
- NaseCesta timeline loses its metaphor entirely on mobile (horizontal layout collapses to flat vertical list)
- `OFirme.tsx` uses array index as React key on `aboutParagraphs.map`
- WhyTarus stat values should be confirmed as real numbers before launch
