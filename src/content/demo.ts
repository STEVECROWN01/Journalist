/**
 * Catalogue initial des productions audiovisuelles — Alexandre Morel.
 * Sert de repli statique si la base n'est pas joignable et de données
 * d'amorçage (seed). Les articles et analyses, eux, sont gérés
 * exclusivement depuis le back-office : aucun contenu éditorial
 * fictif n'est affiché sur le site public.
 */

export interface DemoProduction {
  slug: string;
  titleFr: string;
  titleEn: string;
  category: string;
  year: number;
  territoryFr: string;
  territoryEn: string;
  roleFr: string;
  roleEn: string;
  contextFr: string;
  contextEn: string;
  descriptionFr: string;
  descriptionEn: string;
  coverImage: string;
  videoUrl: string | null;
  order: number;
}

/* ============================ PRODUCTIONS ============================ */

export const demoProductions: DemoProduction[] = [
  {
    slug: "ligne-directe",
    titleFr: "Ligne directe",
    titleEn: "Direct Line",
    category: "reportage",
    year: 2025,
    territoryFr: "France — Sénégal",
    territoryEn: "France — Senegal",
    roleFr: "Journaliste-reporter, montage",
    roleEn: "Reporter, edit",
    contextFr:
      "Série de reportages sur les corridors économiques entre l'Europe et l'Afrique de l'Ouest : flux, acteurs et réalités humaines derrière les statistiques.",
    contextEn:
      "A series of reports on the economic corridors between Europe and West Africa: flows, actors and the human realities behind the statistics.",
    descriptionFr: `Format de 26 minutes pensé pour une diffusion télévisée et une reprise en plateforme. Le tournage s'est appuyé sur un travail de sourcing de plusieurs semaines, une immersion dans trois lieux de commerce différents et une écriture qui privilégie les protagonistes sur les commentaires en voix off.

Le parti pris éditorial : ne jamais illustrer, mais raconter. Chaque séquence découle d'une situation filmée, chaque situation d'une relation établie sur le terrain. La démonstration documentaire passe par ce que l'on montre, pas par ce que l'on affirme.`,
    descriptionEn: `A 26-minute format designed for television broadcast and platform reuse. Shooting relied on several weeks of sourcing, immersion in three different trading locations, and writing that gives precedence to protagonists over voice-over commentary.

The editorial stance: never illustrate, but narrate. Every sequence stems from a filmed situation, every situation from a relationship established in the field. Documentary proof lies in what you show, not in what you assert.`,
    coverImage: "/assets/production-ligne-directe.jpg",
    videoUrl: null,
    order: 1,
  },
  {
    slug: "terrain-partage",
    titleFr: "Terrain partagé",
    titleEn: "Shared Ground",
    category: "documentaire",
    year: 2024,
    territoryFr: "Afrique de l'Ouest",
    territoryEn: "West Africa",
    roleFr: "Réalisateur et journaliste",
    roleEn: "Director and journalist",
    contextFr:
      "Série documentaire en trois volets sur les communautés qui composent avec les transformations économiques et climatiques de leur territoire.",
    contextEn:
      "A three-part documentary series on communities adapting to the economic and climatic transformations of their land.",
    descriptionFr: `Écriture longue, tournage itinérant, temps de confiance : cette série documentaire assume la lenteur comme méthode. Trois volets de cinquante-deux minutes construits autour de personnages suivis sur plusieurs mois, dans des environnements filmés sans mise en scène.

La direction photographique privilégie la lumière naturelle et les cadres larges ; la bande sonore, les langues des protagonistes. L'objectif : une œuvre qui respecte la dignité des personnes filmées et la complexité des situations traversées.`,
    descriptionEn: `Long-form writing, itinerant shooting, time built on trust: this documentary series assumes slowness as method. Three fifty-two-minute episodes built around characters followed over several months, in environments filmed without staging.

The cinematographic direction favours natural light and wide frames; the soundtrack, the protagonists' own languages. The goal: a work that respects the dignity of the people filmed and the complexity of the situations traversed.`,
    coverImage: "/assets/production-terrain-partage.jpg",
    videoUrl: null,
    order: 2,
  },
  {
    slug: "contrepoints",
    titleFr: "Contrepoints",
    titleEn: "Counterpoints",
    category: "interview",
    year: 2025,
    territoryFr: "Paris",
    territoryEn: "Paris",
    roleFr: "Conception, préparation et interview",
    roleEn: "Concept, research and interview",
    contextFr:
      "Collection d'entretiens longs avec des professionnels dont les trajectoires éclairent les mutations du monde médiatique et des relations internationales.",
    contextEn:
      "A collection of long-form interviews with professionals whose trajectories shed light on the transformations of the media world and international relations.",
    descriptionFr: `Un format de treize minutes par entretien, tourné en studio, pensé pour la clarté : une préparation documentée, un fil narratif défini en amont, un montage resserré qui conserve la substance des échanges.

La collection vise l'exigence de fond d'un débat d'idées avec l'accessibilité d'un format numérique : chaque épisode traite un sujet unique, approfondi, sans jargon.`,
    descriptionEn: `A thirteen-minute format per interview, shot in studio, designed for clarity: documented preparation, a narrative thread defined in advance, tight editing that preserves the substance of the exchanges.

The collection aims for the intellectual rigour of a public debate with the accessibility of a digital format: each episode addresses a single subject, in depth, without jargon.`,
    coverImage: "/assets/production-contrepoints.jpg",
    videoUrl: null,
    order: 3,
  },
  {
    slug: "cap-sur-les-organisations",
    titleFr: "Cap sur les organisations",
    titleEn: "Setting a Course for Organisations",
    category: "communication",
    year: 2026,
    territoryFr: "France",
    territoryEn: "France",
    roleFr: "Conseil éditorial et réalisation",
    roleEn: "Editorial advisory and direction",
    contextFr:
      "Films et contenus de communication conçus pour des organisations : valoriser des projets, expliquer des métiers, donner de la profondeur à une prise de parole institutionnelle.",
    contextEn:
      "Communication films and content designed for organisations: showcasing projects, explaining professions, adding depth to institutional statements.",
    descriptionFr: `Cette production illustre l'orientation la plus récente du parcours : appliquer les méthodes journalistiques — investigation de sujet, hiérarchisation, récit — à la communication des organisations.

Chaque film part des mêmes exigences : comprendre l'organisation et ses publics avant d'écrire, chercher la justesse plutôt que le spectaculaire, construire des contenus qui restent crédibles parce qu'ils sont documentés. Format modulaire : film signature, déclinaisons courtes, contenus d'accompagnement.`,
    descriptionEn: `This production illustrates the most recent turn in the career: applying journalistic methods — subject research, prioritisation, narrative — to organisational communication.

Every film starts from the same requirements: understanding the organisation and its audiences before writing, seeking precision rather than spectacle, building content that remains credible because it is documented. Modular format: signature film, short declinations, accompanying content.`,
    coverImage: "/assets/production-cap-organisations.jpg",
    videoUrl: null,
    order: 4,
  },
];
