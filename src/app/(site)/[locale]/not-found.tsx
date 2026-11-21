import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("common.notFound");

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-6xl flex-col items-center justify-center px-6 pt-24 text-center">
      <p className="eyebrow justify-center">404</p>
      <h1 className="display-2 mt-6 max-w-2xl text-white">{t("title")}</h1>
      <p className="lede mt-5 max-w-md">{t("text")}</p>
      <Link href="/" className="btn-outline mt-10">
        {t("back")}
      </Link>
    </div>
  );
}
