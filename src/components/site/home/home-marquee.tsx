"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  Clapperboard,
  FileText,
  Megaphone,
  Mic,
  Pause,
  Play,
  Users,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Reveal } from "@/components/site/reveal";
import { useLenisScrollTrigger } from "./use-lenis-scrolltrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export interface HomeMarqueeCopy {
  eyebrow: string;
  title: string;
  intro1: string;
  intro2: string;
  intro3: string;
  cta: string;
  pause: string;
  resume: string;
  readMore: string;
}

export type MarqueeCard =
  | {
      kind: "media";
      key: string;
      href: string;
      image: string;
      caption: string;
      icon: "mic" | "clapper" | "users" | "megaphone" | "file";
      meta: string;
    }
  | {
      kind: "note";
      key: string;
      href: string;
      kicker: string;
      title: string;
      meta: string;
      cta: string;
    };

const CARD_ICONS = {
  mic: Mic,
  clapper: Clapperboard,
  users: Users,
  megaphone: Megaphone,
  file: FileText,
} as const;

/**
 * Galerie « Productions sélectionnées » — deux voies légèrement inclinées
 * qui défilent en continu (sens opposés) : productions audiovisuelles en
 * haut, publications en bas. Arrivée latérale au défilement, épinglage
 * bref sur écrans hauts, et commande de suspension du mouvement.
 */
export function HomeMarquee({
  copy,
  lanes,
}: {
  copy: HomeMarqueeCopy;
  lanes: { label: string; cards: MarqueeCard[] }[];
}) {
  const root = useRef<HTMLElement>(null);
  const gallery = useRef<HTMLDivElement>(null);
  const [motionPaused, setMotionPaused] = useState(false);

  useLenisScrollTrigger();

  /* Entrée latérale des cartes + épinglage bref sur écrans hauts */
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          tall: "(min-height: 650px)",
        },
        (context) => {
          const { reduce, tall } = context.conditions!;
          if (reduce) return;

          const badges = gsap
            .timeline({ paused: true })
            .fromTo(
              ".dt-photo-badge",
              { scale: 0, autoAlpha: 0 },
              {
                scale: 1,
                autoAlpha: 1,
                duration: 0.44,
                stagger: 0.018,
                ease: "back.out(1.45)",
              }
            );
          const arrival = gsap.timeline({
            defaults: { ease: "power2.out" },
            scrollTrigger: {
              trigger: root.current,
              start: "top 92%",
              end: "top 50%",
              scrub: 0.45,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                if (self.progress > 0.96) badges.play();
              },
            },
          });
          arrival.addLabel("photos", 0);
          gsap.utils
            .toArray<HTMLElement>(".dt-gallery-group", root.current)
            .forEach((group) => {
              arrival.fromTo(
                group.querySelectorAll(".dt-photo-arrival"),
                { x: () => Math.min(innerWidth, 1300) * 0.83, autoAlpha: 0 },
                { x: 0, autoAlpha: 1, duration: 0.65, stagger: 0.09 },
                "photos"
              );
            });
          if (tall) {
            ScrollTrigger.create({
              trigger: root.current,
              start: "center center",
              end: () =>
                "+=" + Math.round(innerHeight * 0.38),
              pin: true,
              pinSpacing: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            });
          }
        }
      );
      return () => media.revert();
    },
    { scope: root }
  );

  /* Glissement continu des voies — suspendu hors écran, lors d'une
     interaction, ou via la commande de suspension. */
  useEffect(() => {
    const strip = gallery.current;
    if (!strip) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const tracks = gsap.utils
        .toArray<HTMLDivElement>(".dt-gallery-lane", strip)
        .map((lane, index) => ({
          lane,
          group: lane.firstElementChild as HTMLElement,
          direction: index === 0 ? 1 : -1,
          period: 0,
          position: 0,
          rendered: 0,
          resumeAt: 0,
        }));
      const measure = () => {
        tracks.forEach((track) => {
          const period = track.group.offsetWidth;
          if (period === track.period) return;
          track.position = track.period
            ? (track.position / track.period) * period
            : track.direction === 1
              ? 0
              : period;
          track.period = period;
          track.lane.scrollLeft = track.position;
          track.rendered = track.lane.scrollLeft;
        });
      };
      const tick = (time: number, elapsed: number) => {
        if (document.hidden || root.current?.dataset.motionPaused === "true")
          return;
        const inspecting =
          !!strip.querySelector(":focus-visible") || strip.matches(":active");
        for (const track of tracks) {
          if (track.lane.scrollLeft !== track.rendered) {
            track.position = track.lane.scrollLeft;
            track.rendered = track.lane.scrollLeft;
            track.resumeAt = time + 0.8;
          }
          if (time < track.resumeAt || inspecting || !track.period) continue;
          track.position = gsap.utils.wrap(
            0,
            track.period,
            track.position + track.direction * Math.min(elapsed, 48) * 0.032
          );
          track.lane.scrollLeft = track.position;
          track.rendered = track.lane.scrollLeft;
        }
      };
      measure();
      const resize = new ResizeObserver(measure);
      tracks.forEach((track) => resize.observe(track.group));
      const view = new IntersectionObserver(([entry]) => {
        gsap.ticker.remove(tick);
        if (entry.isIntersecting) gsap.ticker.add(tick);
      });
      view.observe(strip);
      return () => {
        resize.disconnect();
        view.disconnect();
        gsap.ticker.remove(tick);
      };
    });
    return () => media.revert();
  }, []);

  function renderCard(card: MarqueeCard, duplicate: boolean) {
    if (card.kind === "media") {
      const Icon = CARD_ICONS[card.icon];
      return (
        <div className="dt-photo-arrival" key={card.key + (duplicate ? "-copy" : "")}>
          <Link
            className="dt-photo"
            href={card.href}
            tabIndex={duplicate ? -1 : undefined}
            aria-hidden={duplicate ? true : undefined}
            aria-label={card.caption}
          >
            <Image
              src={card.image}
              alt={duplicate ? "" : card.caption}
              width={465}
              height={300}
              sizes="(min-width: 760px) 22vw, 48vw"
              className="dt-photo-img"
            />
            <span className="dt-photo-badge dt-category-badge">
              <Icon aria-hidden="true" />
            </span>
            <span className="dt-photo-badge dt-play-badge">
              <ArrowUpRight aria-hidden="true" />
            </span>
            <span className="dt-photo-caption">{card.caption}</span>
          </Link>
          <div className="dt-photo-meta">
            <strong>{card.caption}</strong>
            <small>{card.meta}</small>
          </div>
        </div>
      );
    }
    return (
      <div className="dt-photo-arrival" key={card.key + (duplicate ? "-copy" : "")}>
        <Link
          className="dt-note-card"
          href={card.href}
          tabIndex={duplicate ? -1 : undefined}
          aria-hidden={duplicate ? true : undefined}
        >
          <span className="dt-note-kicker">
            <FileText aria-hidden="true" size={11} />
            {card.kicker}
          </span>
          <strong>{card.title}</strong>
          <small>{card.meta}</small>
          <span className="dt-note-cta">
            {card.cta}
            <ArrowUpRight aria-hidden="true" size={12} />
          </span>
        </Link>
      </div>
    );
  }

  return (
    <section
      ref={root}
      aria-labelledby="sec-productions"
      className="dt-library"
      data-motion-paused={motionPaused}
    >
      <div className="dt-library-heading dt-wrap">
        <Reveal>
          <p className="eyebrow justify-center">{copy.eyebrow}</p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2
            id="sec-productions"
            className="display-2 mx-auto mt-6 max-w-3xl text-balance text-white"
          >
            {copy.title}
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="lede mx-auto mt-6 max-w-2xl text-balance">
            {copy.intro1}
          </p>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mx-auto mt-4 max-w-2xl text-[0.95rem] leading-[1.8] text-steel">
            {copy.intro2}
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-2 max-w-2xl text-[0.95rem] leading-[1.8] text-steel">
            {copy.intro3}
          </p>
        </Reveal>
      </div>

      <div className="dt-gallery" ref={gallery}>
        <div className="dt-gallery-tilt">
          {lanes.map((lane, index) => (
            <div
              className="dt-gallery-lane"
              key={lane.label}
              aria-label={lane.label}
            >
              {[0, 1, 2].map((copyIndex) => (
                <div
                  key={copyIndex}
                  className="dt-gallery-group"
                  aria-hidden={copyIndex ? true : undefined}
                >
                  {lane.cards.map((card) => renderCard(card, copyIndex > 0))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="dt-gallery-footer dt-wrap">
        <button
          className="dt-motion-toggle"
          type="button"
          aria-label={motionPaused ? copy.resume : copy.pause}
          aria-pressed={motionPaused}
          onClick={() => setMotionPaused((value) => !value)}
        >
          {motionPaused ? (
            <Play aria-hidden="true" />
          ) : (
            <Pause aria-hidden="true" />
          )}
          <span>{motionPaused ? copy.resume : copy.pause}</span>
        </button>
      </div>

      <div className="dt-wrap mt-12 flex justify-center">
        <Link href="/productions" className="btn-outline">
          {copy.cta}
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
