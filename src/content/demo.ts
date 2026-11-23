/**
 * Catalogue des productions audiovisuelles — filmographie réelle.
 * Documentaires et reportages diffusés par ARTE, France 5, France 3,
 * Al Jazeera, Public Sénat, Radio France — deux Étoiles de la Scam
 * (2013, 2023) et un Prix Jeunes FIGRA (2013).
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
    slug: "kyiv-un-opera-en-guerre",
    titleFr: "Kyiv, un opéra en guerre",
    titleEn: "Kyiv, an Opera at War",
    category: "documentaire",
    year: 2023,
    territoryFr: "Ukraine",
    territoryEn: "Ukraine",
    roleFr: "Réalisation et image",
    roleEn: "Direction and cinematography",
    contextFr:
      "Série documentaire en quatre volets (4 × 26 min) — ARTE France / Agat Films. Une continuité de la couverture du conflit ukrainien engagée depuis 2022.",
    contextEn:
      "Four-part documentary series (4 × 26 min) — ARTE France / Agat Films. A continuation of the coverage of the Ukrainian conflict undertaken since 2022.",
    descriptionFr: `Le quotidien à la fois précaire et vibrant de l'Opéra national d'Ukraine, dont le rideau continue de se lever, saison après saison, comme un acte de résistance.

Filmée en immersion au cœur du théâtre et de sa troupe, la série raconte celles et ceux qui ont fait de leur art un front culturel : danseurs, chanteurs, musiciens. La culture comme arme de construction — la beauté comme défi lancé à la guerre.`,
    descriptionEn: `The precarious yet vibrant daily life of the National Opera of Ukraine, whose curtain keeps rising, season after season, as an act of resistance.

Filmed in immersion inside the theatre and its troupe, the series tells of those who have made their art a cultural front: dancers, singers, musicians. Culture as a weapon of construction — beauty as a challenge thrown at war.`,
    coverImage: "/assets/production-terrain-partage.jpg",
    videoUrl: null,
    order: 1,
  },
  {
    slug: "afghanistan-le-prix-de-la-paix",
    titleFr: "Afghanistan, le prix de la paix",
    titleEn: "Afghanistan, the Price of Peace",
    category: "documentaire",
    year: 2022,
    territoryFr: "Afghanistan",
    territoryEn: "Afghanistan",
    roleFr: "Co-réalisation et journaliste",
    roleEn: "Co-direction and journalism",
    contextFr:
      "Documentaire de 90 minutes — France 5, Al Jazeera, Point du Jour. Étoile de la Scam 2023.",
    contextEn:
      "90-minute documentary — France 5, Al Jazeera, Point du Jour. Étoile de la Scam 2023.",
    descriptionFr: `Août 2021 : les talibans reprennent le pouvoir en Afghanistan. Le film revient sur quarante ans d'histoire — guerres, occupations, espoirs déçus — pour éclairer la question qui hante le pays : quel est le véritable prix de la paix ?

Prolongement d'années de terrain en Afghanistan et au Pakistan, ce documentaire donne la parole à celles et ceux qui ont vécu ces décennies, loin des analyses toutes faites. Récompensé par l'Étoile de la Scam 2023.`,
    descriptionEn: `August 2021: the Taliban take back power in Afghanistan. The film looks back on forty years of history — wars, occupations, dashed hopes — to shed light on the question that haunts the country: what is the true price of peace?

Building on years of reporting in Afghanistan and Pakistan, this documentary gives a voice to those who lived through these decades, far from ready-made analyses. Awarded the Étoile de la Scam 2023.`,
    coverImage: "/assets/realisation-documentaire-tournage.jpg",
    videoUrl: null,
    order: 2,
  },
  {
    slug: "libye-dans-les-prisons-de-haute-securite",
    titleFr: "Libye, dans les prisons de haute sécurité",
    titleEn: "Libya, Inside High-Security Prisons",
    category: "reportage",
    year: 2022,
    territoryFr: "Libye",
    territoryEn: "Libya",
    roleFr: "Journaliste reporter",
    roleEn: "Reporter",
    contextFr:
      "ARTE Reportage — Découpage. Tourné dans le cadre de la couverture continue de l'Égypte et de la Libye.",
    contextEn:
      "ARTE Reportage — Découpage. Filmed as part of the ongoing coverage of Egypt and Libya.",
    descriptionFr: `Au cœur des établissements pénitentiaires libyens, là où l'État lui-même peine à entrer : une plongée dans les prisons de haute sécurité d'un pays en proie à la fragmentation.

Un reportage qui exige adaptation, discrétion et gestion de sources sensibles — et qui témoigne des réalités sécuritaires, politiques et humaines de la Libye d'aujourd'hui.`,
    descriptionEn: `Inside Libyan penal institutions, where even the state struggles to go: a descent into the high-security prisons of a country torn apart by fragmentation.

A report demanding adaptation, discretion and the handling of sensitive sources — bearing witness to the security, political and human realities of Libya today.`,
    coverImage: "/assets/production-contrepoints.jpg",
    videoUrl: null,
    order: 3,
  },
  {
    slug: "egypte-les-droits-de-l-homme-en-question",
    titleFr: "Égypte, les droits de l'homme en question",
    titleEn: "Egypt, Human Rights in Question",
    category: "reportage",
    year: 2021,
    territoryFr: "Égypte",
    territoryEn: "Egypt",
    roleFr: "Journaliste reporter",
    roleEn: "Reporter",
    contextFr:
      "ARTE Reportage — Nova Prod. Couverture des dynamiques politiques, sécuritaires et sociétales en Égypte.",
    contextEn:
      "ARTE Reportage — Nova Prod. Covering Egypt's political, security and social dynamics.",
    descriptionFr: `Dans l'Égypte contemporaine, qu'en est-il des droits fondamentaux ? Entre promesses officielles et réalités du terrain, le reportage interroge la situation des droits de l'homme — presse, justice, sociétés civiles.

Une production qui s'appuie sur un réseau local de contacts institutionnels, journalistes et acteurs de terrain, bâti année après année depuis Le Caire.`,
    descriptionEn: `In contemporary Egypt, what remains of fundamental rights? Between official promises and realities on the ground, the report questions the state of human rights — press, justice, civil society.

A production relying on a local network of institutional contacts, journalists and field actors, built up year after year from Cairo.`,
    coverImage: "/assets/editorial-presse-magazines.jpg",
    videoUrl: null,
    order: 4,
  },
  {
    slug: "tunisie-les-oublies-du-phosphate",
    titleFr: "Tunisie, les oubliés du phosphate",
    titleEn: "Tunisia, the Forgotten of Phosphate",
    category: "reportage",
    year: 2018,
    territoryFr: "Tunisie",
    territoryEn: "Tunisia",
    roleFr: "Journaliste-réalisateur",
    roleEn: "Journalist-director",
    contextFr:
      "Public Sénat — Wild Angle. La Tunisie post-Printemps arabe : enjeux politiques, économiques et sociaux.",
    contextEn:
      "Public Sénat — Wild Angle. Post-Arab Spring Tunisia: political, economic and social stakes.",
    descriptionFr: `Dans les régions du phosphate, la richesse du sous-sol ne se traduit pas toujours en emplois ni en dignité. Le reportage part à la rencontre des oubliés d'une transition : ouvriers, jeunes sans perspectives, habitants de bassins miniers délaissés.

Le prolongement d'années de couverture de la Tunisie post-Printemps arabe pour ARTE — et d'un réseau de contacts locaux construit sur la durée.`,
    descriptionEn: `In the phosphate regions, underground wealth does not always translate into jobs or dignity. The report meets the forgotten of a transition: workers, young people without prospects, residents of neglected mining basins.

The continuation of years covering post-Arab Spring Tunisia for ARTE — and of a local contact network built over time.`,
    coverImage: "/assets/Man_directing_film_crew_f7c433ef.jpg_f49f5942.jpg",
    videoUrl: null,
    order: 5,
  },
  {
    slug: "afghanistan-le-prix-de-la-vengeance",
    titleFr: "Afghanistan, le prix de la vengeance",
    titleEn: "Afghanistan, the Price of Revenge",
    category: "documentaire",
    year: 2012,
    territoryFr: "Afghanistan",
    territoryEn: "Afghanistan",
    roleFr: "Co-réalisation et écriture",
    roleEn: "Co-direction and writing",
    contextFr:
      "Documentaire de 90 minutes — France 3, Al Jazeera, Point du Jour. Étoile de la Scam 2013.",
    contextEn:
      "90-minute documentary — France 3, Al Jazeera, Point du Jour. Étoile de la Scam 2013.",
    descriptionFr: `« Vous n'êtes pas morts pour rien. Vous avez combattu dans une guerre juste. » Des familles de soldats aux villages de montagne, le film mesure ce que la vengeance a coûté à l'Afghanistan — et interroge le sens d'une guerre qui s'achève.

Récompensé par l'Étoile de la Scam 2013, ce documentaire s'inscrit dans une décennie d'allers-retours entre l'Afghanistan et le Pakistan, pour ARTE, Radio France et France 24.`,
    descriptionEn: `"You did not die for nothing. You fought in a just war." From soldiers' families to mountain villages, the film measures what vengeance cost Afghanistan — and questions the meaning of a war coming to an end.

Awarded the Étoile de la Scam 2013, this documentary is part of a decade of journeys between Afghanistan and Pakistan, for ARTE, Radio France and France 24.`,
    coverImage: "/assets/Journalist_holding_microphone_in…_0b601b53.jpg",
    videoUrl: null,
    order: 6,
  },
  {
    slug: "bangladesh-hazaribagh-cuir-toxique",
    titleFr: "Bangladesh, Hazaribagh cuir toxique",
    titleEn: "Bangladesh, Hazaribagh Toxic Leather",
    category: "reportage",
    year: 2012,
    territoryFr: "Bangladesh",
    territoryEn: "Bangladesh",
    roleFr: "Journaliste-réalisateur",
    roleEn: "Journalist-director",
    contextFr:
      "Public Sénat — Wild Angle. Prix Jeunes FIGRA 2013.",
    contextEn:
      "Public Sénat — Wild Angle. Prix Jeunes FIGRA 2013.",
    descriptionFr: `À Hazaribagh, quartier des tanneries de Dacca, le cuir s'achète au prix de la santé de celles et ceux qui le travaillent : eaux chargées de chrome, maladies professionnelles, un quartier sacrifié à une industrie qui exporte vers le monde entier.

Un reportage d'alerte sur les coulisses de la mode — récompensé du Prix Jeunes FIGRA 2013.`,
    descriptionEn: `In Hazaribagh, Dhaka's tannery district, leather is bought at the cost of the health of those who work it: chrome-laden waters, occupational diseases, a neighbourhood sacrificed to an industry exporting worldwide.

An investigative report on the hidden side of fashion — awarded the Prix Jeunes FIGRA 2013.`,
    coverImage: "/assets/production-ligne-directe.jpg",
    videoUrl: null,
    order: 7,
  },
];

/* ======================= Publications de démonstration =======================
   Repli utilisé uniquement lorsqu'aucune publication réelle n'est publiée :
   elles disparaissent automatiquement dès la première publication du
   back-office. Version anglaise complète pour chacune. */

export interface DemoPublication {
  slug: string;
  titleFr: string;
  titleEn: string;
  excerptFr: string;
  excerptEn: string;
  contentFr: string;
  contentEn: string;
  category: string; // analyse | reportage | decryptage
  coverImage: string | null;
  publishedAt: string; // ISO
}

export const demoPublications: DemoPublication[] = [
  {
    slug: "comprendre-un-terrain-avant-de-le-raconter",
    titleFr: "Comprendre un terrain avant de le raconter",
    titleEn: "Understanding the Ground Before Telling Its Story",
    excerptFr:
      "La qualité d'un reportage se joue rarement sur le terrain lui-même : elle se prépare bien en amont, dans la lecture, l'écoute et la compréhension des contextes. Retour sur une méthode de travail.",
    excerptEn:
      "The quality of a report is rarely decided in the field: it is prepared long beforehand, through reading, listening and understanding contexts. A closer look at a way of working.",
    category: "analyse",
    coverImage: "/assets/publication-comprendre-terrain.jpg",
    publishedAt: "2026-10-14",
    contentFr: `Tout reportage sérieux commence avant le départ. Avant les images, avant les interviews, avant les premières notes, il existe un travail invisible fait de lectures, de conversations, de cartes et de questions apparemment naïves. C'est ce travail qui détermine, quelques semaines plus tard, la profondeur d'un sujet — ou son caractère superficiel.

Cette conviction structure ma pratique depuis mes débuts : on ne raconte bien que ce que l'on a compris. Et comprendre un terrain, une institution, une économie ou une crise demande du temps, de la méthode et une forme d'humilité.

## Le terrain commence avant le départ

Préparer un sujet, c'est d'abord établir une cartographie. Qui sont les acteurs, quels sont leurs intérêts, leurs contraintes, leurs langages ? Quels travaux ont déjà été publiés, par qui, et avec quelles limites ? Où se situent les zones d'ombre, les angles morts, les points de contestation ?

Cette phase de recherche n'a rien d'une formalité. Elle conditionne la qualité des questions posées ensuite. Un correspondant qui débarque sans ce socle posera les questions que tout le monde pose déjà ; celui qui l'a construit saura identifier la source qui compte, l'angle qui n'a pas été traité, le détail qui renverse une interprétation reçue.

## Écouter avant de questionner

Sur le terrain, la règle que je me donne est simple : écouter plus que je ne parle. L'écoute active — noter les silences, les hésitations, les mots que l'interlocuteur choisit ou évite — dit souvent davantage que les réponses formulées.

> Le bon intervieweur n'est pas celui qui obtient des réponses, mais celui qui mérite la confiance nécessaire pour que les questions difficiles soient acceptées.

Cette confiance ne s'improvise pas. Elle se construit dans la transparence sur l'usage qui sera fait des propos, dans le respect des cadres fixés par les sources, et dans une honnêteté de base : ne jamais faire dire à un témoin ce qu'il n'a pas dit.

## Vérifier sans se paralyser

La vérification est l'ossature du travail journalistique. Croiser les sources, confronter les versions, documenter ce qui est établi et ce qui ne l'est pas : ces gestes semblent élémentaires, pourtant ils deviennent complexes dans des environnements où l'information est elle-même un enjeu de pouvoir.

Il faut alors accepter une règle inconfortable : certaines hypothèses resteront non tranchées. Un reportage honnête assume le doute plutôt que de le masquer sous des certitudes de façade. C'est précisément ce qui distingue un travail documenté d'une simple production de contenu.

## Restituer avec honnêteté

La dernière étape est éditoriale : hiérarchiser, mettre en perspective, choisir ce que l'on montre et ce que l'on laisse de côté. Restituer, c'est traduire une réalité complexe en un récit lisible sans la simplifier au point de la déformer.

C'est là, je crois, que l'expérience journalistique rejoint les besoins des organisations : les mêmes gestes — comprendre un environnement, identifier ce qui compte, construire un récit clair — servent autant un grand reportage qu'une stratégie de communication exigeante. C'est cette continuité que ce site s'attache à présenter.`,
    contentEn: `Every serious piece of reporting begins before departure. Before the footage, before the interviews, before the first notebook entries, there is an invisible body of work made of reading, conversations, maps and seemingly naive questions. It is this work that determines, weeks later, the depth of a story — or its superficiality.

This conviction has structured my practice since my early days: you can only tell well what you have genuinely understood. And understanding a place, an institution, an economy or a crisis takes time, method and a measure of humility.

## The field begins before you leave

Preparing a story starts with mapping it. Who are the actors, what are their interests, their constraints, their vocabularies? What work has already been published, by whom, and with what limits? Where are the blind spots, the contested areas, the angles nobody has covered?

This research phase is no formality. It determines the quality of the questions asked later. A correspondent who arrives without this foundation will ask the questions everyone else already asks; one who has built it will know how to identify the source that matters, the angle that has not been covered, the detail that overturns a received interpretation.

## Listen before you question

In the field, the rule I set for myself is simple: listen more than I speak. Active listening — noting silences, hesitations, the words a speaker chooses or avoids — often reveals more than formulated answers.

> The good interviewer is not the one who obtains answers, but the one who earns the trust that makes difficult questions acceptable.

That trust cannot be improvised. It is built through transparency about how the material will be used, respect for the frameworks sources set, and basic honesty: never making a witness say what they did not say.

## Verify without freezing

Verification is the backbone of journalistic work. Cross-checking sources, confronting accounts, documenting what is established and what is not: these gestures seem elementary, yet they grow complex in environments where information itself is a stake of power.

One must then accept an uncomfortable rule: some questions will remain unresolved. An honest report embraces uncertainty rather than masking it behind a veneer of certainty. This is precisely what separates documented work from mere content production.

## Report back with honesty

The final stage is editorial: prioritise, put in perspective, decide what to show and what to leave out. To report is to translate a complex reality into a readable narrative without simplifying it to the point of distorting it.

This is where, I believe, journalistic experience meets the needs of organisations: the same gestures — understanding an environment, identifying what matters, building a clear narrative — serve both long-form reporting and a demanding communication strategy. That continuity is what this site sets out to present.

---

*Demonstration publication — illustrative content written for the platform presentation. Final texts will be added after approval.*`,
  },
  {
    slug: "documentaire-attention-fragmentee",
    titleFr: "Le documentaire à l'heure de l'attention fragmentée",
    titleEn: "Documentary in the Age of Fragmented Attention",
    excerptFr:
      "Formats courts, plateformes multiples, publics sollicités de toutes parts : le documentaire traverse une mutation profonde. Ce qu'elle change pour les auteurs — et ce qu'elle ne doit pas changer.",
    excerptEn:
      "Short formats, multiple platforms, audiences pulled in every direction: documentary is going through a deep transformation. What it changes for authors — and what it must not change.",
    category: "analyse",
    coverImage: "/assets/editorial-presse-magazines.jpg",
    publishedAt: "2026-09-02",
    contentFr: `Le documentaire n'a jamais été un genre tranquille. Il a toujours fallu trouver les financements, convaincre les diffuseurs, gagner l'attention. Mais la donne a changé de nature : l'attention elle-même est devenue la ressource rare.

Les plateformes ont habitué les publics à des formats courts, verticaux, immédiats. Le temps long du documentaire — celui qui permet à un récit de respirer, à un personnage d'exister, à une complexité de se déployer — se trouve en concurrence frontale avec le scroll.

## Ce que les formats courts apportent

Il serait facile de n'y voir qu'une dégradation. Ce serait inexact. Les formats courts ont démocratisé l'accès au documentaire, révélé des appétits pour des sujets pointus, permis à de jeunes auteurs d'exister sans passer par les portes étroites du financement traditionnel. Ils imposent une discipline utile : savoir ce que l'on veut dire, et le dire vite.

## Ce qu'ils ne remplacent pas

Mais il est des choses qu'un format de quatre-vingt-dix secondes ne peut pas contenir. La construction d'une confiance filmée. Le temps qui passe et qui devient matière narrative. La nuance. Le refus du manichéisme. Un sujet d'envergure mérite mieux qu'une série d'affirmations rythmées : il mérite une forme qui respecte sa complexité.

> La question n'est pas de choisir entre le format court et l'œuvre longue, mais de refuser que la logique du premier dicte la grammaire de la seconde.

## Une écriture à double échelle

C'est pourquoi la plupart des projets contemporains s'écrivent désormais à double échelle : une œuvre qui tient debout seule, et des déclinaisons courtes qui l'annoncent, l'accompagnent, la prolongent. Cette architecture éditoriale n'a rien d'une concession si elle est pensée dès l'écriture — et pas subie au montage.

Pour les auteurs, l'enjeu est de garder la maîtrise de cette gradation : que chaque format serve le projet, et jamais l'inverse. C'est un travail d'équilibriste, mais c'est aussi, probablement, l'avenir du métier : des récits pensés pour des attentions multiples, sans jamais renoncer à l'exigence.`,
    contentEn: `Documentary has never been a quiet genre. Funding always had to be found, broadcasters convinced, attention earned. But the game has changed in nature: attention itself has become the scarce resource.

Platforms have accustomed audiences to short, vertical, immediate formats. Documentary's long time — the time that lets a narrative breathe, a character exist, a complexity unfold — now competes head-on with the scroll.

## What short formats bring

It would be easy to see only decline. That would be inaccurate. Short formats have democratised access to documentary, revealed appetites for niche subjects, and allowed young filmmakers to emerge without passing through the narrow gates of traditional financing. They impose a useful discipline: knowing what you want to say, and saying it fast.

## What they cannot replace

But there are things a ninety-second format cannot hold. The building of filmed trust. Time passing and becoming narrative material. Nuance. The refusal of easy dichotomies. A substantial subject deserves better than a series of punchy assertions: it deserves a form that respects its complexity.

> The question is not choosing between the short format and the long-form work, but refusing to let the grammar of the former dictate the grammar of the latter.

## Writing at two scales

This is why most contemporary projects are now written at two scales: a work that stands on its own, and short declinations that announce it, accompany it, extend it. This editorial architecture is no concession if it is designed from the writing stage onward — and not suffered in the edit.

For authors, the challenge is keeping control of that gradation: each format must serve the project, never the reverse. It is a tightrope walk, but it is also, most likely, the future of the craft: narratives designed for multiple attentions, without ever giving up on rigour.

---

*Demonstration publication — illustrative content written for the platform presentation.*`,
  },
  {
    slug: "ce-que-les-organisations-peuvent-apprendre-des-salles-de-redaction",
    titleFr: "Ce que les organisations peuvent apprendre des salles de rédaction",
    titleEn: "What Organisations Can Learn from Newsrooms",
    excerptFr:
      "Hiérarchiser l'information, vérifier avant de publier, construire des récits clairs : les méthodes des rédactions présentent un intérêt stratégique réel pour la communication des organisations.",
    excerptEn:
      "Prioritising information, verifying before publishing, building clear narratives: newsroom methods hold genuine strategic value for organisational communication.",
    category: "decryptage",
    coverImage: "/assets/salle-redaction-internationale.jpg",
    publishedAt: "2026-07-18",
    contentFr: `Une salle de rédaction est une machine curieuse : elle absorbe chaque jour des flux d'informations chaotiques, contradictoires, incomplets — et produit, à heure fixe, des récits clairs, vérifiés et hiérarchisés. Cette performance quotidienne repose sur des méthodes que les organisations auraient tort de négliger.

## La hiérarchisation comme discipline

Dans une rédaction, toute information n'a pas la même valeur. La une est un choix éditorial assumé : ce qui compte, ce qui peut attendre, ce qui ne mérite pas d'être raconté. Les organisations communiquent souvent à l'inverse : tout est important, donc rien ne ressort. Réapprendre à hiérarchiser — à dire non à soixante-dix pour cent de ses messages — est probablement la leçon la plus rentable.

## La vérification comme culture

Le réflexe de vérification — deux sources indépendantes, recoupement, trace écrite — protège le journaliste de l'erreur et de la manipulation. Transposée à l'entreprise, cette culture change la manière de préparer une prise de parole : on ne publie pas une affirmation interne sans avoir vérifié ce qu'elle a d'établi, ce qu'elle a d'incertain, ce qu'elle engage.

> Communiquer, c'est d'abord savoir ce que l'on sait — et l'assumer.

## Le récit comme architecture

Une information n'est pas un récit. Le journaliste construit : un angle, une entrée, une progression, une conclusion. Les démarches de communication qui s'appuient sur cette grammaire narrative — plutôt que sur l'empilement de messages institutionnels — obtiennent une lisibilité et une mémorisation sans commune mesure.

## Une transposition exigeante

Cette transposition n'a rien de mécanique. Une organisation n'est pas un journal, et sa légitimité ne repose pas sur les mêmes fondements. Mais les professionnels qui savent opérer cette traduction — comprendre les méthodes de la rédaction, les adapter aux contraintes et aux enjeux de l'entreprise — apportent quelque chose de rare : de la clarté, dans un environnement saturé.

C'est l'orientation que ce site présente à travers ses pages dédiées au conseil et à l'accompagnement éditorial.`,
    contentEn: `A newsroom is a curious machine: every day it absorbs chaotic, contradictory, incomplete flows of information — and produces, on deadline, clear, verified, prioritised narratives. That daily performance rests on methods organisations would be wrong to overlook.

## Prioritisation as discipline

In a newsroom, not all information carries the same weight. The front page is an assumed editorial choice: what matters, what can wait, what does not deserve to be told. Organisations often communicate the other way around: everything is important, so nothing stands out. Relearning how to prioritise — saying no to seventy percent of one's messages — is probably the most profitable lesson.

## Verification as culture

The reflex of verification — two independent sources, cross-checking, a written trail — protects journalists from error and manipulation. Transposed to the company, this culture changes how a public statement is prepared: you do not publish an internal claim without establishing what is settled, what remains uncertain, and what it commits you to.

> To communicate is, first, to know what you know — and to own it.

## Narrative as architecture

A piece of information is not a story. The journalist builds: an angle, an entry point, a progression, a conclusion. Communication approaches drawing on this narrative grammar — rather than on stacks of institutional messages — achieve incomparably better clarity and recall.

## A demanding transposition

This transposition is anything but mechanical. An organisation is not a newspaper, and its legitimacy does not rest on the same foundations. But professionals who can operate this translation — understanding newsroom methods, adapting them to corporate constraints and stakes — bring something rare: clarity, in a saturated environment.

This is the orientation this site presents through its consulting and editorial advisory pages.

---

*Demonstration publication — illustrative content written for the platform presentation.*`,
  },
];
