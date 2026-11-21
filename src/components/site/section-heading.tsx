import { Reveal } from "./reveal";
import { MaskLines } from "./motion";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  as?: "h1" | "h2";
}

/** En-tête de section éditorial : filet rouge, surtitre, titre serif
 *  révélé ligne à ligne derrière un masque, chapô. */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  as: Tag = "h2",
}: SectionHeadingProps) {
  return (
    <Reveal className={align === "center" ? "text-center" : ""}>
      <p className={`eyebrow ${align === "center" ? "flex justify-center" : ""}`}>
        {eyebrow}
      </p>
      {/* Le titre glisse depuis le bas dans son masque (Reveal s'occupe
          du surtitre et du chapô avec un léger décalage). */}
      <Tag className="display-2 mt-5 max-w-3xl text-balance text-white">
        <MaskLines delay={0.08}>{title}</MaskLines>
      </Tag>
      {intro ? (
        <p className={`lede mt-6 max-w-2xl ${align === "center" ? "mx-auto" : ""}`}>
          {intro}
        </p>
      ) : null}
    </Reveal>
  );
}
