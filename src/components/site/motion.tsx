"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

/**
 * Kit d'animations éditoriales — IntersectionObserver + CSS uniquement
 * (aucune bibliothèque supplémentaire : le contenu est visible dans le
 * HTML servi, les transformations ne jouent qu'après montage, et
 * prefers-reduced-motion est respecté partout).
 */

/* ------------------------------------------------------------------ */
/*  MaskLines — titre révélé ligne par ligne derrière un masque        */
/* ------------------------------------------------------------------ */

/**
 * Le contenu (chaque enfant React devient une ligne) glisse depuis le
 * bas dans un masque overflow-hidden : la révélation signature des
 * titres éditoriaux. Si JavaScript n'est pas encore chargé, le titre
 * est entièrement visible (aucun contenu caché côté serveur).
 */
export function MaskLines({
  children,
  className,
  delay = 0,
  stagger = 0.09,
  as: Tag = "span",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Décalage entre chaque ligne enfant (secondes). */
  stagger?: number;
  as?: "span" | "h2" | "h3" | "p";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setArmed(true);
    const reveal = () => el.classList.add("ml-in");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            reveal();
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -64px 0px", threshold: 0.1 }
    );
    io.observe(el);
    /* Filet de sécurité : un titre réellement présent à l'écran ne peut
       jamais rester masqué, même si l'observation initiale a tiré pendant
       une refonte de mise en page (polices, épinglage GSAP). */
    const guard = window.setInterval(() => {
      const r = el.getBoundingClientRect();
      if (r.height > 0 && r.bottom > 0 && r.top < innerHeight - 72) {
        reveal();
        window.clearInterval(guard);
      }
    }, 350);
    const stop = () => window.clearInterval(guard);
    window.setTimeout(stop, 4500);
    return () => {
      io.disconnect();
      stop();
    };
  }, []);

  /* Chaque enfant direct devient une « ligne » masquée ; un enfant
     texte est enveloppé dans un unique span. */
  const items = Array.isArray(children) ? children : [children];
  const lines = items.map((child, i) => (
    <span
      className="ml-line"
      key={i}
      style={{ "--ml-delay": `${delay + i * stagger}s` } as CSSProperties}
    >
      {child}
    </span>
  ));

  const T = Tag as "span";
  return (
    <T
      ref={ref}
      className={`${className ?? ""} ml ${armed ? "ml-armed" : ""}`.trim()}
    >
      {lines}
    </T>
  );
}

/* ------------------------------------------------------------------ */
/*  Parallax — dérive verticale subtile au défilement                  */
/* ------------------------------------------------------------------ */

/**
 * L'enfant se déplace verticalement (amplitude en pixels, ex. 40)
 * pendant que son conteneur traverse le viewport : profondeur douce
 * pour les photographies, sans bibliothèque et sans rupture de mise
 * en page (le conteneur réserve la place, seul l'enfant glisse).
 */
export function Parallax({
  children,
  className,
  amplitude = 40,
  scale = 1.08,
}: {
  children: ReactNode;
  className?: string;
  /** Dérive maximale en pixels (signé : négatif = remonte). */
  amplitude?: number;
  /** Agrandissement de l'enfant pour couvrir la dérive sans bord vide. */
  scale?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof ResizeObserver === "undefined") return;

    let raf = 0;
    const inner = el.firstElementChild as HTMLElement | null;
    if (!inner) return;

    const render = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // Progression du conteneur dans le viewport : 0 (entrée basse)
      // → 1 (sortie haute).
      const progress =
        (vh - rect.top) / (vh + rect.height || 1);
      const clamped = Math.max(0, Math.min(1, progress));
      // Position relative au centre : -0.5 → 0.5
      const centered = clamped - 0.5;
      const y = -centered * 2 * amplitude;
      inner.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(render);
    };

    render();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [amplitude]);

  return (
    <div ref={ref} className={`plx ${className ?? ""}`.trim()}>
      <div className="plx-inner" style={{ "--plx-scale": String(scale) } as CSSProperties}>
        {children}
      </div>
    </div>
  );
}
