import { getCollection } from 'astro:content';

export type DiaryEntry = {
  date: Date;
  time?: string;
  meeting: string;
  conclave?: string;
  where?: string;
  type: 'meeting' | 'enthronement' | 'visit' | 'annual';
};

export const typeLabel: Record<DiaryEntry['type'], string> = {
  meeting: 'Regular meeting',
  enthronement: 'Enthronement',
  visit: 'Divisional visit',
  annual: 'Annual Meeting',
};

/** All diary entries across every diary file, sorted by date. */
export async function getDiary(): Promise<DiaryEntry[]> {
  const files = await getCollection('diary');
  return files
    .flatMap((f) => f.data.entries as DiaryEntry[])
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

/** Entries on or after today (UK date). */
export function upcomingOnly(entries: DiaryEntry[], now = new Date()): DiaryEntry[] {
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  return entries.filter((e) => e.date.getTime() >= today.getTime());
}

export const fmtDiaryDate = (d: Date, weekday: 'short' | 'long' = 'short') =>
  d.toLocaleDateString('en-GB', { weekday, day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
