import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.story.upsert({
    where: { slug: "the-battle-of-okehazama" },
    update: {},
    create: {
      slug: "the-battle-of-okehazama",
      title: "The Battle of Okehazama",
      summary:
        "In 1560, a young Oda Nobunaga faced an army ten times the size of his own. What happened next changed the course of Japanese history.",
      content: `<p>In the summer of 1560, the warlord Imagawa Yoshimoto marched toward Kyoto with an army of over 25,000 men. Standing in his way was Oda Nobunaga, a young lord with fewer than 3,000 soldiers.</p>
<p>Most advisors expected Nobunaga to either surrender or die defending his castle walls. Instead, he made a bold and unexpected choice: he would attack.</p>
<p>Yoshimoto's massive army had stopped to rest in a narrow gorge near the village of Okehazama. A fierce summer storm struck suddenly, reducing visibility and masking the sound of movement. Nobunaga led a small strike force directly into the heart of the enemy camp.</p>
<p>In the chaos of the storm, Imagawa Yoshimoto was caught off guard. He was killed before his guards could react. Without their leader, the massive Imagawa army collapsed and retreated.</p>
<p>This victory made Nobunaga famous across Japan. It showed that boldness and timing could overcome overwhelming odds — a lesson that would define his career as he worked to unify a fractured nation.</p>`,
      era: "Sengoku Period",
      figure: "Oda Nobunaga",
      isPremium: false,
      order: 1,
      timelineEvent: {
        create: {
          year: 1560,
          title: "Battle of Okehazama",
          description:
            "Oda Nobunaga defeats Imagawa Yoshimoto in a surprise attack during a storm, beginning his rise to national prominence.",
        },
      },
      vocabulary: {
        create: [
          {
            term: "Warlord",
            definition:
              "A military leader who controls a region by force. In the Sengoku period, Japan was divided among many competing warlords.",
          },
          {
            term: "Sengoku",
            reading: "せんごく",
            definition:
              "Literally 'Warring States.' A period of civil war and political upheaval in Japan from approximately 1467 to 1615.",
          },
        ],
      },
      questions: {
        create: [
          {
            question: "Why did Nobunaga's advisors expect him to lose?",
            options: JSON.stringify([
              "He had poor weapons",
              "His army was ten times smaller",
              "He refused to fight",
              "He was ill",
            ]),
            answer: 1,
          },
          {
            question: "What unexpected event helped Nobunaga's attack succeed?",
            options: JSON.stringify([
              "A sudden rainstorm",
              "Betrayal within Yoshimoto's army",
              "A night-time ambush",
              "Reinforcements from Kyoto",
            ]),
            answer: 0,
          },
        ],
      },
      tags: {
        create: [
          { name: "Oda Nobunaga" },
          { name: "Battle" },
          { name: "Strategy" },
        ],
      },
    },
  });

  await prisma.story.upsert({
    where: { slug: "the-lone-samurai-miyamoto-musashi" },
    update: {},
    create: {
      slug: "the-lone-samurai-miyamoto-musashi",
      title: "The Lone Samurai: Miyamoto Musashi",
      summary:
        "Miyamoto Musashi never lost a duel in over sixty fights. His approach to combat — and to life — still influences martial arts today.",
      content: `<p>Miyamoto Musashi was born around 1584, near the end of the Sengoku period. He fought his first duel at age thirteen and never stopped.</p>
<p>Over the course of his life, Musashi fought more than sixty duels and won every one. He often arrived late, fought with two swords, or showed up carrying a wooden sword against an armed opponent. He seemed to court disadvantage — and turn it into victory.</p>
<p>His most famous duel was against Sasaki Kojiro in 1612. Kojiro was a celebrated swordsman known for a technique called the "swallow cut." Musashi arrived hours late by boat, carrying a sword he had carved from an oar during the journey. Kojiro was furious. Musashi used that anger against him and won in moments.</p>
<p>In his later years, Musashi gave up dueling and turned to writing and painting. His book, <em>The Book of Five Rings</em>, written shortly before his death in 1645, describes strategy not just for swordsmanship but for all of life's conflicts. It is still read around the world today.</p>`,
      era: "Late Sengoku / Edo Period",
      figure: "Miyamoto Musashi",
      isPremium: true,
      order: 2,
      vocabulary: {
        create: [
          {
            term: "Duel",
            definition:
              "A formal combat between two individuals, often used to settle disputes of honor in samurai culture.",
          },
          {
            term: "The Book of Five Rings",
            reading: "五輪書 (Go Rin No Sho)",
            definition:
              "A text on strategy, tactics, and philosophy written by Musashi in 1645. It remains influential in martial arts and business strategy.",
          },
        ],
      },
      questions: {
        create: [
          {
            question: "What unusual weapon did Musashi use in his duel with Kojiro?",
            options: JSON.stringify([
              "A spear",
              "A wooden sword carved from an oar",
              "Two steel swords",
              "A fan",
            ]),
            answer: 1,
          },
        ],
      },
      tags: {
        create: [{ name: "Miyamoto Musashi" }, { name: "Duels" }, { name: "Philosophy" }],
      },
    },
  });

  console.log("Seed complete.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
