export type Scene = {
  title: string;
  body: string[];
  choices: { label: string; nextSceneSlug: string }[];
  historyNotes: string[];
  glossary: { term: string; meaning: string }[];
  quiz: { question: string; options: string[]; answer: string };
};

export type Chapter = {
  slug: string;
  title: string;
  summary: string;
  scenes: Record<string, Scene>;
};

export const chapters: Chapter[] = [
  {
    slug: 'arrival-at-edo',
    title: 'Arrival at Edo',
    summary: '江戸に到着した主人公が町の空気に触れる導入。',
    scenes: {
      'market-gate': {
        title: 'Market Gate',
        body: [
          'You step through the wooden gate and smell grilled fish in the morning air.',
          'A merchant bows and asks whether you came from the northern roads.',
          'The city hums softly, as if every alley hides a new lesson.'
        ],
        choices: [
          { label: 'Follow the merchant to the stall', nextSceneSlug: 'tea-stall' },
          { label: 'Walk toward the castle road', nextSceneSlug: 'castle-road' }
        ],
        historyNotes: ['江戸は人口100万に迫る世界有数の都市だった。', '城下町の門では物流と人の出入りが管理されていた。'],
        glossary: [
          { term: 'merchant', meaning: '商人' },
          { term: 'alley', meaning: '路地' }
        ],
        quiz: {
          question: 'What does the merchant do when he speaks to you?',
          options: ['He shouts.', 'He bows.', 'He runs away.'],
          answer: 'He bows.'
        }
      },
      'tea-stall': {
        title: 'Tea Stall',
        body: ['At the tea stall, steam rises from small cups.', 'You hear news about a festival near the river tonight.'],
        choices: [{ label: 'Return to chapter list', nextSceneSlug: 'market-gate' }],
        historyNotes: ['茶屋は情報交換の場としても機能した。'],
        glossary: [{ term: 'steam', meaning: '湯気' }],
        quiz: {
          question: 'Where is the festival mentioned?',
          options: ['Near the river', 'At the castle', 'In the mountains'],
          answer: 'Near the river'
        }
      },
      'castle-road': {
        title: 'Castle Road',
        body: ['The stone road widens as samurai pass in ordered lines.', 'You realize discipline is part of the city rhythm.'],
        choices: [{ label: 'Return to chapter list', nextSceneSlug: 'market-gate' }],
        historyNotes: ['武家地では身分秩序が厳格に保たれた。'],
        glossary: [{ term: 'discipline', meaning: '規律' }],
        quiz: {
          question: 'Who passes in ordered lines?',
          options: ['Farmers', 'Samurai', 'Children'],
          answer: 'Samurai'
        }
      }
    }
  }
];

export function getChapter(chapterSlug: string) {
  return chapters.find((chapter) => chapter.slug === chapterSlug);
}
