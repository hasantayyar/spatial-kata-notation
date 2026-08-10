export interface SknBeat {
  label: string;
  stance?: string;
  action?: string;
}

export interface SknMove {
  index: number;
  movement: string;
  face: string;
  stance?: string;
  action?: string;
  note?: string;
  key?: string;
  target?: string;
  kiai?: string;
  beats: SknBeat[];
}

export interface SknKata {
  name: string;
  start: string;
  closing: string;
  moves: SknMove[];
}

export class SknParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SknParseError";
  }
}

const MOVE_RE =
  /^\s*\+--\s*\[([^\]]+)\][^(]*\(Face:\s*([^)]+)\)\s*$/i;
const FIELD_RE =
  /^\s*[│|]?\s*[├└]\s*[─-]?\s*(Stance|Action|Note|Key|Target|Kiai|Beat\s*\d+)\s*:\s*(.+?)\s*$/i;
const BEAT_ACTION_RE =
  /^\s*[│|]?\s*[│|]?\s*[└]\s*[─-]?\s*Action\s*:\s*(.+?)\s*$/i;
const KATA_RE = /^KATA:\s*(.+)$/im;
const START_RE = /^START(?:ING POINT)?:\s*(.+)$/im;
const CLOSING_RE = /RETURN TO YOI.*$/im;

function looksLikeBunkai(text: string): boolean {
  return (
    /BUNKAI\s*:/i.test(text) ||
    /\[ATTACKER/i.test(text) ||
    /\[DEFENDER/i.test(text)
  );
}

function parseFieldBlock(lines: string[], start: number): {
  fields: Record<string, string>;
  beats: SknBeat[];
  next: number;
} {
  const fields: Record<string, string> = {};
  const beats: SknBeat[] = [];
  let i = start;
  let currentBeat: SknBeat | null = null;

  while (i < lines.length) {
    const line = lines[i];
    if (/^\s*\+--\s*\[/.test(line)) break;
    if (/^\s*v\s*$/.test(line)) break;
    if (CLOSING_RE.test(line)) break;

    const beatAction = line.match(BEAT_ACTION_RE);
    if (beatAction && currentBeat) {
      currentBeat.action = beatAction[1].trim();
      i += 1;
      continue;
    }

    const field = line.match(FIELD_RE);
    if (field) {
      const kind = field[1].trim();
      const value = field[2].trim();
      if (/^Beat\s*\d+/i.test(kind)) {
        currentBeat = { label: kind, stance: value };
        beats.push(currentBeat);
      } else {
        currentBeat = null;
        fields[kind.toLowerCase()] = value;
      }
      i += 1;
      continue;
    }

    i += 1;
  }

  return { fields, beats, next: i };
}

/** Parse a kata SKN sheet into structured moves. Rejects bunkai dual-column sheets. */
export function parseSkn(text: string): SknKata {
  const raw = text.replace(/\r\n/g, "\n").trim();
  if (!raw) {
    throw new SknParseError("Paste a kata SKN sheet first.");
  }
  if (looksLikeBunkai(raw)) {
    throw new SknParseError(
      "This looks like a bunkai sheet. Paste a kata spine sheet instead (v1).",
    );
  }

  const lines = raw.split("\n");
  const nameMatch = raw.match(KATA_RE);
  const startMatch = raw.match(START_RE);
  const closingMatch = raw.match(CLOSING_RE);

  const moves: SknMove[] = [];
  let i = 0;
  while (i < lines.length) {
    const moveMatch = lines[i].match(MOVE_RE);
    if (!moveMatch) {
      i += 1;
      continue;
    }

    const movement = moveMatch[1].trim();
    const face = moveMatch[2].trim();
    const { fields, beats, next } = parseFieldBlock(lines, i + 1);

    moves.push({
      index: moves.length + 1,
      movement,
      face,
      stance: fields.stance,
      action: fields.action,
      note: fields.note,
      key: fields.key,
      target: fields.target,
      kiai: fields.kiai,
      beats,
    });
    i = next;
  }

  if (moves.length === 0) {
    throw new SknParseError(
      "No moves found. Expect lines like: +-- [STEP → N] (Face: N)",
    );
  }

  return {
    name: nameMatch?.[1]?.trim() || "Untitled kata",
    start: startMatch?.[1]?.trim() || "",
    closing: closingMatch?.[0]?.trim() || "",
    moves,
  };
}

export function moveSummary(move: SknMove): string {
  if (move.beats.length > 0) {
    const parts = move.beats.map((b) => {
      const action = b.action ? ` ${b.action}` : "";
      return `${b.label}${action}`.trim();
    });
    return `[${move.movement}] ${parts.join(" → ")}`;
  }
  const action = move.action || "(no action)";
  return `[${move.movement}] ${action}`;
}

export function groupByFacing(moves: SknMove[]): { face: string; moves: SknMove[] }[] {
  const groups: { face: string; moves: SknMove[] }[] = [];
  for (const move of moves) {
    const last = groups[groups.length - 1];
    if (last && last.face === move.face) {
      last.moves.push(move);
    } else {
      groups.push({ face: move.face, moves: [move] });
    }
  }
  return groups;
}
