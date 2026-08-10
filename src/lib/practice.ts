import {
  groupByFacing,
  moveSummary,
  type SknKata,
  type SknMove,
} from "./skn";
import {
  formatTechnique,
  techniquesForBelt,
  BELT_LABELS,
  type Belt,
  type TechCategory,
  type Technique,
} from "./shito-kihon";

export type PracticeMode = "segments" | "isolated" | "facing" | "auto";

export interface PracticeOptions {
  modes: PracticeMode[];
  reps: number;
  fullRuns: number;
  rangeStart?: number;
  rangeEnd?: number;
  seed?: number;
}

export interface PracticeLoop {
  title: string;
  reps: number;
  moveIndexes: number[];
  lines: string[];
}

export interface KihonPracticeOptions {
  reps: number;
  seed?: number;
  picksPerCategory?: number;
  /** Include techniques up to and including this belt. */
  maxBelt?: Belt;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickN<T>(items: T[], n: number, rand: () => number): T[] {
  const pool = [...items];
  const out: T[] = [];
  while (out.length < n && pool.length > 0) {
    const i = Math.floor(rand() * pool.length);
    out.push(pool.splice(i, 1)[0]);
  }
  return out;
}

function techLines(techs: Technique[]): string[] {
  return techs.map((t) => `   - ${formatTechnique(t)}`);
}

/** Build a kihon practice plan from the Shito-ryu technique catalog (no SKN required). */
export function generateKihonPracticePlan(
  options: KihonPracticeOptions,
): string {
  const reps = Math.max(1, Math.min(50, options.reps || 5));
  const seed = options.seed ?? Date.now() % 10000;
  const picks = Math.max(2, Math.min(8, options.picksPerCategory || 4));
  const maxBelt: Belt = options.maxBelt || "orange";
  const rand = mulberry32(seed);

  const order: { category: TechCategory; title: string }[] = [
    { category: "stance", title: "STANCES" },
    { category: "ashi", title: "FOOTWORK" },
    { category: "uke", title: "UKE (blocks)" },
    { category: "tsuki", title: "TSUKI (punches)" },
    { category: "uchi", title: "UCHI (strikes)" },
    { category: "geri", title: "GERI (kicks)" },
    { category: "combo", title: "COMBOS" },
  ];

  const sections: PracticeLoop[] = [
    {
      title: "WARM-UP: Reigi → Yoi → slow stance shifts",
      reps: 1,
      moveIndexes: [],
      lines: [
        "   - Musubi-dachi → bow",
        "   - Heisoku / Hachiji → light stretch",
        "   - Basic stances for your belt, each side once",
      ],
    },
  ];

  let totalTechs = 0;
  for (const block of order) {
    const pool = techniquesForBelt(maxBelt, block.category);
    if (pool.length === 0) continue;
    const chosen = pickN(pool, Math.min(picks, pool.length), rand);
    totalTechs += chosen.length;
    sections.push({
      title: `KIHON: ${block.title}`,
      reps,
      moveIndexes: [],
      lines: techLines(chosen),
    });
  }

  sections.push({
    title: "COOL-DOWN",
    reps: 1,
    moveIndexes: [],
    lines: [
      "   - Slow breathing in heisoku-dachi",
      "   - Return to musubi-dachi → bow",
      "   - Note names that felt unclear; ask your sensei",
    ],
  });

  const out: string[] = [
    `PRACTICE PLAN: Shito-Ryu Kihon (up to ${BELT_LABELS[maxBelt]} belt)`,
    "Source: built-in common kihon catalog",
    `Max belt: ${BELT_LABELS[maxBelt]}`,
    `Techniques in plan: ${totalTechs}`,
    `Default reps: ${reps}`,
    `Seed: ${seed}`,
    "",
    "Only names usually taught by this belt are included.",
    "This is not a complete curriculum. Defer to your sensei.",
    "",
  ];

  let n = 1;
  for (const section of sections) {
    out.push(`${n}. ${section.title} x${section.reps}`);
    out.push(...section.lines);
    out.push("");
    n += 1;
  }

  return out.join("\n").trim() + "\n";
}

function clampRange(
  moves: SknMove[],
  start?: number,
  end?: number,
): SknMove[] {
  const from = Math.max(1, start ?? 1);
  const to = Math.min(moves.length, end ?? moves.length);
  if (from > to) return moves;
  return moves.filter((m) => m.index >= from && m.index <= to);
}

function loopFromMoves(
  title: string,
  moves: SknMove[],
  reps: number,
): PracticeLoop {
  return {
    title,
    reps,
    moveIndexes: moves.map((m) => m.index),
    lines: moves.map((m) => `   - #${m.index} ${moveSummary(m)}`),
  };
}

function segmentLoops(
  kata: SknKata,
  reps: number,
  start?: number,
  end?: number,
): PracticeLoop[] {
  const selected = clampRange(kata.moves, start, end);
  if (selected.length === 0) return [];

  if (start != null || end != null) {
    const label =
      selected.length === 1
        ? `Move ${selected[0].index}`
        : `Moves ${selected[0].index}-${selected[selected.length - 1].index}`;
    return [loopFromMoves(`LOOP: Segment (${label})`, selected, reps)];
  }

  const groups = groupByFacing(kata.moves);
  const loops: PracticeLoop[] = [];
  for (const group of groups) {
    if (group.moves.length === 0) continue;
    const first = group.moves[0].index;
    const last = group.moves[group.moves.length - 1].index;
    const label =
      first === last
        ? `Face ${group.face} (move ${first})`
        : `Face ${group.face} (moves ${first}-${last})`;
    loops.push(loopFromMoves(`LOOP: ${label}`, group.moves, reps));
  }
  return loops;
}

function isolatedLoops(kata: SknKata, reps: number): PracticeLoop[] {
  const loops: PracticeLoop[] = [];
  for (const move of kata.moves) {
    if (move.beats.length > 0) {
      for (const beat of move.beats) {
        loops.push({
          title: `ISOLATE: #${move.index} ${beat.label}`,
          reps,
          moveIndexes: [move.index],
          lines: [
            `   - [${move.movement}] ${beat.stance || ""}`.trimEnd(),
            `     Action: ${beat.action || "(none)"}`,
          ],
        });
      }
      continue;
    }
    if (!move.action) continue;
    loops.push({
      title: `ISOLATE: #${move.index} ${move.action}`,
      reps,
      moveIndexes: [move.index],
      lines: [
        `   - Stance: ${move.stance || "(none)"}`,
        `     Action: ${move.action}`,
      ],
    });
  }
  return loops;
}

function facingLoops(kata: SknKata, reps: number): PracticeLoop[] {
  return groupByFacing(kata.moves).map((group) => {
    const first = group.moves[0].index;
    const last = group.moves[group.moves.length - 1].index;
    const span = first === last ? `move ${first}` : `moves ${first}-${last}`;
    return loopFromMoves(
      `FACING GROUP: ${group.face} (${span})`,
      group.moves,
      reps,
    );
  });
}

function pickInterestingIsolates(
  kata: SknKata,
  reps: number,
  seed: number,
): PracticeLoop[] {
  const keywords = [
    /otoshi/i,
    /age-uke/i,
    /shuto/i,
    /gedan-barai/i,
    /oi-tsuki/i,
  ];
  const scored = kata.moves
    .map((m) => {
      const hay = `${m.action || ""} ${m.beats.map((b) => b.action || "").join(" ")}`;
      const score = keywords.reduce((n, re) => n + (re.test(hay) ? 1 : 0), 0);
      return { m, score };
    })
    .filter((x) => x.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        ((a.m.index * 17 + seed) % 7) - ((b.m.index * 17 + seed) % 7),
    );

  const chosen = scored.slice(0, 4).map((x) => x.m);
  const loops: PracticeLoop[] = [];
  for (const move of chosen) {
    if (move.beats.length) {
      loops.push(
        loopFromMoves(
          `FOCUS: #${move.index} multi-beat [${move.movement}]`,
          [move],
          reps,
        ),
      );
    } else {
      loops.push(
        loopFromMoves(`FOCUS: #${move.index} ${move.action}`, [move], reps),
      );
    }
  }
  return loops;
}

function autoPlan(kata: SknKata, reps: number, seed: number): PracticeLoop[] {
  const groups = groupByFacing(kata.moves);
  const opening = groups[0]?.moves.slice(0, 2) || kata.moves.slice(0, 2);
  const mid =
    groups[Math.floor(groups.length / 2)]?.moves ||
    kata.moves.slice(
      Math.floor(kata.moves.length / 2),
      Math.floor(kata.moves.length / 2) + 3,
    );
  const finish = kata.moves.slice(-4);

  return [
    loopFromMoves("LOOP: Opening", opening, reps),
    loopFromMoves("LOOP: Mid embusen", mid, reps),
    loopFromMoves("LOOP: Finishing line", finish, reps),
    ...pickInterestingIsolates(kata, reps, seed),
  ];
}

export function generatePracticePlan(
  kata: SknKata,
  options: PracticeOptions,
): string {
  const reps = Math.max(1, Math.min(50, options.reps || 5));
  const fullRuns = Math.max(1, Math.min(10, options.fullRuns || 2));
  const seed = options.seed ?? Date.now() % 10000;
  const modes = new Set(options.modes);

  const sections: PracticeLoop[] = [];

  sections.push({
    title: "WARM-UP: Full kata",
    reps: 1,
    moveIndexes: kata.moves.map((m) => m.index),
    lines: [`   - All ${kata.moves.length} moves once, slow and precise`],
  });

  if (modes.has("auto") || modes.size === 0) {
    sections.push(...autoPlan(kata, reps, seed));
  } else {
    if (modes.has("segments")) {
      sections.push(
        ...segmentLoops(kata, reps, options.rangeStart, options.rangeEnd),
      );
    }
    if (modes.has("facing")) {
      sections.push(...facingLoops(kata, reps));
    }
    if (modes.has("isolated")) {
      const all = isolatedLoops(kata, reps);
      sections.push(...(all.length > 12 ? all.slice(0, 12) : all));
      if (all.length > 12) {
        sections.push({
          title: `… ${all.length - 12} more isolate drills omitted (narrow range or use auto)`,
          reps: 0,
          moveIndexes: [],
          lines: [],
        });
      }
    }
  }

  sections.push({
    title: `FULL RUN x${fullRuns}`,
    reps: fullRuns,
    moveIndexes: kata.moves.map((m) => m.index),
    lines: [
      `   - Complete kata ${fullRuns} time${fullRuns === 1 ? "" : "s"}`,
      kata.closing ? `   - ${kata.closing}` : "   - Return to yoi and bow",
    ],
  });

  const out: string[] = [
    `PRACTICE PLAN: ${kata.name}`,
    kata.start ? `START: ${kata.start}` : "",
    `Moves parsed: ${kata.moves.length}`,
    `Default reps: ${reps}`,
    `Seed: ${seed}`,
    "",
    "Remember: this is a memory aid. Defer to your sensei.",
    "",
  ].filter((line, idx, arr) => !(line === "" && arr[idx - 1] === ""));

  let n = 1;
  for (const section of sections) {
    if (section.reps > 0) {
      out.push(`${n}. ${section.title} x${section.reps}`);
    } else {
      out.push(`${n}. ${section.title}`);
    }
    out.push(...section.lines);
    out.push("");
    n += 1;
  }

  return out.join("\n").trim() + "\n";
}
