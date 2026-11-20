"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link2, Check, Linkedin, Twitter, Facebook } from "lucide-react";

/** Partage social : liens réels + copie du lien. */
export function ShareButtons({ url, title }: { url: string; title: string }) {
  const t = useTranslations("common.share");
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      name: "X (Twitter)",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      Icon: Twitter,
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      Icon: Linkedin,
    },
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      Icon: Facebook,
    },
  ];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Presse-papiers indisponible : silencieux
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="meta mr-1">{t("title")}</span>
      {links.map(({ name, href, Icon }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={name}
          className="flex size-10 items-center justify-center rounded-full border border-mist/15 text-silver transition-colors hover:border-mist/40 hover:text-white"
        >
          <Icon size={15} aria-hidden="true" />
        </a>
      ))}
      <button
        type="button"
        onClick={copyLink}
        aria-label={t("copy")}
        className="flex size-10 items-center justify-center rounded-full border border-mist/15 text-silver transition-colors hover:border-mist/40 hover:text-white"
      >
        {copied ? (
          <Check size={15} className="text-vert" aria-hidden="true" />
        ) : (
          <Link2 size={15} aria-hidden="true" />
        )}
      </button>
      <span
        className={`text-[0.75rem] text-vert transition-opacity duration-300 ${
          copied ? "opacity-100" : "opacity-0"
        }`}
        role="status"
      >
        {t("copied")}
      </span>
    </div>
  );
}
