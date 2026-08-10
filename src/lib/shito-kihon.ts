/** Common Shito-ryu kihon vocabulary for notation-free practice plans.
 *  Not a complete curriculum. Prefer your sensei's names and versions.
 *
 *  `minBelt` is the earliest belt where the name is usually taught.
 *  Generators filter to techniques with minBelt <= selected max belt.
 */

export type TechCategory =
  | "stance"
  | "uke"
  | "tsuki"
  | "uchi"
  | "geri"
  | "ashi"
  | "combo";

/** Ordered from beginner to advanced. */
export const BELT_ORDER = [
  "white",
  "yellow",
  "orange",
  "green",
  "blue",
  "brown",
  "black",
] as const;

export type Belt = (typeof BELT_ORDER)[number];

export const BELT_LABELS: Record<Belt, string> = {
  white: "White",
  yellow: "Yellow",
  orange: "Orange",
  green: "Green",
  blue: "Blue",
  brown: "Brown",
  black: "Black",
};

export interface Technique {
  id: string;
  name: string;
  category: TechCategory;
  /** Earliest belt that typically knows this name. */
  minBelt: Belt;
  height?: "J" | "C" | "G";
  stanceHint?: string;
  note?: string;
}

export function beltRank(belt: Belt): number {
  return BELT_ORDER.indexOf(belt);
}

export function isBeltAtMost(techBelt: Belt, maxBelt: Belt): boolean {
  return beltRank(techBelt) <= beltRank(maxBelt);
}

export const SHITO_TECHNIQUES: Technique[] = [
  // Stances
  {
    id: "heisoku",
    name: "Heisoku-dachi",
    category: "stance",
    minBelt: "white",
    note: "Yoi / closed feet",
  },
  {
    id: "musubi",
    name: "Musubi-dachi",
    category: "stance",
    minBelt: "white",
    note: "Attention / reigi",
  },
  {
    id: "hachiji",
    name: "Hachiji-dachi",
    category: "stance",
    minBelt: "white",
    note: "Natural ready",
  },
  {
    id: "zenkutsu",
    name: "Zenkutsu-dachi (Z-D)",
    category: "stance",
    minBelt: "white",
  },
  {
    id: "nekoashi",
    name: "Nekoashi-dachi (N-D)",
    category: "stance",
    minBelt: "orange",
  },
  {
    id: "shiko",
    name: "Shiko-dachi (S-D)",
    category: "stance",
    minBelt: "orange",
  },
  {
    id: "kokutsu",
    name: "Kokutsu-dachi (K-D)",
    category: "stance",
    minBelt: "green",
  },
  {
    id: "moto",
    name: "Moto-dachi (M-D)",
    category: "stance",
    minBelt: "blue",
  },
  {
    id: "kiba",
    name: "Kiba-dachi",
    category: "stance",
    minBelt: "blue",
    note: "Some dojos; related to shiko",
  },
  {
    id: "sanchin",
    name: "Sanchin-dachi",
    category: "stance",
    minBelt: "brown",
  },

  // Blocks / uke
  {
    id: "gedan-barai",
    name: "Gedan-barai",
    category: "uke",
    minBelt: "white",
    height: "G",
    stanceHint: "Z-D",
  },
  {
    id: "age-uke",
    name: "Age-uke",
    category: "uke",
    minBelt: "white",
    height: "J",
    stanceHint: "Z-D",
  },
  {
    id: "soto-uke",
    name: "Soto-uke",
    category: "uke",
    minBelt: "yellow",
    height: "C",
    stanceHint: "Z-D",
  },
  {
    id: "uchi-uke",
    name: "Uchi-uke",
    category: "uke",
    minBelt: "yellow",
    height: "C",
    stanceHint: "Z-D",
  },
  {
    id: "shuto-uke",
    name: "Shuto-uke",
    category: "uke",
    minBelt: "orange",
    height: "C",
    stanceHint: "S-D or N-D",
  },
  {
    id: "otoshi-uke",
    name: "Otoshi-uke / Tetsui Otoshi-uchi",
    category: "uke",
    minBelt: "green",
    height: "C",
    stanceHint: "N-D",
  },
  {
    id: "morote-uke",
    name: "Morote-uke",
    category: "uke",
    minBelt: "blue",
    height: "C",
  },
  {
    id: "juji-uke",
    name: "Juji-uke",
    category: "uke",
    minBelt: "blue",
    height: "J",
    note: "Cross block",
  },
  {
    id: "kakiwake-uke",
    name: "Kakiwake-uke",
    category: "uke",
    minBelt: "brown",
    height: "C",
  },
  {
    id: "haito-uke",
    name: "Haito-uke",
    category: "uke",
    minBelt: "brown",
    height: "C",
  },
  {
    id: "nagashi-uke",
    name: "Nagashi-uke",
    category: "uke",
    minBelt: "brown",
    height: "C",
    note: "Flowing deflection",
  },

  // Punches / tsuki
  {
    id: "oi-tsuki",
    name: "Oi-tsuki",
    category: "tsuki",
    minBelt: "white",
    height: "C",
    stanceHint: "Z-D",
  },
  {
    id: "gyaku-tsuki",
    name: "Gyaku-tsuki",
    category: "tsuki",
    minBelt: "yellow",
    height: "C",
    stanceHint: "Z-D",
  },
  {
    id: "jun-tsuki",
    name: "Jun-tsuki",
    category: "tsuki",
    minBelt: "orange",
    height: "C",
    note: "Shito-ryu lead punch",
  },
  {
    id: "kizami-tsuki",
    name: "Kizami-tsuki",
    category: "tsuki",
    minBelt: "green",
    height: "C",
    stanceHint: "Z-D",
  },
  {
    id: "morote-tsuki",
    name: "Morote-tsuki",
    category: "tsuki",
    minBelt: "blue",
    height: "C",
  },
  {
    id: "age-tsuki",
    name: "Age-tsuki",
    category: "tsuki",
    minBelt: "blue",
    height: "J",
  },
  {
    id: "yama-tsuki",
    name: "Yama-tsuki",
    category: "tsuki",
    minBelt: "brown",
    height: "J",
    note: "U-punch",
  },
  {
    id: "awase-tsuki",
    name: "Awase-tsuki",
    category: "tsuki",
    minBelt: "brown",
    height: "C",
  },

  // Strikes / uchi
  {
    id: "tetsui",
    name: "Tetsui-uchi",
    category: "uchi",
    minBelt: "yellow",
    height: "C",
  },
  {
    id: "uraken",
    name: "Uraken-uchi",
    category: "uchi",
    minBelt: "orange",
    height: "J",
  },
  {
    id: "empi",
    name: "Empi-uchi",
    category: "uchi",
    minBelt: "green",
    height: "C",
  },
  {
    id: "shuto-uchi",
    name: "Shuto-uchi",
    category: "uchi",
    minBelt: "green",
    height: "C",
  },
  {
    id: "haito-uchi",
    name: "Haito-uchi",
    category: "uchi",
    minBelt: "blue",
    height: "C",
  },
  {
    id: "kentsui",
    name: "Kentsui-uchi",
    category: "uchi",
    minBelt: "blue",
    height: "C",
    note: "Hammer fist family",
  },
  {
    id: "nukite",
    name: "Nukite",
    category: "uchi",
    minBelt: "brown",
    height: "C",
  },
  {
    id: "teisho",
    name: "Teisho-uchi",
    category: "uchi",
    minBelt: "brown",
    height: "C",
  },

  // Kicks / geri
  {
    id: "mae-geri",
    name: "Mae-geri",
    category: "geri",
    minBelt: "white",
    height: "C",
    stanceHint: "Z-D",
  },
  {
    id: "kin-geri",
    name: "Kin-geri",
    category: "geri",
    minBelt: "yellow",
    height: "G",
  },
  {
    id: "yoko-geri",
    name: "Yoko-geri",
    category: "geri",
    minBelt: "orange",
    height: "C",
  },
  {
    id: "mawashi-geri",
    name: "Mawashi-geri",
    category: "geri",
    minBelt: "green",
    height: "C",
  },
  {
    id: "fumikomi",
    name: "Fumikomi",
    category: "geri",
    minBelt: "blue",
    height: "G",
    note: "Stamping kick",
  },
  {
    id: "ushiro-geri",
    name: "Ushiro-geri",
    category: "geri",
    minBelt: "blue",
    height: "C",
  },
  {
    id: "mikazuki-geri",
    name: "Mikazuki-geri",
    category: "geri",
    minBelt: "brown",
    height: "C",
  },
  {
    id: "ura-mawashi",
    name: "Ura-mawashi-geri",
    category: "geri",
    minBelt: "brown",
    height: "J",
  },

  // Footwork — keep beginner names simple
  {
    id: "step-forward",
    name: "Step forward (same stance)",
    category: "ashi",
    minBelt: "white",
    note: "Basic forward step",
  },
  {
    id: "mawatte",
    name: "Mawatte",
    category: "ashi",
    minBelt: "yellow",
    note: "Turn / pivot",
  },
  {
    id: "suri-ashi",
    name: "Suri-ashi",
    category: "ashi",
    minBelt: "green",
    note: "Sliding step",
  },
  {
    id: "yori-ashi",
    name: "Yori-ashi",
    category: "ashi",
    minBelt: "blue",
    note: "Dragging step",
  },
  {
    id: "tsugi-ashi",
    name: "Tsugi-ashi",
    category: "ashi",
    minBelt: "brown",
    note: "Following step",
  },
  {
    id: "tai-sabaki",
    name: "Tai sabaki 45°",
    category: "ashi",
    minBelt: "brown",
    note: "Off-line body evasion",
  },

  // Combos
  {
    id: "combo-gedan-oi",
    name: "Gedan-barai → Oi-tsuki",
    category: "combo",
    minBelt: "white",
    stanceHint: "Z-D",
  },
  {
    id: "combo-age-gyaku",
    name: "Age-uke → Gyaku-tsuki",
    category: "combo",
    minBelt: "yellow",
    stanceHint: "Z-D",
  },
  {
    id: "combo-soto-gyaku",
    name: "Soto-uke → Gyaku-tsuki",
    category: "combo",
    minBelt: "yellow",
    stanceHint: "Z-D",
  },
  {
    id: "combo-mae-oi",
    name: "Mae-geri → Oi-tsuki",
    category: "combo",
    minBelt: "orange",
    stanceHint: "Z-D",
  },
  {
    id: "combo-shuto-line",
    name: "Shuto-uke line (L/R alternating)",
    category: "combo",
    minBelt: "orange",
    stanceHint: "S-D",
  },
  {
    id: "combo-otoshi-oi",
    name: "Tetsui Otoshi-uchi → Oi-tsuki",
    category: "combo",
    minBelt: "green",
    stanceHint: "N-D → Z-D",
  },
  {
    id: "combo-uchi-kizami-gyaku",
    name: "Uchi-uke → Kizami-tsuki → Gyaku-tsuki",
    category: "combo",
    minBelt: "blue",
    stanceHint: "Z-D",
  },
  {
    id: "combo-barai-mae-gyaku",
    name: "Gedan-barai → Mae-geri → Gyaku-tsuki",
    category: "combo",
    minBelt: "blue",
    stanceHint: "Z-D",
  },
];

export function techniquesForBelt(
  maxBelt: Belt,
  category?: TechCategory,
): Technique[] {
  return SHITO_TECHNIQUES.filter(
    (t) =>
      isBeltAtMost(t.minBelt, maxBelt) &&
      (category ? t.category === category : true),
  );
}

export function techniquesByCategory(category: TechCategory): Technique[] {
  return SHITO_TECHNIQUES.filter((t) => t.category === category);
}

export function formatTechnique(t: Technique): string {
  const bits = [t.name];
  if (t.height) bits.push(`(${t.height})`);
  if (t.stanceHint) bits.push(`[${t.stanceHint}]`);
  if (t.note) bits.push(`· ${t.note}`);
  return bits.join(" ");
}
