import { Link } from "@/i18n/navigation";
import { Reveal } from "./reveal";

interface CtaSectionProps {
  eyebrow?: string;
  title: string;
  text?: string;
  /** Paragraphes alternatifs (remplacent `text` s'ils sont fournis) */
  paragraphs?: string[];
  buttonLabel: string;
  buttonHref: string;
}

/** Bloc de fin de page : appel à l'action réutilisable. */
export function CtaSection({
  eyebrow,
  title,
  text,
  paragraphs,
  buttonLabel,
  buttonHref,
}: CtaSectionProps) {
  const lines = paragraphs ?? (text ? [text] : []);
  return (
    <section className="border-t border-mist/10 bg-ink-deep">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <Reveal>
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h2 className="display-2 mt-6 max-w-3xl text-balance text-white">
            {title}
          </h2>
          {lines.length > 0 ? (
            <div className="mt-6 max-w-2xl space-y-4">
              {lines.map((line, i) => (
                <p key={i} className={i === 0 ? "lede" : "text-[1rem] leading-[1.85] text-silver/90"}>
                  {line}
                </p>
              ))}
            </div>
          ) : null}
          <Link href={buttonHref} className="btn-accent mt-10">
            {buttonLabel}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
