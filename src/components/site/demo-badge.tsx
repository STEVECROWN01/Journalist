import { useTranslations } from "next-intl";

/** Badge discret signalant un contenu de démonstration. */
export function DemoBadge({ className = "" }: { className?: string }) {
  const t = useTranslations("common.demo");
  return (
    <span className={`demo-badge ${className}`}>
      <span
        className="inline-block size-1.5 rounded-full bg-sand"
        aria-hidden="true"
      />
      {t("badge")}
    </span>
  );
}
