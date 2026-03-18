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

  // ── Story 7: The Betrayal at Honnoji (PREMIUM) ──────────────────────
  await prisma.story.upsert({
    where: { slug: "the-betrayal-at-honnoji" },
    update: {},
    create: {
      slug: "the-betrayal-at-honnoji",
      title: "The Betrayal at Honnoji",
      imageUrl:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Akechi_Mitsuhide.jpg?width=640",
      summary:
        "In 1582, Oda Nobunaga — the man closest to unifying Japan — was betrayed by one of his own generals. The assassination at Honnoji Temple shocked the nation and changed history.",
      content: `On the night of June 21, 1582, Oda Nobunaga was resting at Honnoji Temple in Kyoto with only a small personal guard. He had nearly completed his decades-long campaign to unify Japan. His most dangerous enemies were defeated. Peace seemed within reach.

Then he heard the sound of soldiers — thousands of them — surrounding the temple.

The general Akechi Mitsuhide, one of Nobunaga's most trusted commanders, had turned his army against his own lord. His reasons remain debated to this day. Some historians point to public humiliations Nobunaga had inflicted on Mitsuhide. Others suggest political calculation: Mitsuhide feared what a unified Japan under Nobunaga would mean for men like himself.

Nobunaga fought back with his own hands as the temple burned around him. According to accounts, he said simply: "It cannot be helped." He died in the flames — whether by his own hand or the fire, no one knows for certain.

Akechi Mitsuhide seized Kyoto and declared himself master of the capital. He had calculated that the other great generals were too far away to respond quickly.

He was wrong. Toyotomi Hideyoshi, campaigning in the west, force-marched his army back at extraordinary speed. Just thirteen days after Honnoji, he crushed Mitsuhide's forces at the Battle of Yamazaki. Mitsuhide was killed — possibly by bandits — shortly after the defeat.

In Japanese history, the phrase "Mitsuhide's three days" mocks how briefly his triumph lasted. But his act ended the life of the man who might have unified Japan a decade earlier, and forever changed who would finish the job.`,
      era: "Sengoku Period",
      figure: "Oda Nobunaga",
      isPremium: true,
      order: 7,
      timelineEvent: {
        create: {
          year: 1582,
          title: "Incident at Honnoji",
          description:
            "Akechi Mitsuhide betrays and kills Oda Nobunaga at Honnoji Temple in Kyoto, ending Nobunaga's campaign to unify Japan.",
        },
      },
      vocabulary: {
        create: [
          {
            term: "Honnoji Incident",
            reading: "本能寺の変 (Honnoji no Hen)",
            definition:
              "The 1582 assassination of Oda Nobunaga by his general Akechi Mitsuhide. One of the most dramatic betrayals in Japanese history.",
            culturalNote:
              "The phrase 'the enemy is at Honnoji' (敵は本能寺にあり) is still used in Japanese to mean a hidden, unexpected motive.",
          },
          {
            term: "Vassal",
            definition:
              "A lord who pledges loyalty and military service to a more powerful lord in exchange for land or protection. Mitsuhide was Nobunaga's vassal.",
          },
          {
            term: "Coup",
            definition:
              "A sudden seizure of power, especially by force. Mitsuhide's attack on Honnoji was a military coup against his own master.",
          },
        ],
      },
      questions: {
        create: [
          {
            question: "Why did Akechi Mitsuhide betray Nobunaga?",
            options: JSON.stringify([
              "He was bribed by a foreign power",
              "His exact motives remain debated by historians",
              "Nobunaga ordered him to commit seppuku",
              "He wanted to join the Toyotomi clan",
            ]),
            answer: 1,
          },
          {
            question: "How quickly did Hideyoshi respond after the betrayal?",
            options: JSON.stringify([
              "He arrived within hours",
              "He took several months to return",
              "He defeated Mitsuhide just thirteen days later",
              "He chose not to retaliate",
            ]),
            answer: 2,
          },
        ],
      },
      tags: {
        create: [
          { name: "Oda Nobunaga" },
          { name: "Akechi Mitsuhide" },
          { name: "Betrayal" },
          { name: "Assassination" },
        ],
      },
    },
  });

  // ── Story 8: Hattori Hanzo and the Ninja of Iga (PREMIUM) ───────────
  await prisma.story.upsert({
    where: { slug: "hattori-hanzo-and-the-ninja-of-iga" },
    update: {},
    create: {
      slug: "hattori-hanzo-and-the-ninja-of-iga",
      title: "Hattori Hanzo and the Ninja of Iga",
      imageUrl:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Iga_Ueno_Castle.jpg?width=640",
      summary:
        "Forget the myths. The real ninja were not masked assassins leaping across rooftops — they were intelligence operatives, spies, and saboteurs. Hattori Hanzo was the greatest of them.",
      content: `In popular imagination, ninja are supernatural warriors: silent, invisible, armed with throwing stars, able to vanish in a puff of smoke. The reality was more interesting — and more useful.

Ninja, or shinobi, emerged from the mountainous regions of Iga and Koka in central Japan during the Sengoku period. These provinces were too rugged for conventional armies to easily dominate, and their people developed a tradition of guerrilla warfare, espionage, and psychological operations.

Hattori Hanzo — the real one, not the film character — was born around 1542 in Mikawa Province. He entered the service of Tokugawa Ieyasu as a young man and became his most trusted intelligence operative. His greatest hour came after the assassination of Oda Nobunaga at Honnoji in 1582.

Tokugawa Ieyasu was in hostile territory when Nobunaga died, with no army nearby and enemies potentially closing in. Hattori Hanzo led Ieyasu through the Iga mountains — the heartland of ninja territory — using his network of local contacts to move the future Shogun to safety. Without that escort, Japan's history could have ended very differently.

Real shinobi operations included infiltrating enemy castles as servants, spreading disinformation to sow distrust among enemy commanders, using fire as a weapon of chaos, and gathering intelligence about troop movements and fortifications. The famous black costume is largely a theatrical invention — real shinobi wore whatever allowed them to blend in.

After the Sengoku period ended, Hanzo served as commander of Ieyasu's personal guard in Edo. He died in 1596, his name already legendary. The gate of Edo Castle where his men were stationed — Hanzomon — still carries his name today, as does one of Tokyo's busiest subway stations.`,
      era: "Sengoku Period",
      figure: "Hattori Hanzo",
      isPremium: true,
      order: 8,
      vocabulary: {
        create: [
          {
            term: "Shinobi",
            reading: "忍び",
            definition:
              "The Japanese term for ninja. Literally means 'one who endures' or 'one who conceals.' Preferred by historians over the word 'ninja.'",
            culturalNote:
              "The word 'ninja' became widely used only in the 20th century, partly through popular fiction and film.",
          },
          {
            term: "Iga",
            reading: "伊賀",
            definition:
              "A mountainous region in present-day Mie Prefecture, historically one of the two great centers of shinobi training and culture.",
          },
          {
            term: "Espionage",
            definition:
              "The practice of gathering secret information about an enemy. This was the primary function of real shinobi operatives.",
          },
        ],
      },
      questions: {
        create: [
          {
            question: "What was the primary role of real-life ninja (shinobi)?",
            options: JSON.stringify([
              "Supernatural assassins",
              "Intelligence operatives, spies, and saboteurs",
              "Elite cavalry soldiers",
              "Temple guards",
            ]),
            answer: 1,
          },
          {
            question: "What is Hattori Hanzo's most historically significant act?",
            options: JSON.stringify([
              "Assassinating a rival warlord",
              "Writing the first ninja training manual",
              "Escorting Tokugawa Ieyasu to safety after Honnoji",
              "Defending Osaka Castle alone",
            ]),
            answer: 2,
          },
        ],
      },
      tags: {
        create: [
          { name: "Ninja" },
          { name: "Hattori Hanzo" },
          { name: "Tokugawa Ieyasu" },
          { name: "Espionage" },
        ],
      },
    },
  });

  // ── Story 9: Ii Naotora — The Female Lord (PREMIUM) ─────────────────
  await prisma.story.upsert({
    where: { slug: "ii-naotora-the-female-lord" },
    update: {},
    create: {
      slug: "ii-naotora-the-female-lord",
      title: "Ii Naotora: The Female Lord",
      imageUrl:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Ii_Naotora.jpg?width=640",
      summary:
        "In feudal Japan, women did not rule domains. Ii Naotora did anyway — and kept her clan alive through one of the most brutal periods in samurai history.",
      content: `In the rigid hierarchy of Sengoku Japan, the idea of a woman ruling a samurai domain was almost unthinkable. Yet in 1565, when the Ii clan of Totomi Province lost its last male heir, a woman named Ii Naotora stepped forward to lead.

Naotora had grown up in a temple — her father had sent her there for safety as the clan's fortunes declined. She was educated, disciplined, and deeply aware of the political dangers surrounding her family. When she returned to lead the Ii domain, she did so knowing that powerful neighbors were watching for any sign of weakness.

She governed with a combination of careful diplomacy and practical administration. Her domain was surrounded by stronger powers — the Imagawa, the Takeda, and later the Toyotomi — and she had no military force that could match any of them directly. So she negotiated, paid tribute where necessary, and cultivated alliances that kept the Ii clan intact.

Her greatest achievement may have been recognizing the talent of a young man named Toramatsu, whom she formally adopted as her heir. She trained him, positioned him within Tokugawa Ieyasu's network, and set him on a path that would make him famous. That young man later became Ii Naomasa — one of the "Four Heavenly Kings" of the Tokugawa clan, known for his distinctive red-armored army.

Naotora is sometimes called "Onna Joshu" — the Female Lord. She never led armies into battle. Her battlefield was the political landscape, and she navigated it well enough to preserve her clan through the most violent era in Japanese history.

She died in 1582, the same year as the Honnoji Incident. The Ii clan she saved would go on to become one of the most powerful in Japan.`,
      era: "Sengoku Period",
      figure: "Ii Naotora",
      isPremium: true,
      order: 9,
      vocabulary: {
        create: [
          {
            term: "Onna Joshu",
            reading: "女城主",
            definition:
              "Literally 'Female Castle Lord.' A rare title applied to women who held domain authority in feudal Japan.",
          },
          {
            term: "Diplomatic tribute",
            definition:
              "Payments made to a more powerful lord to maintain peace and avoid conflict. A practical tool of survival for smaller domains.",
          },
          {
            term: "Adopted heir",
            definition:
              "A person formally adopted to inherit a family name and domain. Adoption was common in samurai families to ensure succession.",
            culturalNote:
              "Samurai clans frequently adopted talented men from other families rather than risk the clan dying out.",
          },
        ],
      },
      questions: {
        create: [
          {
            question: "How did Ii Naotora primarily keep her domain safe?",
            options: JSON.stringify([
              "By building the largest army in the region",
              "Through diplomacy, tribute, and careful alliances",
              "By conquering neighboring territories",
              "By appealing to the emperor for protection",
            ]),
            answer: 1,
          },
          {
            question: "Who did Naotora adopt as her heir?",
            options: JSON.stringify([
              "Tokugawa Ieyasu",
              "A man who became Ii Naomasa, one of Tokugawa's greatest generals",
              "Oda Nobunaga's youngest son",
              "Miyamoto Musashi",
            ]),
            answer: 1,
          },
        ],
      },
      tags: {
        create: [
          { name: "Ii Naotora" },
          { name: "Women in History" },
          { name: "Leadership" },
          { name: "Sengoku Period" },
        ],
      },
    },
  });

  // ── Story 10: Tokugawa Ieyasu — The Patience of the Crane (PREMIUM) ─
  await prisma.story.upsert({
    where: { slug: "tokugawa-ieyasu-the-patience-of-the-crane" },
    update: {},
    create: {
      slug: "tokugawa-ieyasu-the-patience-of-the-crane",
      title: "Tokugawa Ieyasu: The Patience of the Crane",
      imageUrl:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Tokugawa_Ieyasu2.jpg?width=640",
      summary:
        "Nobunaga was the hawk. Hideyoshi was the monkey. Ieyasu was the crane — patient, watchful, willing to wait decades for the right moment. It worked.",
      content: `There is a famous Japanese poem about the three great unifiers of Japan. It asks: what do you do if the cuckoo will not sing? Nobunaga says: kill it. Hideyoshi says: make it want to sing. Ieyasu says: wait until it sings.

Tokugawa Ieyasu spent much of his life waiting.

He was born in 1543 as the son of a minor lord in Mikawa Province, and spent his early childhood as a hostage — first to the Oda clan, then to the Imagawa. He watched more powerful men rise and fall. He learned patience the way a child learns a lesson taught by pain.

When he grew powerful enough to be Nobunaga's ally rather than his subordinate, he chose alliance over rivalry — for decades. After Nobunaga's death, he watched Hideyoshi outmaneuver every rival and accepted a demotion of his own territory rather than fight a war he might lose. He waited.

He survived challenges that destroyed other men: the forced suicide of his own son on Nobunaga's orders, the near-destruction of his forces by the Takeda at the Battle of Mikatagahara, the impossible politics of the Toyotomi succession. Each time, he absorbed the blow, rebuilt, and waited.

When Hideyoshi died in 1598, Ieyasu was already 55 years old — ancient by Sengoku standards. Most men who had waited as long as he had were dead. Ieyasu moved.

The victory at Sekigahara in 1600 and his appointment as Shogun in 1603 came after more than fifty years of strategic patience. His Tokugawa Shogunate would outlast every rival dynasty by centuries.

A Japanese proverb says: "The strong eagle hides its talons." Ieyasu was the proof.`,
      era: "Sengoku Period",
      figure: "Tokugawa Ieyasu",
      isPremium: true,
      order: 10,
      vocabulary: {
        create: [
          {
            term: "Hostage diplomacy",
            definition:
              "The practice of sending children of allied or subordinate lords to live at another lord's court as a guarantee of loyalty. Common in the Sengoku period.",
            culturalNote:
              "Ieyasu himself spent years as a hostage, an experience historians believe shaped his exceptional patience and political instinct.",
          },
          {
            term: "Mikatagahara",
            reading: "三方ヶ原",
            definition:
              "A 1572 battle where Ieyasu was decisively defeated by Takeda Shingen. Ieyasu reportedly had a portrait painted of his terrified face afterward — to remind himself never to be reckless again.",
          },
        ],
      },
      questions: {
        create: [
          {
            question: "How did Ieyasu respond to Hideyoshi's rise to power?",
            options: JSON.stringify([
              "He declared war immediately",
              "He accepted a demotion and waited rather than risk conflict",
              "He allied with the Takeda against Hideyoshi",
              "He retired from politics",
            ]),
            answer: 1,
          },
          {
            question: "According to the famous poem, what does Ieyasu do if the cuckoo won't sing?",
            options: JSON.stringify([
              "Kill it",
              "Make it want to sing",
              "Wait until it sings",
              "Replace it with a different bird",
            ]),
            answer: 2,
          },
        ],
      },
      tags: {
        create: [
          { name: "Tokugawa Ieyasu" },
          { name: "Strategy" },
          { name: "Patience" },
          { name: "Edo Period" },
        ],
      },
    },
  });

  // ── Story 11: Takeda Shingen — The Tiger of Kai (PREMIUM) ───────────
  await prisma.story.upsert({
    where: { slug: "takeda-shingen-the-tiger-of-kai" },
    update: {},
    create: {
      slug: "takeda-shingen-the-tiger-of-kai",
      title: "Takeda Shingen: The Tiger of Kai",
      imageUrl:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Takeda_Shingen.jpg?width=640",
      summary:
        "The one man Tokugawa Ieyasu genuinely feared. Takeda Shingen was the finest general of the Sengoku period — and history turned on his sudden death.",
      content: `Among all the warlords of the Sengoku period, one name made even Oda Nobunaga cautious: Takeda Shingen, the Tiger of Kai.

Shingen ruled the mountainous Kai Province from 1541, when he deposed his own father in a coup — a ruthless act that established him immediately as a man who would not be bound by sentiment. He then spent three decades building the finest military force in Japan.

The Takeda cavalry was his signature weapon: armored horsemen trained to strike with devastating speed. But Shingen's real genius was organizational. He developed the Koshu Hatto, a legal code that governed his domain efficiently and kept his retainers loyal. He invested in irrigation and flood control, making Kai prosperous enough to fund his armies. He was a poet, a Buddhist, and a brilliant administrator as well as a general.

His rivalry with Uesugi Kenshin — the Dragon of Echigo — produced five battles at Kawanakajima, none decisive, both men too evenly matched to destroy the other. These battles became legendary for their tactical sophistication.

In 1572, Shingen finally moved against Nobunaga and Ieyasu. At the Battle of Mikatagahara, he crushed Ieyasu's forces so completely that Ieyasu fled the field. Nobunaga, watching from the east, began preparing for the worst. If Shingen reached Kyoto, the unification project would be over.

Then Shingen died. The circumstances remain mysterious — probably illness, possibly a sniper's bullet during a siege. He was 53. He had asked that his death be kept secret for three years.

Without Shingen, the Takeda momentum collapsed. Nobunaga survived. Japan's history continued on its course — because one man died before his time.`,
      era: "Sengoku Period",
      figure: "Takeda Shingen",
      isPremium: true,
      order: 11,
      timelineEvent: {
        create: {
          year: 1572,
          title: "Battle of Mikatagahara",
          description:
            "Takeda Shingen crushes Tokugawa Ieyasu's forces, the closest any rival came to derailing the eventual Tokugawa unification.",
        },
      },
      vocabulary: {
        create: [
          {
            term: "Koshu Hatto",
            reading: "甲州法度",
            definition:
              "The legal code of the Takeda domain, one of the most sophisticated administrative systems of the Sengoku period.",
          },
          {
            term: "Kawanakajima",
            reading: "川中島",
            definition:
              "A series of five battles (1553–1564) between Takeda Shingen and Uesugi Kenshin, fought on a plain between their two domains. None proved decisive.",
            culturalNote:
              "The fourth battle of Kawanakajima, in 1561, is considered the bloodiest and most dramatic of the five. According to legend, Kenshin broke through to Shingen's command post and attacked him personally.",
          },
          {
            term: "Domain",
            definition:
              "The territory under a daimyo's control. Managing a domain — its taxes, laws, and defenses — was as important as battlefield skill.",
          },
        ],
      },
      questions: {
        create: [
          {
            question: "What made Takeda Shingen more than just a battlefield commander?",
            options: JSON.stringify([
              "He had the emperor's direct support",
              "He was also a skilled administrator who built a prosperous, well-governed domain",
              "He commanded the largest army in Japan",
              "He had trained under Chinese military advisors",
            ]),
            answer: 1,
          },
          {
            question: "Why was Shingen's death so significant to Japanese history?",
            options: JSON.stringify([
              "It ended the Sengoku period immediately",
              "His momentum against Nobunaga and Ieyasu collapsed, allowing their unification to continue",
              "It caused the Battle of Sekigahara",
              "It led directly to the arrival of foreign traders",
            ]),
            answer: 1,
          },
        ],
      },
      tags: {
        create: [
          { name: "Takeda Shingen" },
          { name: "Strategy" },
          { name: "Battle" },
          { name: "Rivalry" },
        ],
      },
    },
  });

  // ── Story 12: The Art of Seppuku (PREMIUM) ──────────────────────────
  await prisma.story.upsert({
    where: { slug: "the-art-of-seppuku" },
    update: {},
    create: {
      slug: "the-art-of-seppuku",
      title: "The Art of Seppuku",
      imageUrl:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Seppuku_2.jpg?width=640",
      summary:
        "To Western eyes, ritual suicide seems incomprehensible. Understanding seppuku — why samurai chose it, how it worked, and what it meant — unlocks something essential about samurai culture.",
      content: `Of all samurai practices, seppuku is perhaps the most misunderstood in the West. It appears in films as a dramatic spectacle. In reality, it was a carefully ritualized act with deep cultural logic.

Seppuku — sometimes called hara-kiri in Western accounts — literally means "cutting the abdomen." In samurai belief, the abdomen was the seat of the spirit and courage. To cut it open was to expose one's soul: a final act of honesty and courage that could not be faked.

The ritual developed during the Heian period (794–1185) and became formalized during the Sengoku era. A samurai sentenced to death by his lord, or facing capture on the battlefield, or found guilty of dishonoring his position could request permission to perform seppuku rather than be executed or suffer disgrace.

The ceremony followed specific protocols. The samurai would write a death poem — a final creative act expressing his thoughts on life and death. He would dress in white robes, sit in a formal position, and perform the cut himself. A trusted companion, called a kaishakunin, would often stand beside him to deliver a mercy stroke with a sword to end suffering quickly.

Seppuku was not only a punishment or a battlefield choice. It was sometimes used as a form of protest — a final statement that one's lord or society had acted wrongly. The act of dying in this way implicitly accused those who remained living.

The practice was formally banned by the Meiji government in 1873. But its cultural echo persists. Japan's concept of taking personal responsibility for failure — the instinct to resign, to apologize publicly, to accept consequences — still carries traces of this centuries-old code.`,
      era: "Sengoku–Edo Period",
      figure: null,
      isPremium: true,
      order: 12,
      vocabulary: {
        create: [
          {
            term: "Kaishakunin",
            reading: "介錯人",
            definition:
              "A designated assistant who stands beside a samurai performing seppuku, ready to deliver a swift sword stroke to end suffering. The role required exceptional swordsmanship and was considered an honor.",
          },
          {
            term: "Death poem",
            reading: "辞世の句 (Jisei no ku)",
            definition:
              "A poem written by a samurai (or any person) in the moment before death. A tradition in Japanese culture reflecting on the meaning of life.",
            culturalNote:
              "Death poems were a serious literary form. Some of the most celebrated are remarkably calm and even beautiful.",
          },
          {
            term: "Jisei",
            reading: "辞世",
            definition:
              "A farewell to the world. The concept underlying the death poem tradition — a final, composed statement before dying.",
          },
        ],
      },
      questions: {
        create: [
          {
            question: "In samurai belief, why was cutting the abdomen specifically significant?",
            options: JSON.stringify([
              "It was the fastest way to die",
              "The abdomen was believed to be the seat of the spirit and courage",
              "It was required by Shinto religious law",
              "It demonstrated physical strength",
            ]),
            answer: 1,
          },
          {
            question: "What was the role of the kaishakunin?",
            options: JSON.stringify([
              "To witness and record the event officially",
              "To perform seppuku alongside the samurai",
              "To deliver a mercy stroke to end the samurai's suffering",
              "To read the death poem aloud",
            ]),
            answer: 2,
          },
        ],
      },
      tags: {
        create: [
          { name: "Bushido" },
          { name: "Culture" },
          { name: "Ritual" },
          { name: "Philosophy" },
        ],
      },
    },
  });

  // ── Story 13: Yasuke — The African Samurai (PREMIUM) ────────────────
  await prisma.story.upsert({
    where: { slug: "yasuke-the-african-samurai" },
    update: {},
    create: {
      slug: "yasuke-the-african-samurai",
      title: "Yasuke: The African Samurai",
      imageUrl:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Alessandro_Valignano.jpg?width=640",
      summary:
        "In 1579, an African man arrived in Japan and captivated the most powerful warlord in the country. Yasuke became the first non-Japanese person known to have received the rank of samurai.",
      content: `In 1579, an Italian Jesuit missionary named Alessandro Valignano arrived in Japan accompanied by a servant whose appearance caused a sensation wherever he went. He was African — tall, powerfully built, and unlike anyone most Japanese had ever seen.

When the entourage reached Kyoto, crowds gathered so densely that people were crushed trying to get a glimpse of him. Oda Nobunaga, who ruled the city, demanded to see him personally.

Nobunaga assumed the dark skin was ink or paint. He reportedly ordered the man's chest scrubbed to prove it — and was astonished to find it was not. This was no trick. The man was simply extraordinary.

His original name is not recorded. In Japan, he became known as Yasuke — a Japanese rendering of a name the sources do not agree on. His exact origins are debated: Mozambique, Ethiopia, and South Sudan have all been proposed by historians.

What happened next was unprecedented. Nobunaga took Yasuke into his personal service. He gave him his own residence, a stipend, and — according to contemporary accounts — a ceremonial sword, which in Japanese culture constituted recognition as a samurai. Yasuke was the first known person of non-Japanese origin to receive this status.

He lived in Nobunaga's household, dined with him, and was by his side during the final days of Nobunaga's rule. On the night of the Honnoji Incident in 1582, Yasuke reportedly fought to protect his lord. After Nobunaga's death, he was captured by Akechi Mitsuhide's forces.

Mitsuhide reportedly dismissed Yasuke as "not Japanese" and not worth killing — a strange mercy. He was handed back to the Jesuit missionaries. After that, Yasuke disappears from the historical record entirely.

His story was largely forgotten for centuries, until modern historians and popular culture rediscovered it. Today, Yasuke is the subject of books, anime, and films — a figure whose real life was stranger and more compelling than any fiction.`,
      era: "Sengoku Period",
      figure: "Yasuke",
      isPremium: true,
      order: 13,
      vocabulary: {
        create: [
          {
            term: "Jesuit",
            definition:
              "A member of the Society of Jesus, a Catholic religious order founded in 1540. Jesuit missionaries were among the first Europeans to establish a significant presence in Japan.",
            culturalNote:
              "The Jesuits brought firearms, clocks, and other European technology to Japan, and their influence on Sengoku-era politics was significant.",
          },
          {
            term: "Stipend",
            definition:
              "A fixed regular payment, typically for services. Nobunaga's grant of a stipend to Yasuke was a formal mark of samurai status.",
          },
          {
            term: "Ceremonial sword",
            definition:
              "In samurai culture, the gift of a sword from a lord to a retainer was a formal act of recognition and status, not merely a practical gift.",
          },
        ],
      },
      questions: {
        create: [
          {
            question: "Why is Yasuke historically significant?",
            options: JSON.stringify([
              "He was the first European to visit Japan",
              "He is the first known non-Japanese person to receive samurai status",
              "He introduced firearms to Japan",
              "He defeated Akechi Mitsuhide in battle",
            ]),
            answer: 1,
          },
          {
            question: "What happened to Yasuke after the Honnoji Incident?",
            options: JSON.stringify([
              "He fled Japan and returned to Africa",
              "He became a senior retainer of Tokugawa Ieyasu",
              "He was captured, then handed to missionaries, and disappears from the historical record",
              "He performed seppuku alongside Nobunaga",
            ]),
            answer: 2,
          },
        ],
      },
      tags: {
        create: [
          { name: "Yasuke" },
          { name: "Oda Nobunaga" },
          { name: "Diversity" },
          { name: "Sengoku Period" },
        ],
      },
    },
  });

  // ── Story 14: The Forty-Seven Ronin (PREMIUM) ────────────────────────
  await prisma.story.upsert({
    where: { slug: "the-forty-seven-ronin" },
    update: {},
    create: {
      slug: "the-forty-seven-ronin",
      title: "The Forty-Seven Ronin",
      imageUrl:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Ronin_Buried_at_Sengakuji.jpg?width=640",
      summary:
        "In 1703, forty-seven masterless samurai avenged their lord's death after two years of secret planning. Their story became the defining legend of samurai loyalty — and ended with all of them choosing to die.",
      content: `On the night of January 30, 1703, forty-seven men stormed the Edo mansion of a powerful official named Kira Yoshinaka. They had waited almost two years for this moment.

Their story had begun in 1701, when their lord, Asano Naganori, drew his sword in Edo Castle and wounded Kira — who had apparently provoked and humiliated him over a period of months. Drawing a weapon in the Shogun's palace was a capital offense. Asano was ordered to perform seppuku that same day. His domain was seized. His retainers became ronin — masterless samurai, cast adrift.

Under the Tokugawa system, the vendetta was technically illegal. Ronin were expected to accept their fate and disband. Most did. Forty-seven chose differently.

Their leader, Oishi Kuranosuke, developed a plan over nearly two years. To avoid suspicion, he publicly fell apart: divorcing his wife, frequenting brothels, behaving as a drunk and a coward. Kira's spies reported that the ronin posed no threat. Kira relaxed.

On a snowy December night in 1702 (by the old calendar — January 1703 by the modern), the forty-seven struck. They attacked Kira's compound with precise coordination, took the head of the man who had destroyed their lord, and carried it to Asano's grave at Sengakuji Temple.

Then they turned themselves in.

The Shogunate faced a dilemma. The forty-seven had broken the law. But they had also demonstrated the highest samurai virtues: loyalty, patience, and sacrifice. Executing them as criminals seemed wrong. Pardoning them as heroes seemed dangerous.

The Shogunate ordered them to perform seppuku. All forty-seven complied. They were buried together at Sengakuji, beside the lord they had avenged.

Their graves are still visited today, more than 300 years later.`,
      era: "Edo Period",
      figure: null,
      isPremium: true,
      order: 14,
      timelineEvent: {
        create: {
          year: 1703,
          title: "The Forty-Seven Ronin",
          description:
            "Forty-seven masterless samurai avenge their lord by killing Kira Yoshinaka, then surrender and perform seppuku — becoming Japan's defining legend of loyalty.",
        },
      },
      vocabulary: {
        create: [
          {
            term: "Ronin",
            reading: "浪人",
            definition:
              "A samurai without a lord — literally 'wave man,' drifting without direction. Becoming a ronin was considered a form of disgrace in samurai society.",
            culturalNote:
              "Today the word ronin is also used for students who fail university entrance exams and must wait a year to try again.",
          },
          {
            term: "Vendetta",
            reading: "仇討ち (Katakiuchi)",
            definition:
              "The act of taking revenge for a lord or family member's death. Officially regulated and sometimes permitted under the Tokugawa system.",
          },
          {
            term: "Oishi Kuranosuke",
            reading: "大石内蔵助",
            definition:
              "The leader of the forty-seven ronin. His two-year act of public deception — pretending to be a drunk and a coward — to lower Kira's guard is considered one of history's greatest feats of patience and strategy.",
          },
        ],
      },
      questions: {
        create: [
          {
            question: "Why did Oishi Kuranosuke pretend to be a drunk and a coward?",
            options: JSON.stringify([
              "He had genuinely given up on revenge",
              "To avoid suspicion and lull Kira's guards into complacency",
              "He was ordered to by the Shogunate",
              "To protect the other ronin from being arrested",
            ]),
            answer: 1,
          },
          {
            question: "What dilemma did the Shogunate face after the forty-seven surrendered?",
            options: JSON.stringify([
              "Whether to reward them with a new domain",
              "Whether to pardon criminals who had acted with samurai virtue, or punish heroes who had broken the law",
              "Whether to promote them to the emperor's guard",
              "Whether to negotiate with Kira's family for compensation",
            ]),
            answer: 1,
          },
        ],
      },
      tags: {
        create: [
          { name: "Ronin" },
          { name: "Loyalty" },
          { name: "Edo Period" },
          { name: "Bushido" },
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

  // ── Decision Points for Stories 7–14 ────────────────────────────────

  await upsertDecision("the-betrayal-at-honnoji", {
    afterParagraph: 1,
    question: "You are Akechi Mitsuhide. Nobunaga is alone at Honnoji with minimal guards — a once-in-a-lifetime opportunity. What do you do?",
    optionA: "Strike now — surround the temple and attack",
    optionB: "Report the security breach to other generals",
    optionC: "Wait for a more politically favorable moment",
    correctOption: 0,
    historicalNote: "Mitsuhide struck immediately. He knew the window was narrow — Nobunaga's other generals were dispersed on campaigns. Within hours, the man closest to unifying Japan was dead.",
    wrongNote: "Mitsuhide calculated that hesitation would cost him everything. Whether his reasons were personal, political, or both, he chose the moment of maximum surprise — and acted.",
  });

  await upsertDecision("hattori-hanzo-and-the-ninja-of-iga", {
    afterParagraph: 2,
    question: "Tokugawa Ieyasu is stranded in hostile territory after Nobunaga's death. No army, no safe road, enemies potentially closing in. You are Hattori Hanzo. What is your route?",
    optionA: "Travel the main road — speed matters most",
    optionB: "Take the Iga mountain route using your network of shinobi contacts",
    optionC: "Hide Ieyasu in a temple and send for reinforcements",
    correctOption: 1,
    historicalNote: "Hanzo led Ieyasu through the Iga mountains, using his network of shinobi contacts to move safely through territory no conventional army could navigate quickly. It was the perfect application of shinobi intelligence.",
    wrongNote: "The main roads were monitored. Hanzo's advantage was his network — the Iga mountains were his territory, and the shinobi who lived there were his contacts. The safest route was the one only he could navigate.",
  });

  await upsertDecision("ii-naotora-the-female-lord", {
    afterParagraph: 2,
    question: "You are Ii Naotora. A powerful neighboring lord demands you submit and pay tribute — or face military pressure. Your forces cannot match his. What do you do?",
    optionA: "Refuse — show strength or lose all respect",
    optionB: "Pay tribute now, build alliances quietly, and wait for a better position",
    optionC: "Offer your domain to another powerful lord for protection",
    correctOption: 1,
    historicalNote: "Naotora used strategic patience. She paid tribute when necessary, cultivated alliances, and preserved the Ii clan's independence through diplomacy rather than futile resistance. It worked — the clan survived.",
    wrongNote: "A small domain refusing a larger one without allies usually ends in destruction. Naotora understood that survival required patience, not pride — and that the time to act boldly would come later.",
  });

  await upsertDecision("tokugawa-ieyasu-the-patience-of-the-crane", {
    afterParagraph: 3,
    question: "After Nobunaga's death, Hideyoshi is moving fast to seize power. You are Ieyasu — more powerful in some ways, but a direct clash would be costly. What do you do?",
    optionA: "Challenge Hideyoshi now while the political situation is still fluid",
    optionB: "Accept Hideyoshi's leadership, accept a territorial demotion, and wait",
    optionC: "Form an alliance with Hideyoshi's other rivals",
    correctOption: 1,
    historicalNote: "Ieyasu accepted demotion from his home province to the Kanto region — seemingly a loss. But the Kanto was economically powerful, and Ieyasu spent years building it into the base from which he would eventually dominate Japan.",
    wrongNote: "Ieyasu had seen what happened to men who challenged powerful rivals too soon. His genius was understanding that a strategic retreat today could mean total victory tomorrow. He waited seventeen years.",
  });

  await upsertDecision("takeda-shingen-the-tiger-of-kai", {
    afterParagraph: 4,
    question: "You are Takeda Shingen. You have just crushed Ieyasu at Mikatagahara. Nobunaga is scrambling to respond. You can march on Kyoto now — or consolidate first. What do you do?",
    optionA: "March on Kyoto immediately — momentum is everything",
    optionB: "Consolidate your gains, rest your army, and advance methodically",
    optionC: "Negotiate with Nobunaga from a position of strength",
    correctOption: 0,
    historicalNote: "Shingen did begin advancing — but fell ill and died before reaching Kyoto. Historians still debate whether immediate advance or methodical consolidation was the right choice. His death made the question moot.",
    wrongNote: "In this case, speed mattered most — Shingen's illness was already progressing, and delay proved fatal to his campaign. But the historical reality is that no one knew he was dying, making this one of history's great 'what ifs.'",
  });

  await upsertDecision("the-art-of-seppuku", {
    afterParagraph: 3,
    question: "A samurai's lord has been unjustly ordered to perform seppuku by a corrupt official. The samurai has evidence of the injustice. What does Bushido demand?",
    optionA: "Accept the lord's death — loyalty means accepting all outcomes",
    optionB: "Submit the evidence to higher authorities through official channels",
    optionC: "Avenge the lord — even if it means death for the samurai",
    correctOption: 2,
    historicalNote: "This is precisely the dilemma the forty-seven ronin faced. Bushido held that loyalty to a lord could supersede obedience to the law. Their act of vengeance — and their subsequent seppuku — became the defining story of samurai values.",
    wrongNote: "Passive acceptance was one interpretation of loyalty. But Bushido also demanded active defense of a lord's honor. The forty-seven ronin chose the more demanding interpretation — and became legends for it.",
  });

  await upsertDecision("yasuke-the-african-samurai", {
    afterParagraph: 3,
    question: "You are Oda Nobunaga. An African man of extraordinary presence and ability has arrived at your court. Your advisors are uncertain how to classify him. What do you do?",
    optionA: "Treat him as a curiosity — a gift for entertainment",
    optionB: "Take him into your personal service and recognize his ability formally",
    optionC: "Return him to the missionaries — too much political complication",
    correctOption: 1,
    historicalNote: "Nobunaga's decision to grant Yasuke samurai status was radically pragmatic. He was famously indifferent to birth and convention — he had elevated Hideyoshi from peasant origins. Yasuke's abilities mattered more to him than his origins.",
    wrongNote: "Nobunaga was not sentimental about tradition. He had broken every other rule of his era when it suited him. Recognizing Yasuke's abilities was entirely consistent with his character — and it produced a samurai whose story is remembered 400 years later.",
  });

  await upsertDecision("the-forty-seven-ronin", {
    afterParagraph: 2,
    question: "You are Oishi Kuranosuke. Two years have passed since your lord's death. Kira's spies are watching you. To lower their guard, you must destroy your own reputation. Do you do it?",
    optionA: "No — a samurai's honor cannot be faked away, even for strategy",
    optionB: "Yes — publicly become a drunk and a coward so Kira stops watching",
    optionC: "Find another way — bribe Kira's guards instead",
    correctOption: 1,
    historicalNote: "Oishi chose total commitment to the deception. He divorced his wife, abandoned his public dignity, and spent two years being publicly contemptible. It worked. Kira relaxed. The forty-seven struck.",
    wrongNote: "Oishi understood something profound: temporary dishonor in service of true loyalty was itself a samurai act. The real cowardice would have been protecting his reputation at the cost of his lord's honor.",
  });

  console.log("Seed complete. 14 stories upserted.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
