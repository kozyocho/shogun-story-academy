import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const url = process.env.DATABASE_URL ?? "file:./dev.db";
const authToken = process.env.DATABASE_AUTH_TOKEN;
const libsql = createClient({ url, authToken });
const adapter = new PrismaLibSQL(libsql);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Helper: upsert a decision for a story (idempotent via deleteMany + create)
  async function upsertDecision(storySlug: string, data: {
    afterParagraph: number;
    question: string;
    optionA: string;
    optionB: string;
    optionC: string;
    correctOption: number;
    historicalNote: string;
    wrongNote: string;
  }) {
    const story = await prisma.story.findUnique({ where: { slug: storySlug }, select: { id: true } });
    if (!story) return;
    await prisma.storyDecision.deleteMany({ where: { storyId: story.id, afterParagraph: data.afterParagraph } });
    await prisma.storyDecision.create({ data: { storyId: story.id, ...data } });
  }

  // ── Story 1: Battle of Okehazama (FREE) ─────────────────────────────
  await prisma.story.upsert({
    where: { slug: "the-battle-of-okehazama" },
    update: {
      imageUrl:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Oda_Nobunaga.jpg?width=640",
    },
    create: {
      slug: "the-battle-of-okehazama",
      title: "The Battle of Okehazama",
      imageUrl:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Oda_Nobunaga.jpg?width=640",
      summary:
        "In 1560, a young Oda Nobunaga faced an army ten times the size of his own. What happened next changed the course of Japanese history.",
      content: `In the summer of 1560, the warlord Imagawa Yoshimoto marched toward Kyoto with an army of over 25,000 men. Standing in his way was Oda Nobunaga, a young lord with fewer than 3,000 soldiers.

Most advisors expected Nobunaga to either surrender or die defending his castle walls. Instead, he made a bold and unexpected choice: he would attack.

Yoshimoto's massive army had stopped to rest in a narrow gorge near the village of Okehazama. A fierce summer storm struck suddenly, reducing visibility and masking the sound of movement. Nobunaga led a small strike force directly into the heart of the enemy camp.

In the chaos of the storm, Imagawa Yoshimoto was caught off guard. He was killed before his guards could react. Without their leader, the massive Imagawa army collapsed and retreated.

This victory made Nobunaga famous across Japan. It showed that boldness and timing could overcome overwhelming odds — a lesson that would define his career as he worked to unify a fractured nation.`,
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

  // ── Story 2: Bushido (FREE) ──────────────────────────────────────────
  await prisma.story.upsert({
    where: { slug: "bushido-the-way-of-the-warrior" },
    update: {
      imageUrl:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Saigo_Takamori.jpg?width=640",
    },
    create: {
      slug: "bushido-the-way-of-the-warrior",
      title: "Bushido: The Way of the Warrior",
      imageUrl:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Saigo_Takamori.jpg?width=640",
      summary:
        "Honor, loyalty, and death without regret — the samurai code of Bushido shaped every aspect of a warrior's life, from the battlefield to the tea ceremony.",
      content: `The word "samurai" means "one who serves." But what a samurai served was not merely a lord — it was a code. That code was called Bushido: the Way of the Warrior.

Bushido was never written down as a single rulebook. It grew over centuries from Confucian ethics, Zen Buddhism, and the hard lessons of war. By the Edo period (1603–1868), it had become the defining philosophy of the samurai class.

At its core, Bushido prized seven virtues: rectitude (doing what is right), courage, benevolence, respect, honesty, honor, and loyalty. A samurai who violated these principles faced disgrace — not just for himself, but for his family and his lord.

Perhaps the most striking aspect of Bushido was its relationship with death. Samurai were trained to face death without fear. The practice of seppuku — ritual self-disembowelment — allowed a warrior to die on his own terms rather than be captured or dishonored. This was considered not morbid, but noble.

Bushido did not disappear with the samurai class. In the early 20th century, writer Nitobe Inazo published Bushido: The Soul of Japan, introducing the concept to Western readers. Its influence can still be felt in Japanese business culture, martial arts, and the country's deep respect for discipline and perseverance.`,
      era: "Sengoku–Edo Period",
      figure: null,
      isPremium: false,
      order: 2,
      vocabulary: {
        create: [
          {
            term: "Bushido",
            reading: "武士道",
            definition:
              "The ethical code of the samurai, emphasizing honor, loyalty, martial skill, and acceptance of death.",
            culturalNote:
              "Literally 'Way of the Warrior.' Comparable in function to the European concept of chivalry.",
          },
          {
            term: "Seppuku",
            reading: "切腹",
            definition:
              "Ritual suicide by self-disembowelment, performed by samurai to die with honor rather than face defeat or disgrace.",
            culturalNote:
              "Sometimes called hara-kiri in Western accounts. Considered the ultimate act of personal honor.",
          },
          {
            term: "Daimyo",
            reading: "大名",
            definition:
              "A powerful feudal lord who commanded samurai and controlled a domain. Samurai owed absolute loyalty to their daimyo.",
          },
        ],
      },
      questions: {
        create: [
          {
            question: "Which of the following is NOT one of the seven core virtues of Bushido?",
            options: JSON.stringify([
              "Loyalty",
              "Wealth",
              "Courage",
              "Honesty",
            ]),
            answer: 1,
          },
          {
            question: "What was the purpose of seppuku?",
            options: JSON.stringify([
              "To punish criminals",
              "To honor the emperor",
              "To die with honor rather than face disgrace",
              "To demonstrate martial skill",
            ]),
            answer: 2,
          },
        ],
      },
      tags: {
        create: [
          { name: "Bushido" },
          { name: "Culture" },
          { name: "Philosophy" },
        ],
      },
    },
  });

  // ── Story 3: Miyamoto Musashi (PREMIUM) ─────────────────────────────
  await prisma.story.upsert({
    where: { slug: "the-lone-samurai-miyamoto-musashi" },
    update: {
      imageUrl:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Miyamoto_Musashi-Portrait.jpg?width=640",
    },
    create: {
      slug: "the-lone-samurai-miyamoto-musashi",
      title: "The Lone Samurai: Miyamoto Musashi",
      imageUrl:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Miyamoto_Musashi-Portrait.jpg?width=640",
      summary:
        "Miyamoto Musashi never lost a duel in over sixty fights. His approach to combat — and to life — still influences martial arts today.",
      content: `Miyamoto Musashi was born around 1584, near the end of the Sengoku period. He fought his first duel at age thirteen and never stopped.

Over the course of his life, Musashi fought more than sixty duels and won every one. He often arrived late, fought with two swords, or showed up carrying a wooden sword against an armed opponent. He seemed to court disadvantage — and turn it into victory.

His most famous duel was against Sasaki Kojiro in 1612. Kojiro was a celebrated swordsman known for a technique called the "swallow cut." Musashi arrived hours late by boat, carrying a sword he had carved from an oar during the journey. Kojiro was furious. Musashi used that anger against him and won in moments.

In his later years, Musashi gave up dueling and turned to writing and painting. His book, The Book of Five Rings, written shortly before his death in 1645, describes strategy not just for swordsmanship but for all of life's conflicts. It is still read around the world today.`,
      era: "Late Sengoku / Edo Period",
      figure: "Miyamoto Musashi",
      isPremium: true,
      order: 3,
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
        create: [
          { name: "Miyamoto Musashi" },
          { name: "Duels" },
          { name: "Philosophy" },
        ],
      },
    },
  });

  // ── Story 4: Toyotomi Hideyoshi (PREMIUM) ───────────────────────────
  await prisma.story.upsert({
    where: { slug: "from-sandal-bearer-to-ruler-toyotomi-hideyoshi" },
    update: {
      imageUrl:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Toyotomi_Hideyoshi.jpg?width=640",
    },
    create: {
      slug: "from-sandal-bearer-to-ruler-toyotomi-hideyoshi",
      title: "From Sandal-Bearer to Ruler: Toyotomi Hideyoshi",
      imageUrl:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Toyotomi_Hideyoshi.jpg?width=640",
      summary:
        "Born a peasant with no family name, Toyotomi Hideyoshi rose to become the most powerful man in Japan. His story is one of history's most remarkable ascents.",
      content: `In feudal Japan, your birth determined your destiny. Samurai were born samurai; peasants remained peasants. But Toyotomi Hideyoshi never accepted that rule.

Born around 1537 to a poor farming family, Hideyoshi left home as a teenager to seek his fortune. He eventually found his way into the service of Oda Nobunaga as a sandal-bearer — one of the lowest positions a retainer could hold. He was short, thin, and had a face that earned him the nickname "monkey."

Yet Nobunaga saw something in him. Hideyoshi proved himself intelligent, loyal, and unafraid of impossible tasks. When ordered to repair a crumbling castle wall in a single night — a task considered hopeless — Hideyoshi organized local workers, kept them motivated through the night, and completed the job by dawn. Nobunaga was astonished.

Hideyoshi rose steadily through the ranks, eventually becoming one of Nobunaga's most trusted generals. After Nobunaga's assassination in 1582, Hideyoshi moved swiftly to avenge his lord and then consolidate power for himself. By 1590, he had achieved what Nobunaga never quite managed: the reunification of all of Japan.

He issued the Sword Hunt of 1588, confiscating weapons from peasants and fixing the class boundaries — partly to maintain order, and partly because he knew better than anyone how dangerous a clever peasant could be. Hideyoshi died in 1598, but the unified Japan he built set the stage for the long peace of the Edo period.`,
      era: "Sengoku Period",
      figure: "Toyotomi Hideyoshi",
      isPremium: true,
      order: 4,
      timelineEvent: {
        create: {
          year: 1590,
          title: "Hideyoshi Unifies Japan",
          description:
            "Toyotomi Hideyoshi completes the reunification of Japan, the first person of peasant origin to rule the entire country.",
        },
      },
      vocabulary: {
        create: [
          {
            term: "Retainer",
            definition:
              "A samurai in the service of a lord (daimyo). The relationship was one of total loyalty in exchange for land and stipend.",
          },
          {
            term: "Sword Hunt",
            reading: "刀狩り (Katanagari)",
            definition:
              "A 1588 edict by Hideyoshi ordering all peasants to surrender their weapons. It enforced the separation of warrior and farming classes.",
            culturalNote:
              "The swords collected were melted down to build a giant statue of Buddha — framed as an act of piety as well as control.",
          },
        ],
      },
      questions: {
        create: [
          {
            question: "What was Hideyoshi's first role in Oda Nobunaga's service?",
            options: JSON.stringify([
              "General",
              "Castle architect",
              "Sandal-bearer",
              "Tax collector",
            ]),
            answer: 2,
          },
          {
            question: "What was the purpose of the Sword Hunt of 1588?",
            options: JSON.stringify([
              "To arm peasants for war",
              "To collect tribute for the emperor",
              "To disarm peasants and fix class boundaries",
              "To fund a new castle",
            ]),
            answer: 2,
          },
        ],
      },
      tags: {
        create: [
          { name: "Toyotomi Hideyoshi" },
          { name: "Unification" },
          { name: "Rise to Power" },
        ],
      },
    },
  });

  // ── Story 5: Battle of Nagashino (PREMIUM) ──────────────────────────
  await prisma.story.upsert({
    where: { slug: "the-guns-of-nagashino" },
    update: {
      imageUrl:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Nagashino_Battle.jpg?width=640",
    },
    create: {
      slug: "the-guns-of-nagashino",
      title: "The Guns of Nagashino",
      imageUrl:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Nagashino_Battle.jpg?width=640",
      summary:
        "In 1575, Oda Nobunaga deployed 3,000 arquebusiers in rotating volleys against the legendary Takeda cavalry. It was the day samurai warfare changed forever.",
      content: `The Takeda cavalry were the most feared fighting force in Japan. Their armored horsemen had won battle after battle across the Sengoku period, and their reputation alone was enough to unsettle enemies.

At the Battle of Nagashino in 1575, they charged into something new.

Oda Nobunaga and his ally Tokugawa Ieyasu had assembled a force of 3,000 arquebusiers — soldiers armed with matchlock firearms introduced to Japan by Portuguese traders in 1543. Nobunaga had a plan that no one had tried before.

He arranged the gunners in three rotating lines behind a wooden palisade. As the first line fired, they stepped back to reload while the second line fired, then the third. The result was a near-continuous wall of gunfire — something no cavalry charge could survive.

The Takeda horsemen, bred for the shock of sword and lance, had no answer. Wave after wave was cut down before reaching the palisade. The battle ended in decisive defeat for the Takeda, and their power never fully recovered.

Nagashino is remembered not just as a military victory, but as a turning point. It showed that disciplined organization and new technology could defeat even the most storied traditional force — a lesson that resonates far beyond medieval Japan.`,
      era: "Sengoku Period",
      figure: "Oda Nobunaga",
      isPremium: true,
      order: 5,
      timelineEvent: {
        create: {
          year: 1575,
          title: "Battle of Nagashino",
          description:
            "Nobunaga deploys rotating arquebus volleys to defeat the Takeda cavalry, marking the rise of firearms in Japanese warfare.",
        },
      },
      vocabulary: {
        create: [
          {
            term: "Arquebus",
            definition:
              "An early type of firearm, introduced to Japan by Portuguese traders in 1543. Also called tanegashima (種子島) in Japanese.",
            culturalNote:
              "Within decades, Japan had more firearms per capita than almost any country in the world.",
          },
          {
            term: "Palisade",
            definition:
              "A fence of wooden stakes used as a defensive barrier. Nobunaga's palisades at Nagashino gave his gunners protected firing positions.",
          },
        ],
      },
      questions: {
        create: [
          {
            question: "What was Nobunaga's key innovation at Nagashino?",
            options: JSON.stringify([
              "Using cavalry instead of infantry",
              "Attacking at night",
              "Organizing gunners in rotating firing lines",
              "Diverting a river to flood the battlefield",
            ]),
            answer: 2,
          },
          {
            question: "When were firearms first introduced to Japan?",
            options: JSON.stringify([
              "1467",
              "1543",
              "1560",
              "1600",
            ]),
            answer: 1,
          },
        ],
      },
      tags: {
        create: [
          { name: "Oda Nobunaga" },
          { name: "Battle" },
          { name: "Firearms" },
          { name: "Takeda" },
        ],
      },
    },
  });

  // ── Story 6: Battle of Sekigahara (PREMIUM) ─────────────────────────
  await prisma.story.upsert({
    where: { slug: "the-battle-that-made-japan-sekigahara" },
    update: {
      imageUrl:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Battle_of_Sekigahara.jpg?width=640",
    },
    create: {
      slug: "the-battle-that-made-japan-sekigahara",
      title: "The Battle That Made Japan: Sekigahara",
      imageUrl:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Battle_of_Sekigahara.jpg?width=640",
      summary:
        "On October 21, 1600, two massive coalitions clashed in the fog of a mountain pass. When the battle ended six hours later, Tokugawa Ieyasu had won 250 years of peace.",
      content: `After the death of Toyotomi Hideyoshi in 1598, Japan's fragile unity began to fracture. Two factions emerged: those loyal to Hideyoshi's young heir, led by the administrator Ishida Mitsunari, and those who backed the powerful daimyo Tokugawa Ieyasu.

The showdown came on October 21, 1600, at a narrow mountain pass called Sekigahara. Ieyasu commanded around 75,000 men on the Eastern Army. Mitsunari's Western Army numbered roughly 85,000. On paper, the West should have won.

But Ieyasu had been busy. In the months before the battle, he had secretly negotiated with several Western Army generals, offering land and power in exchange for betrayal.

The morning of the battle was thick with fog. When the fighting began, the Western Army held firm — until, at a critical moment, the general Kobayakawa Hideaki switched sides. Other Western lords followed. The Western Army collapsed from within.

The battle lasted just six hours. Ishida Mitsunari fled and was later captured and executed. Ieyasu was appointed Shogun by the emperor in 1603, establishing the Tokugawa Shogunate.

His dynasty would rule Japan for over 250 years, a period of enforced peace, rigid social order, and remarkable cultural flourishing. Sekigahara was not just a battle — it was the hinge on which all of modern Japanese history turned.`,
      era: "Sengoku Period",
      figure: "Tokugawa Ieyasu",
      isPremium: true,
      order: 6,
      timelineEvent: {
        create: {
          year: 1600,
          title: "Battle of Sekigahara",
          description:
            "Tokugawa Ieyasu defeats the Toyotomi coalition, paving the way for 250 years of Tokugawa rule and the Edo period.",
        },
      },
      vocabulary: {
        create: [
          {
            term: "Shogun",
            reading: "将軍",
            definition:
              "The military dictator of Japan, nominally appointed by the emperor. The Shogun held real power while the emperor remained a ceremonial figurehead.",
          },
          {
            term: "Tokugawa Shogunate",
            reading: "徳川幕府",
            definition:
              "The feudal government established by Tokugawa Ieyasu in 1603, lasting until 1868. Also called the Edo period.",
            culturalNote:
              "The Shogunate's 250-year peace allowed Japanese arts, crafts, and culture to flourish in remarkable ways.",
          },
        ],
      },
      questions: {
        create: [
          {
            question: "What was the key reason the Western Army lost at Sekigahara?",
            options: JSON.stringify([
              "They ran out of ammunition",
              "Several generals betrayed them mid-battle",
              "Ieyasu outnumbered them two-to-one",
              "A storm destroyed their supply lines",
            ]),
            answer: 1,
          },
          {
            question: "How long did the Tokugawa Shogunate last after Sekigahara?",
            options: JSON.stringify([
              "About 50 years",
              "About 100 years",
              "Over 250 years",
              "Until 1945",
            ]),
            answer: 2,
          },
        ],
      },
      tags: {
        create: [
          { name: "Tokugawa Ieyasu" },
          { name: "Battle" },
          { name: "Unification" },
          { name: "Edo Period" },
        ],
      },
    },
  });

  // ── Decision Points ──────────────────────────────────────────────────

  // Story 1: Battle of Okehazama
  await upsertDecision("the-battle-of-okehazama", {
    afterParagraph: 1,
    question: "You are Oda Nobunaga. Imagawa's army is 10 times your size, resting in a gorge during a sudden storm. What do you do?",
    optionA: "Hold your castle walls and defend",
    optionB: "Retreat and send a peace envoy",
    optionC: "Strike NOW — charge into the storm",
    correctOption: 2,
    historicalNote: "Nobunaga did exactly this. Historians call it one of history's great gambles — the storm masked his approach and killed enemy visibility. His decisive strike killed Yoshimoto himself, collapsing the invasion.",
    wrongNote: "Most commanders would have. But Nobunaga chose the impossible option — a direct charge into a superior force during a storm. It was the gamble that launched his rise to power.",
  });

  // Story 2: Bushido
  await upsertDecision("bushido-the-way-of-the-warrior", {
    afterParagraph: 2,
    question: "A samurai has been captured. He is offered a chance to escape — but only by abandoning his lord. What should he do?",
    optionA: "Escape — survival serves the lord better",
    optionB: "Perform seppuku — die with honor",
    optionC: "Negotiate surrender terms to buy time",
    correctOption: 1,
    historicalNote: "Under Bushido, death with honor was always preferred to survival through compromise. The samurai's life belonged to his lord and his code — not to himself.",
    wrongNote: "Bushido rejected this reasoning. The code held that a warrior who compromised his honor to survive had already ceased to be a samurai.",
  });

  // Story 3: Miyamoto Musashi
  await upsertDecision("the-lone-samurai-miyamoto-musashi", {
    afterParagraph: 1,
    question: "Musashi is hours late to his duel with Kojiro. Kojiro is furious. Musashi holds only a wooden sword he carved from an oar. What is his strategy?",
    optionA: "Apologize and ask to reschedule",
    optionB: "Use Kojiro's anger against him — attack immediately",
    optionC: "Request a real sword before fighting",
    correctOption: 1,
    historicalNote: "Musashi arrived late deliberately — to destabilize Kojiro emotionally. He then struck before Kojiro could recover his composure. The duel lasted moments.",
    wrongNote: "Musashi never apologized for an advantage. He arrived late on purpose, knowing fury clouds judgment. His weapon was psychological before the first blow was struck.",
  });

  // Story 4: Toyotomi Hideyoshi
  await upsertDecision("from-sandal-bearer-to-ruler-toyotomi-hideyoshi", {
    afterParagraph: 2,
    question: "After Nobunaga's assassination, you are Hideyoshi — a general with no royal blood. How do you claim leadership of Japan?",
    optionA: "Declare yourself regent and demand loyalty",
    optionB: "Avenge Nobunaga first, then build political power from that loyalty",
    optionC: "Retire — a peasant cannot rule Japan",
    correctOption: 1,
    historicalNote: "Hideyoshi moved faster than any rival to avenge Nobunaga. By doing so publicly, he positioned himself as the legitimate heir to Nobunaga's legacy — giving him the political capital to seize power.",
    wrongNote: "Without noble blood, Hideyoshi needed a different kind of legitimacy. Avenging Nobunaga was his answer — loyalty made visible through action, not words.",
  });

  // Story 5: Battle of Nagashino
  await upsertDecision("the-guns-of-nagashino", {
    afterParagraph: 1,
    question: "The Takeda cavalry — Japan's most feared force — is charging at you. Your arquebusiers each take 30 seconds to reload. How do you deploy them?",
    optionA: "Charge the cavalry before they reach your line",
    optionB: "Arrange gunners in rotating firing lines — one group always fires while others reload",
    optionC: "Use archers instead — they reload faster",
    correctOption: 1,
    historicalNote: "Nobunaga's rotating volley system meant the Takeda cavalry faced near-continuous gunfire. It had never been used in Japan before — and it was devastating. The Takeda never recovered.",
    wrongNote: "Nobunaga thought differently. Instead of solving the reload problem for one gunner, he solved it across the entire formation — creating a continuous wall of fire no cavalry could cross.",
  });

  // Story 6: Battle of Sekigahara
  await upsertDecision("the-battle-that-made-japan-sekigahara", {
    afterParagraph: 1,
    question: "You are Tokugawa Ieyasu. The Western Army outnumbers you. In the months before battle, what is your most important move?",
    optionA: "Build fortifications along the likely battle route",
    optionB: "Secretly negotiate with Western Army generals — promise them land to switch sides",
    optionC: "Recruit foreign mercenaries with better weapons",
    correctOption: 1,
    historicalNote: "Ieyasu spent the months before Sekigahara in secret diplomacy. When Kobayakawa Hideaki switched sides mid-battle, the Western Army collapsed from within — exactly as Ieyasu had arranged.",
    wrongNote: "Ieyasu understood: battles are decided before they begin. His weapon was not the sword but the deal made in private — the betrayal planned months in advance.",
  });

  console.log("Seed complete. 6 stories upserted.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
