import { Link } from "@/i18n/navigation";
import { Reveal } from "./reveal";

interface CtaSectionProps {
  eyebrow?: string;
  title: string;
  text: string;
  buttonLabel: string;
  buttonHref: string;
}

/** Bloc de fin de page : appel à l'action réutilisable. */
export function CtaSection({
  eyebrow,
  title,
  text,
  buttonLabel,
  buttonHref,
}: CtaSectionProps) {
  return (
    <section className="border-t border-mist/10 bg-ink-deep">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <Reveal>
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h2 className="display-2 mt-6 max-w-3xl text-balance text-white">
            {title}
          </h2>
          <p className="lede mt-6 max-w-2xl">{text}</p>
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
