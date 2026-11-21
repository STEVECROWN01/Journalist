import type { ReactNode } from "react";
import { Reveal } from "./reveal";

interface EditorialSectionProps {
  eyebrow: string;
  title: string;
  children: ReactNode;
  tinted?: boolean;
  titleId?: string;
}

/** Section éditoriale : surtitre sticky à gauche, contenu à droite. */
export function EditorialSection({
  eyebrow,
  title,
  children,
  tinted = false,
  titleId,
}: EditorialSectionProps) {
  return (
    <section
      aria-labelledby={titleId}
      className={`border-t border-mist/10 ${tinted ? "bg-surface/40" : ""}`}
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:py-28 lg:grid-cols-[1fr_2.2fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <p className="eyebrow">{eyebrow}</p>
          </Reveal>
        </div>
        <div>
          <Reveal>
            <h2
              id={titleId}
              className="display-2 max-w-2xl text-balance text-white"
            >
              {title}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-8">{children}</div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
