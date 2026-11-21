"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "article" | "li" | "span";
}

/**
 * Révélation au défilement — SANS dépendance, visible côté serveur.
 *
 * Le contenu est rendu normalement dans le HTML : sans JavaScript (ou
 * pendant son chargement sur connexion lente), tout reste affiché.
 * Une fois le composant monté, l'état masqué est posé par une classe
 * (.rv-armed) puis la révélation joue à l'entrée dans le viewport
 * (.rv-in). prefers-reduced-motion : aucune transformation.
 */
export function Reveal({ children, delay = 0, className, as = "div" }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setArmed(true);
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("rv-in");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -72px 0px", threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Tag = as as "div";
  const style = { "--rv-delay": `${delay}s` } as CSSProperties;
  return (
    <Tag
      ref={ref}
      className={`${className ?? ""} ${armed ? "rv-armed" : ""}`.trim()}
      style={style}
    >
      {children}
    </Tag>
  );
}

/** Révélation d'image avec léger zoom inverse (sobre). */
export function RevealImage({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setArmed(true);
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("rvi-in");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -56px 0px", threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${className ?? ""} ${armed ? "rvi-armed" : ""}`.trim()}
    >
      {children}
    </div>
  );
}
