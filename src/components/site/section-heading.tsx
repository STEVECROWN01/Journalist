import { Reveal } from "./reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  as?: "h1" | "h2";
}

/** En-tête de section éditorial : filet rouge, surtitre, titre serif, chapô. */
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
      <Tag className="display-2 mt-5 max-w-3xl text-balance text-white">
        {title}
      </Tag>
      {intro ? (
        <p className={`lede mt-6 max-w-2xl ${align === "center" ? "mx-auto" : ""}`}>
          {intro}
        </p>
      ) : null}
    </Reveal>
  );
}
