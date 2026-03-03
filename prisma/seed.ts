import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

type SeedScene = {
  slug: string;
  title: string;
  order: number;
  body: string;
  choiceA: string;
  choiceB: string;
  historyNotes: Prisma.InputJsonValue;
  glossary: Prisma.InputJsonValue;
  quizQuestions: Array<{
    prompt: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctOption: string;
    explanation: string;
  }>;
};

const chapters: Array<{
  slug: string;
  title: string;
  order: number;
  isPremium: boolean;
  scenes: SeedScene[];
}> = [
  {
    slug: "prologue",
    title: "Prologue",
    order: 1,
    isPremium: false,
    scenes: [
      {
        slug: "storm-over-edo-bay",
        title: "Storm over Edo Bay",
        order: 1,
        body: `Rain arrived before sunset, turning the roads outside Edo into braided rivers of mud and hoofprints. Ichiro pulled his straw cloak tighter and guided his borrowed horse along the causeway, trying not to look toward the dark water where anchored cargo ships creaked like old men in prayer. The smell of salt, wet hemp rope, and fish oil drifted inland, mixing with woodsmoke from roadside tea stalls. He had been told to keep his eyes lowered, but he could not resist stealing glances at the city walls and the towers beyond them, where the shogun's banners snapped even in the heavy weather.

Inside his sleeve, he carried a small lacquered tube sealed with wax. His teacher in Kai Province had pressed it into his hand that morning and said only, "Deliver this to Lady Aoi at Ueno Temple. Do not open it. Do not speak of it." That secrecy made Ichiro curious, yet fear held him obedient. He was sixteen, old enough to swing a practice sword with confidence, but not old enough to pretend he understood the currents that moved the capital. Travelers on the road whispered of tax protests, quarrels between regional lords, and strange foreign ships on distant coasts. None of it felt real until tonight, when armed retainers galloped past him with lanterns held high, shouting for the gates to remain open.

By the time he reached the outer checkpoint, thunder rolled across the bay and the line of travelers had frozen. Officials inspected travel papers under an awning, their ink brushes scratching over ledgers while rain drummed like fingers on a drumskin. A merchant in front of Ichiro complained that rice prices had doubled in two months. A nun behind him murmured that floods had ruined villages upriver. Ichiro said nothing. When his turn came, he handed over his paper pass and watched the guard's expression shift at the sight of his teacher's seal. The guard waved him through quickly, then leaned close and whispered, "If anyone asks, you entered at dawn."

He crossed into Edo as temple bells sounded the hour. Streets twisted between shopfronts lit by paper lanterns; silhouettes moved behind screens; somewhere a shamisen player practiced a mournful melody that seemed to match the rain. At a narrow bridge he found two children huddled under a cart, protecting a basket of eels with their own bodies. He gave them half his travel rice and kept walking, feeling guilty that compassion could be so small against the city's hunger.

Near Ueno, he paused beneath a pine and finally looked at the tube in his hand. The wax seal bore the crest of a house he recognized from history lessons: the Tokugawa branch in Mito, famous for scholars who argued that loyalty and reform should stand side by side. Historians debate how united that house truly was in these final years, but even a village student knew its seal could open doors or start feuds. Lightning flashed, and Ichiro shoved the tube back into his sleeve. Tonight, his choices were simple: obey and survive, or ask questions and vanish.

At the temple gate, a woman in plain indigo robes waited as if she had counted his footsteps from miles away. "You are late," she said.

Ichiro bowed. "The storm slowed everyone."

"Storms reveal who keeps moving," she replied, extending her hand for the message.`,
        choiceA: "Give Lady Aoi the tube immediately and follow her instructions.",
        choiceB: "Ask Lady Aoi to explain the mission before surrendering the tube.",
        historyNotes: [
          "Edo (modern Tokyo) was the political center of the Tokugawa shogunate during the late Edo period.",
          "Domain schools in provinces like Kai and Mito trained samurai youth in both martial and scholarly traditions.",
          "Rice price fluctuations and flood damage frequently triggered unrest in the 19th century.",
          "Travel checkpoints (sekisho) controlled movement and monitored suspicious traffic entering major cities."
        ],
        glossary: [
          { term: "Shogun", definition: "Military ruler who governed Japan under the Tokugawa system." },
          { term: "Edo", definition: "Historical name of Tokyo and the seat of shogunal government." },
          { term: "Retainer", definition: "A samurai or official serving a lord or high-ranking household." },
          { term: "Sekisho", definition: "Checkpoint station where travel permits were inspected." },
          { term: "Mito", definition: "A Tokugawa branch domain known for scholarship and political thought." },
          { term: "Shamisen", definition: "Three-stringed instrument commonly heard in Edo entertainment districts." }
        ],
        quizQuestions: [
          {
            prompt: "Why does Ichiro attract attention at the checkpoint?",
            optionA: "He refuses to show travel papers",
            optionB: "His pass carries his teacher's notable seal",
            optionC: "He arrives with armed guards",
            optionD: "He openly mentions the message",
            correctOption: "B",
            explanation: "The guard reacts to the seal on Ichiro's travel documents, suggesting political significance."
          },
          {
            prompt: "What atmosphere does the storm create in the scene?",
            optionA: "Festive and welcoming",
            optionB: "Calm and ceremonial",
            optionC: "Tense and uncertain",
            optionD: "Joyful and comic",
            correctOption: "C",
            explanation: "The rain, rumors, guards, and urgency all reinforce instability and fear."
          },
          {
            prompt: "Which statement best matches the text's historical framing?",
            optionA: "Political factions in late Edo were always unified",
            optionB: "Only peasants were affected by price shocks",
            optionC: "Checkpoint control had no role in governance",
            optionD: "Historical interpretation of faction unity can be disputed",
            correctOption: "D",
            explanation: "The passage explicitly notes that historians debate the cohesion of the Mito branch."
          }
        ]
      },
      {
        slug: "letters-under-lantern-light",
        title: "Letters under Lantern Light",
        order: 2,
        body: `Lady Aoi led Ichiro through corridors lined with damp sandals and sleeping pilgrims until they reached a side hall that smelled of ink, cedar, and old paper. Four candles burned around a low table where maps of roads and coastal routes were weighted with smooth river stones. A young monk heated water in an iron kettle while two women copied documents in brisk, disciplined silence. No one looked surprised to see Ichiro. That frightened him more than the storm.

Aoi broke the wax seal with a thumbnail and unrolled a strip of silk thin enough for light to pass through. Her gaze hardened as she read. "The inspection order has expanded," she said. "Every messenger from inland schools is now flagged." She passed the silk to the monk, who nodded once and fed it to the brazier. Flame curled the writing into black petals. Ichiro blurted, "Was that all?"

"All you needed to carry," Aoi answered. "Not all we needed to know."

She asked him to sit and handed him tea sweetened with barley syrup, a luxury he had tasted only during New Year festivals. As warmth returned to his fingers, she explained that scholars, merchants, and minor samurai were forming networks to exchange practical information: crop reports, shipping delays, corruption cases, and rumors of foreign pressure along the coast. "Power dislikes sunlight," she said. "So we share lanterns." Ichiro listened, trying to keep up. He had studied moral philosophy, military chronicles, and poetry, yet this felt like stepping into a living text where every footnote could become a weapon.

Near midnight, a messenger arrived soaked to the bone, carrying a wooden box wrapped in indigo cloth. Inside lay letters from Osaka guild leaders complaining about arbitrary toll changes. Another letter described an official in Shinano who had diverted emergency rice stores to reward political allies. The monk cursed softly. One of the scribes pressed her lips together and resumed copying at double speed.

Aoi assigned Ichiro his next task: travel at dawn to a warehouse district near Nihonbashi, meet a bookseller named Genjiro, and exchange passwords before receiving a ledger. "If he asks what blooms under winter frost, answer: plum before pine," she said. "If you forget, leave immediately."

Ichiro slept for one hour on a woven mat and dreamed of ink flowing like floodwater. At first light he entered streets scrubbed clean by rain. Vendors lifted shutters, apprentices swept gutters, and fishmongers called prices loud enough to challenge the temple bells. Edo's appetite had returned, but Ichiro now noticed how every transaction relied on trust: correct weights, honest records, fair tolls, safe roads. Remove trust, and the whole city would tremble.

At Nihonbashi, he found Genjiro pretending to rearrange travel journals. The bookseller's hands were stained with sumi black as lacquer. "What blooms under winter frost?" Genjiro asked without raising his head.

"Plum before pine," Ichiro replied.

Genjiro slid a ledger wrapped in plain cloth across the counter. "Take this to Aoi. And tell her the harbor clerk changed again. Third time this season."

Historians debate whether merchant intelligence circles were coordinated or simply overlapping friendships, yet scenes like this show how information moved through ordinary spaces: temples, shops, kitchens, ferries. Ichiro tucked the ledger into his basket under radishes and turned back toward Ueno, suddenly aware that he had become part of the lantern network he barely understood.`,
        choiceA: "Deliver the ledger directly to Lady Aoi without delay.",
        choiceB: "Open the ledger first to understand the risk before delivering it.",
        historyNotes: [
          "Temples in Edo often functioned as social hubs beyond purely religious activity.",
          "Nihonbashi was a major commercial center connected to overland and maritime trade routes.",
          "Merchant guild records could influence policy debates by documenting prices and taxes.",
          "Information exchange in late Edo frequently relied on personal trust networks."
        ],
        glossary: [
          { term: "Nihonbashi", definition: "Commercial bridge district in Edo and traditional road-distance starting point." },
          { term: "Sumi", definition: "Traditional black ink used for writing and painting." },
          { term: "Ledger", definition: "Record book for transactions, taxes, inventories, or debts." },
          { term: "Guild", definition: "Association of merchants or artisans regulating trade practices." },
          { term: "Brazier", definition: "Portable container used for burning charcoal or heating materials." },
          { term: "Password exchange", definition: "Verification method used in clandestine communications." }
        ],
        quizQuestions: [
          {
            prompt: "What is the practical purpose of the lantern network?",
            optionA: "To spread poetry competitions",
            optionB: "To exchange useful political and economic information",
            optionC: "To recruit foreign merchants",
            optionD: "To replace temple rituals",
            correctOption: "B",
            explanation: "Aoi describes sharing reports and records that reveal governance problems."
          },
          {
            prompt: "Why does Genjiro use a password prompt?",
            optionA: "To entertain customers",
            optionB: "To test literary knowledge",
            optionC: "To confirm secure identity before handing over the ledger",
            optionD: "To delay business until noon",
            correctOption: "C",
            explanation: "The password confirms that Ichiro is a trusted messenger in a risky exchange."
          },
          {
            prompt: "What theme is emphasized when Ichiro observes the market at dawn?",
            optionA: "Trade depends on reliability and trust",
            optionB: "Cities function without records",
            optionC: "Samurai avoid merchant districts",
            optionD: "Food prices never change",
            correctOption: "A",
            explanation: "He notices that fair weights, records, and safe transport are foundational to urban stability."
          }
        ]
      },
      {
        slug: "the-ledger-and-the-blade",
        title: "The Ledger and the Blade",
        order: 3,
        body: `By afternoon the sky had cleared, but unease clung to the city like humidity before another storm. Ichiro crossed Kanda with the wrapped ledger hidden in a basket of vegetables, rehearsing Aoi's warnings in his head. Twice he noticed the same ash-gray cloak at different intersections. The wearer never came close, never spoke, only paused by signboards or tea stalls as if waiting for someone else. Ichiro altered his route, cutting through alleys behind carpenters' yards where the air smelled of cedar shavings and lacquer.

Near a shrine gate, three boys practiced with bamboo swords, shouting each strike count. Their teacher corrected their footing with patient taps. The scene should have comforted Ichiro, but instead it sharpened his fear: discipline could train protectors or enforcers, depending on whose orders were obeyed. He remembered his own lessons in Kai, where honor was described as a straight road. Edo taught him that roads were crowded, curved, and watched.

When he reached Ueno's lower steps, he found the temple entrance blocked by officials conducting a surprise inspection. Scroll cases, offering chests, and food baskets were being opened one by one. Aoi stood at a distance speaking calmly with a magistrate's aide, yet her left hand remained hidden in her sleeve, a sign she used when danger was immediate. Ichiro pretended to be a delivery boy and joined a line of porters waiting for clearance.

The ash-gray cloak appeared again at the edge of the square. This time Ichiro saw the crest stitched near the hem: not Tokugawa, not a merchant house, but a lesser domain symbol he recognized from a map in Aoi's hall. Someone from outside Edo had stationed eyes here.

As his turn approached, Ichiro crouched to retie his sandal and slipped the ledger from his basket into the hollow base of a stone lantern cracked by frost. Then he presented the basket to inspectors, who prodded radishes and laughed at the poor quality of his burdock root. One official asked where he came from. "Kofu road," Ichiro answered. "Kitchen delivery." The official waved him away.

He circled the temple, recovered the ledger, and entered through a side door used by wood suppliers. Inside, Aoi received the bundle and exhaled for the first time in minutes. "You were followed," she said.

"I think by a provincial observer."

"Good. That means they are worried." She opened the ledger to marked pages listing sudden tariff revisions, missing storehouse inventories, and names of clerks reassigned after filing complaints. At the bottom of one page was a signature from an official Ichiro had seen praised in school texts as incorruptible. His stomach tightened.

That evening Aoi convened a small council: a physician, a rice broker, a retired samurai instructor, and the monk from the map room. No one drew a sword, yet the meeting felt like battle planning. They debated whether to circulate copies immediately or verify every figure first. The physician argued speed would protect villagers from further extortion. The broker warned that one false number could discredit the entire network. Historians debate which strategy such reform circles favored, but the argument itself reveals a central problem of political change: truth must move fast, yet truth must also endure attack.

Aoi turned to Ichiro. "You carried this through inspection and surveillance. Will you carry one more message?"

He looked at the ledger, then at the calluses on his own hands. "Yes," he said, surprising himself with how steady his voice sounded.

"Then choose," Aoi replied. "Run to the printers tonight, or ride to the river posts before dawn. Both paths are dangerous. Both matter."`,
        choiceA: "Help print and distribute verified excerpts in Edo tonight.",
        choiceB: "Ride to the river posts and warn inland contacts before dawn.",
        historyNotes: [
          "Temple and district inspections were tools for policing documents and movement in urban centers.",
          "Late Edo governance involved overlapping authority among shogunal, domainal, and local actors.",
          "Circulation of fiscal records could expose corruption but also provoke political retaliation.",
          "Debates over speed versus verification remain central to information politics in many eras."
        ],
        glossary: [
          { term: "Magistrate", definition: "Official responsible for urban administration, policing, and legal matters." },
          { term: "Tariff", definition: "Duty or fee charged on goods moving through checkpoints or ports." },
          { term: "Storehouse inventory", definition: "Recorded quantity of rice or goods held for taxation and relief." },
          { term: "Domain", definition: "Feudal territory governed by a daimyo under the Tokugawa order." },
          { term: "Surveillance", definition: "Systematic observation of people, routes, and communications." },
          { term: "Verification", definition: "Process of checking evidence before public release." }
        ],
        quizQuestions: [
          {
            prompt: "How does Ichiro avoid losing the ledger during inspection?",
            optionA: "He destroys it in the brazier",
            optionB: "He bribes an official",
            optionC: "He hides it in a cracked stone lantern",
            optionD: "He gives it to a porter",
            correctOption: "C",
            explanation: "He conceals the ledger temporarily in the hollow base of a damaged lantern."
          },
          {
            prompt: "What conflict dominates the council discussion?",
            optionA: "Whether to leave Edo permanently",
            optionB: "Whether to spread data quickly or verify first",
            optionC: "Whether to recruit foreign soldiers",
            optionD: "Whether to abandon written records",
            correctOption: "B",
            explanation: "The council balances urgent disclosure against the risk of errors undermining credibility."
          },
          {
            prompt: "What does the recurring ash-gray cloak symbolize in the narrative?",
            optionA: "Ritual mourning",
            optionB: "Comic relief",
            optionC: "Growing external scrutiny and political danger",
            optionD: "A weather forecast",
            correctOption: "C",
            explanation: "The observer's repeated presence shows the network is being monitored by rival interests."
          }
        ]
      }
    ]
  },
  {
    slug: "chapter-1",
    title: "Chapter 1",
    order: 2,
    isPremium: true,
    scenes: [
      {
        slug: "riverposts-at-dawn",
        title: "Riverposts at Dawn",
        order: 1,
        body: `Ichiro chose the river road, leaving Edo before first light with two relay letters sewn into the lining of his cloak. Mist floated above the Sumida like torn silk, hiding ferries until their oars struck water with soft, deliberate knocks. He rode north beside grain barges moored at temporary docks, where laborers moved in synchronized lines despite the cold. Every sack mattered. A delayed convoy could raise prices in three provinces.

His first destination was a relay post near Senju run by an ex-archer named Tomobe, who now managed couriers with military precision. Tomobe checked Ichiro's token, served him millet porridge, and pointed to a map marked in red circles. "Inspections shifted east overnight," he said. "Someone expects messages on the old route." Ichiro passed him the first letter, which contained names of trusted clerks and instructions for verifying warehouse accounts. Tomobe burned the envelope after memorizing key details, then issued Ichiro a new horse and a warning: "At the next post, speak less than you think."

The road narrowed through villages still rebuilding from spring floods. Children carried bundles of reeds for roof repairs; elders patched embankments with woven baskets filled with stones. Ichiro stopped at a roadside shrine where travelers tied strips of paper prayers to a pine branch. He added none. His prayer was speed.

At Koshigaya he met the second relay contact, a widowed innkeeper named Sayo who kept meticulous guest logs and knew every rumor before noon. She led Ichiro to a storeroom behind jars of miso and opened a false floor panel. Inside were duplicate ledgers from three districts, each showing discrepancies between reported relief rice and actual distributions. "If these numbers spread carelessly," Sayo said, "officials will deny everything and punish the villages for 'insult.' If they spread carefully, people may finally believe what they already suspect."

As they spoke, riders arrived bearing an urgent notice: an inspector from Edo would tour river depots within days. Sayo asked Ichiro to carry coded instructions to boat captains so records could be hidden, copied, and moved before seizure. He hesitated. The task meant delaying his return to Aoi and increasing exposure. Yet refusing would strand allies with no warning.

By dusk he had visited two ferries, one sake wholesaler, and a paper mill whose owner secretly printed duplicate manifests after midnight. Everywhere he saw the same pattern: ordinary workers preserving fragile systems while elites fought for control of narratives. Historians debate how coordinated these river networks were, but surviving account books suggest practical cooperation often outpaced formal ideology.

Ichiro camped under an overturned barge with other couriers, sharing dried persimmon and stories in low voices. One man had once served a daimyo cavalry unit and now delivered medicine; another carried only poetry manuscripts to avoid suspicion. Before sleeping, Ichiro stitched the second relay letter into a new seam and sharpened his short blade on river stone, not because he wanted to fight, but because roads did not reward innocence.

At dawn, Tomobe's warning returned to him: speak less than you think. In a world of moving rumors, silence had become a discipline as valuable as swordwork.`,
        choiceA: "Continue courier work and warn every captain before inspectors arrive.",
        choiceB: "Return to Edo immediately with Sayo's discrepancy ledgers.",
        historyNotes: [
          "River logistics were essential to feeding Edo and surrounding settlements.",
          "Innkeepers and transport operators often acted as informal information brokers.",
          "Flood control and embankment maintenance were recurring local responsibilities.",
          "Duplicate account books are key historical sources for economic reconstruction."
        ],
        glossary: [
          { term: "Relay post", definition: "Station where messengers, horses, and dispatches were exchanged." },
          { term: "Manifest", definition: "Detailed shipping record listing cargo and destination." },
          { term: "Depot", definition: "Storage or transfer site for goods such as grain or rice." },
          { term: "Daimyo", definition: "Regional feudal lord controlling a domain." },
          { term: "Embankment", definition: "Raised structure built to prevent river flooding." },
          { term: "Miso", definition: "Fermented soybean paste commonly stored in large jars." }
        ],
        quizQuestions: [
          {
            prompt: "What makes Sayo strategically important to the network?",
            optionA: "She commands soldiers",
            optionB: "She keeps records and hears rumors quickly",
            optionC: "She owns a shipyard",
            optionD: "She works for the Edo magistrate",
            correctOption: "B",
            explanation: "As an innkeeper with detailed logs, Sayo tracks movement and information flow."
          },
          {
            prompt: "Why does Ichiro delay returning to Edo?",
            optionA: "He is injured",
            optionB: "He must deliver coded warnings to captains",
            optionC: "He loses his horse",
            optionD: "He is ordered to retire",
            correctOption: "B",
            explanation: "He chooses to help move and protect records before inspection sweeps begin."
          },
          {
            prompt: "Which broader theme appears in the chapter?",
            optionA: "Elite power alone sustains infrastructure",
            optionB: "Ordinary workers uphold fragile systems",
            optionC: "Written records are unnecessary",
            optionD: "Floods were rare and irrelevant",
            correctOption: "B",
            explanation: "The narrative repeatedly highlights laborers, innkeepers, and captains maintaining continuity."
          }
        ]
      },
      {
        slug: "winter-court-of-accounts",
        title: "Winter Court of Accounts",
        order: 2,
        body: `When Ichiro returned to Edo, frost silvered the tile roofs and breath smoked in narrow alleys. Lady Aoi had relocated the network's core meeting to a candle workshop near Asakusa, where the constant smell of wax disguised late-night gatherings. Inside, copied ledgers from river depots, village granaries, and toll stations covered an entire wall. Threads connected names, dates, and shipment quantities like a spider web of accountability.

Aoi announced a bold move: convene a "court of accounts," an unofficial hearing where respected figures from different classes would examine evidence publicly in a temple annex before winter's end. "If officials dismiss one merchant, we bring ten records," she said. "If they silence one scholar, we bring farmers who can count sacks with their own hands." Ichiro admired the idea but feared the risks. Public scrutiny could force reform, yet it could also give opponents a target list.

Preparation consumed every waking hour. Ichiro copied testimony from boatmen whose deliveries were rerouted without explanation. A physician compiled mortality reports from villages where relief grain arrived too late. A former tax clerk drafted simple diagrams so non-literate audiences could understand discrepancies. The work taught Ichiro that evidence was not only numbers; it was hunger remembered, labor measured, and promises broken.

Three days before the hearing, an edict appeared on major notice boards prohibiting "unauthorized assemblies concerning fiscal matters." Rumors claimed arrests had already begun in two neighborhoods. Aoi refused panic. She split participants into smaller circles, staggered arrival times, and assigned fallback sites. "Institutions fear witnesses," she told Ichiro. "So we become many witnesses."

On the evening of the hearing, snow began to fall, muting the city. People still came: fish dealers, copyists, monks, porters, widows from flood districts, and even two minor samurai in plain coats who sat at the back and spoke to no one. The session opened with a recitation of principles from Confucian governance texts about benevolent administration. Then the evidence began.

Ledger by ledger, witness by witness, patterns emerged: repeated inventory gaps after specific inspector visits, toll surcharges imposed without formal decree, and relief shipments diverted toward politically favored districts. At one point a magistrate's representative stood and accused the assembly of forgery. Sayo stepped forward, produced inn logs matching barge arrival times, and invited anyone present to inspect her records. Murmurs spread. The representative sat down.

Historians debate whether such popular hearings had direct legal impact, but contemporaneous diaries indicate they shaped legitimacy by making hidden practices visible. In that room, legitimacy shifted in real time. People who arrived expecting rumor left carrying copied tables and sworn statements.

After midnight, as participants dispersed in disciplined silence, Ichiro noticed the two samurai place sealed packets near the altar before departing. Inside were additional audit notes from a provincial storehouse and a message: "Some of us still remember duty."

Aoi read the note and smiled for the first time in weeks. "We are no longer a lantern," she said. "We are a constellation."`,
        choiceA: "Expand the court model to other districts despite the edict.",
        choiceB: "Pause public hearings and focus on covert documentation.",
        historyNotes: [
          "Asakusa hosted dense commercial and artisanal activity suitable for discreet meetings.",
          "Notice-board edicts were a standard communication method for regulations and prohibitions.",
          "Confucian language was often used to frame critiques of governance failures.",
          "Public credibility could shift through records, testimony, and cross-class participation."
        ],
        glossary: [
          { term: "Edict", definition: "Official proclamation issued by governing authorities." },
          { term: "Annex", definition: "Auxiliary building attached to a larger complex such as a temple." },
          { term: "Legitimacy", definition: "Perceived rightfulness of authority in the eyes of the public." },
          { term: "Audit", definition: "Systematic review of records to check accuracy and compliance." },
          { term: "Confucian governance", definition: "Political ethic emphasizing moral duty, order, and benevolent rule." },
          { term: "Surcharge", definition: "Additional fee imposed on top of a standard charge." }
        ],
        quizQuestions: [
          {
            prompt: "What is the purpose of the 'court of accounts'?",
            optionA: "To entertain winter crowds",
            optionB: "To publicly test and present fiscal evidence",
            optionC: "To recruit military officers",
            optionD: "To celebrate tax increases",
            correctOption: "B",
            explanation: "Aoi designs the gathering as a cross-class review of records and testimony."
          },
          {
            prompt: "How does Sayo respond to accusations of forgery?",
            optionA: "She leaves the hearing",
            optionB: "She demands armed protection",
            optionC: "She provides verifiable inn logs",
            optionD: "She burns all documents",
            correctOption: "C",
            explanation: "Her logs corroborate barge schedules and strengthen evidence credibility."
          },
          {
            prompt: "What does the constellation metaphor imply?",
            optionA: "The movement is shrinking",
            optionB: "A single leader controls everything",
            optionC: "Multiple connected actors now sustain the effort",
            optionD: "The work has ended",
            correctOption: "C",
            explanation: "Aoi signals that distributed allies now form a resilient network."
          }
        ]
      },
      {
        slug: "embassy-on-the-hill",
        title: "Embassy on the Hill",
        order: 3,
        body: `Late winter brought a different kind of pressure. Word spread that a foreign delegation anchored offshore intended to request expanded trade terms and formal diplomatic residence near Edo. Some officials argued engagement was unavoidable; others warned any concession invited humiliation. In tea houses and bathhouses, citizens debated ship cannons, silver outflow, and whether old laws could survive new oceans.

Aoi received an invitation stamped with an unexpected seal: attend a private briefing at a hilltop villa used for sensitive consultations among senior retainers. She decided to go but insisted on bringing one aide. She chose Ichiro.

They climbed at dusk through gardens stripped bare by cold. Inside the villa, charcoal braziers glowed beneath painted screens showing tranquil landscapes that mocked the tension in the room. Present were three domain advisers, one coastal engineer, a language scholar who had studied Dutch texts, and a stern accountant from the shogunate finance office. After formal bows, the accountant spoke first: "Domestic disorder weakens bargaining abroad. Your hearings stir disorder." Aoi replied, "Hidden theft weakens bargaining first. We documented it because stability built on false ledgers collapses under pressure."

The discussion pivoted to practical concerns. The engineer described outdated coastal batteries unable to deter modern warships. The scholar outlined how controlled trade could provide technical knowledge if negotiated carefully. A domain adviser countered that opening ports would empower rivals and destabilize tax systems tied to rice assessments. Ichiro listened, stunned by the scale of the dilemma. River toll fraud suddenly connected to global power.

During a recess, Ichiro wandered to a veranda overlooking lanterns scattered across Edo like embers. The language scholar joined him and said quietly, "People imagine history turns on treaties signed by famous men. Often it turns because clerks kept clear books or hid ugly truths until too late." He asked Ichiro about the court of accounts. Ichiro answered cautiously, then admitted he feared becoming useful only as a courier, never as a thinker. The scholar laughed gently. "Couriers carry thought across distance. That is thinking with your feet."

Back in session, a compromise emerged. A temporary council would draft recommendations linking domestic fiscal reforms to foreign policy readiness: transparent supply records, standardized port fees, and anti-corruption audits in key depots. Aoi agreed to contribute data if participants guaranteed witness protection for vulnerable informants. The accountant resisted, then relented when the engineer warned that sabotage in supply chains could cripple coastal defenses.

Historians debate how directly internal reform circles influenced treaty-era planning, but archival fragments suggest cross-pollination between local accountability efforts and strategic policy debates. This meeting felt like one of those fragments before it hardened into narrative.

When Aoi and Ichiro descended the hill, snow had melted into black rivulets reflecting moonlight. "You looked surprised," Aoi said.

"I thought we were fighting over ledgers," Ichiro replied.

"We are," she said. "Ledgers decide ships, roads, grain, and trust. Empires move on ink before they move on steel."`,
        choiceA: "Support the temporary council and share vetted data for policy reform.",
        choiceB: "Reject collaboration and keep all network records internal.",
        historyNotes: [
          "Late Tokugawa policy debates often linked coastal defense, trade, and fiscal capacity.",
          "Rangaku (Dutch learning) informed technical and diplomatic discussions before wider opening.",
          "Rice-based taxation systems faced strain under changing domestic and international pressures.",
          "Policy formation frequently involved unofficial consultation circles alongside formal offices."
        ],
        glossary: [
          { term: "Delegation", definition: "Official group sent to represent state or institutional interests." },
          { term: "Coastal battery", definition: "Fortified artillery position used for shoreline defense." },
          { term: "Rangaku", definition: "Study of Western knowledge through Dutch sources in early modern Japan." },
          { term: "Treaty-era", definition: "Period marked by diplomatic agreements with foreign powers." },
          { term: "Audit trail", definition: "Document path showing how records were produced and verified." },
          { term: "Informant", definition: "Person who provides sensitive information, often at personal risk." }
        ],
        quizQuestions: [
          {
            prompt: "Why is Ichiro invited to the hilltop briefing?",
            optionA: "He is a military commander",
            optionB: "Aoi chooses him as her aide",
            optionC: "He represents foreign merchants",
            optionD: "He owns the villa",
            correctOption: "B",
            explanation: "Aoi brings Ichiro as her trusted assistant to a sensitive consultation."
          },
          {
            prompt: "What policy linkage emerges in the meeting?",
            optionA: "Foreign diplomacy is unrelated to domestic records",
            optionB: "Fiscal transparency supports external negotiating strength",
            optionC: "Port fees should remain secret",
            optionD: "Couriers should stop carrying data",
            correctOption: "B",
            explanation: "Participants agree that supply integrity and clean accounts affect strategic capacity."
          },
          {
            prompt: "What does Aoi mean by 'Empires move on ink before steel'?",
            optionA: "Weapons are obsolete",
            optionB: "Record-keeping and administration shape power before warfare",
            optionC: "Poetry controls diplomacy",
            optionD: "Snow disrupts policy",
            correctOption: "B",
            explanation: "She emphasizes that institutions and logistics enable or limit military action."
          }
        ]
      }
    ]
  },
  {
    slug: "chapter-2",
    title: "Chapter 2",
    order: 3,
    isPremium: true,
    scenes: [
      {
        slug: "spring-of-many-seals",
        title: "Spring of Many Seals",
        order: 1,
        body: `Spring rain returned with plum blossoms, and with it came documents bearing more seals than substance. The temporary council's first draft reached Aoi's workshop wrapped in silk and etiquette: elegant prose praising harmony, followed by vague commitments that promised everything and measured nothing. Ichiro read aloud lines about "sincere stewardship" and "balanced openness," then dropped the scroll in frustration. "This could mean anything," he said.

"Exactly," Aoi replied. "Ambiguity protects cowards. We need clauses that bind action."

For two weeks the network transformed into a drafting machine. Scholars translated technical terms from Dutch manuals into plain Japanese. Boat captains proposed standardized cargo forms that even apprentice clerks could complete. Village headmen sent examples of weather loss reporting so relief triggers could be tied to observable thresholds instead of patronage requests. Ichiro coordinated messengers between districts, carrying draft fragments in bundles labeled as theater scripts.

At a warehouse near Shinagawa, he met the coastal engineer again, who demonstrated a new inventory board using wooden pegs to track powder, rice, rope, and timber in real time. "If numbers live only in one office," the engineer said, "they can be erased. If they live in many hands, they become harder to kill." Ichiro thought of Sayo's inn logs, Tomobe's maps, and Aoi's wall of thread. The same principle appeared everywhere.

Negotiations intensified. The shogunate accountant accepted mandatory quarterly depot audits but resisted public disclosure, citing security. Aoi countered with tiered transparency: strategic details protected, aggregate balances published at temple notice boards. Domain advisers argued over which ports should adopt common fee schedules first. Merchants demanded arbitration mechanisms when unauthorized surcharges appeared. Each compromise cost pride, time, and political capital.

One night, an anonymous letter arrived accusing Ichiro of forging courier signatures on draft appendices. The charge was false, but dangerous. If believed, it could discredit an entire communication chain. Aoi ordered an immediate verification session. Every courier presented route logs, witness stamps, and hand-copy comparisons. Ichiro endured hours of scrutiny, then watched as the accusation collapsed under contradictory dates. He felt relief, then anger at how easily rumor could mimic evidence.

Historians debate whether such micro-level procedural reforms mattered compared with larger military and diplomatic shocks. Yet durable transitions often depend on procedures that survive leadership turnover: shared forms, audit cycles, and appeal pathways. In this spring of many seals, procedure became the battlefield.

By early summer, the council ratified a revised charter: standardized depot ledgers across participating districts, fixed reporting intervals, protected witness channels, and rotating mixed-class oversight panels. It was imperfect, contested, and vulnerable to sabotage. It was also real.

At the ratification gathering, Ichiro was asked to apply the final courier seal to the implementation packet bound for river posts. His hand trembled only once. He pressed the seal firmly and looked up at Aoi.

"Do you think this lasts?" he asked.

"Nothing lasts by itself," she said. "People make systems alive every day."`,
        choiceA: "Help implement charter procedures at river depots immediately.",
        choiceB: "Investigate the source of the false accusation before rollout.",
        historyNotes: [
          "Administrative reform often depended on drafting enforceable procedures, not only broad ideals.",
          "Shinagawa and nearby logistics hubs were key nodes in Edo's supply ecosystem.",
          "Public notice boards could distribute aggregate data while withholding sensitive details.",
          "Forgery allegations were a common tactic to undermine reform credibility."
        ],
        glossary: [
          { term: "Clause", definition: "Specific legal or policy sentence defining obligations." },
          { term: "Aggregate balance", definition: "Summarized total values without disclosing granular details." },
          { term: "Arbitration", definition: "Neutral process for resolving disputes between parties." },
          { term: "Ratification", definition: "Formal approval process that makes an agreement operative." },
          { term: "Appendix", definition: "Supplementary section containing supporting details." },
          { term: "Oversight panel", definition: "Group tasked with monitoring compliance and accountability." }
        ],
        quizQuestions: [
          {
            prompt: "Why does Aoi criticize the council's original draft?",
            optionA: "It is too short",
            optionB: "It lacks enforceable specificity",
            optionC: "It excludes all merchants",
            optionD: "It focuses only on military issues",
            correctOption: "B",
            explanation: "She argues vague language allows actors to avoid concrete obligations."
          },
          {
            prompt: "How is the forgery accusation against Ichiro resolved?",
            optionA: "By confession",
            optionB: "By destroying disputed drafts",
            optionC: "Through route logs, stamps, and handwriting checks",
            optionD: "By arresting all couriers",
            correctOption: "C",
            explanation: "Documented verification evidence disproves the rumor-based accusation."
          },
          {
            prompt: "What central idea is emphasized in this scene?",
            optionA: "Procedure can be politically decisive",
            optionB: "Reforms succeed without implementation",
            optionC: "Seals guarantee honesty",
            optionD: "Charters are irrelevant to logistics",
            correctOption: "A",
            explanation: "The narrative frames practical rules and recurring checks as the core reform terrain."
          }
        ]
      },
      {
        slug: "festival-of-banners",
        title: "Festival of Banners",
        order: 2,
        body: `To secure public buy-in for the new charter, Aoi proposed an audacious tactic: reveal progress during the summer river festival, when tens of thousands gathered along embankments to watch decorated barges, puppet stages, and fireworks. "People trust what they can see," she said. "So let them see records become relief." 

The plan required choreography worthy of theater. Boat captains agreed to display standardized manifests on lacquered boards at docking points. Temple volunteers prepared simple charts showing how many rice sacks had reached flood-prone wards under the new reporting cycle versus the previous year. Physicians organized free consultation tents funded by recovered surcharge revenues. Even skeptical officials realized that visible competence could calm unrest better than prohibitions.

Ichiro supervised a youth team tasked with explaining charts to visitors using pebbles, cups, and mock ledgers. Children asked sharp questions adults avoided: "Who stole the missing sacks before?" "If rules changed, can they change back?" "Why did some villages wait longer than others?" He answered as honestly as he could: accountability was improving, but not complete; records reduced abuse, but could not erase hardship overnight.

At noon, a barge from upriver arrived late and half-empty, threatening embarrassment. Its captain reported a landslide blocking a transfer path. Rumors spread instantly that reform had failed. Ichiro and Sayo coordinated a rapid response, posting route maps and delay notices at three festival checkpoints while rerouting reserve supplies from a nearby warehouse. By sunset, the shortage had been covered and panic faded.

As fireworks painted the sky, Aoi delivered a brief address from a temporary platform draped in blue banners. She did not claim victory. Instead she listed unresolved problems: uneven inspector training, contested surcharge refunds, and domains still refusing common forms. "Trust is not a speech," she said. "Trust is a schedule kept, a record checked, and a correction made in daylight."

After the speech, the stern shogunate accountant approached Ichiro with unexpected courtesy. "Your delay notices were timely," he said. "Few panic when facts arrive before rumor." He handed Ichiro a sealed packet authorizing pilot expansion of mixed-class oversight panels to two additional corridors.

Historians debate how much festival politics influenced policy uptake, yet public ritual has long shaped administrative legitimacy. In crowded streets where entertainment and governance overlapped, people judged institutions by what reached their bowls and households, not by abstract decrees.

Late that night, after lanterns dimmed and vendors packed away skewers and paper fans, Ichiro sat on the embankment watching ash drift from spent fireworks. He remembered the boy who once entered Edo carrying a single sealed tube and little understanding. Now he carried frameworks, timetables, and testimonies across a wider map. The work remained precarious, but precarious no longer meant invisible.

Sayo sat beside him and nudged his shoulder. "Tomorrow we argue again," she said.

Ichiro laughed. "Then tonight we count what held."`,
        choiceA: "Use festival success to expand reform pilots to new corridors.",
        choiceB: "Delay expansion and focus on fixing training gaps first.",
        historyNotes: [
          "Urban festivals were important venues for information exchange and public perception-building.",
          "Visual data presentation can improve comprehension across literacy levels.",
          "Supply shocks such as landslides routinely tested administrative resilience.",
          "Legitimacy often depends on responsive communication during disruptions."
        ],
        glossary: [
          { term: "Manifest board", definition: "Public display panel summarizing incoming cargo records." },
          { term: "Pilot expansion", definition: "Limited rollout used to test a policy in additional locations." },
          { term: "Corridor", definition: "Linked route segment for transport, oversight, and communication." },
          { term: "Reroute", definition: "Redirect shipments through alternate paths after disruption." },
          { term: "Legibility", definition: "Ease with which citizens can understand administrative information." },
          { term: "Refund", definition: "Repayment of improperly collected charges." }
        ],
        quizQuestions: [
          {
            prompt: "Why does Aoi choose the river festival for a public update?",
            optionA: "No one attends official meetings",
            optionB: "Large crowds allow visible demonstration of practical reforms",
            optionC: "Festivals are legally required for audits",
            optionD: "Foreign delegates demanded it",
            correctOption: "B",
            explanation: "She wants people to witness concrete outcomes in an accessible public setting."
          },
          {
            prompt: "How do Ichiro and Sayo manage the late half-empty barge crisis?",
            optionA: "They hide the incident",
            optionB: "They cancel the festival",
            optionC: "They publish delay facts and reroute reserves",
            optionD: "They blame a rival domain without evidence",
            correctOption: "C",
            explanation: "Rapid factual communication and contingency logistics prevent rumor-driven panic."
          },
          {
            prompt: "What message defines Aoi's speech?",
            optionA: "Reform is complete",
            optionB: "Trust must be earned through consistent transparent practice",
            optionC: "Only elites should review records",
            optionD: "Records matter less than ceremony",
            correctOption: "B",
            explanation: "She frames trust as repeated accountable action, not symbolic declaration."
          }
        ]
      },
      {
        slug: "letters-for-the-next-generation",
        title: "Letters for the Next Generation",
        order: 3,
        body: `Autumn arrived with clear skies and long shadows across the river warehouses. Reform panels now operated in multiple corridors, and conflicts had shifted from outright denial to exhausting detail: how to classify storm loss, when to trigger emergency reserves, who could appeal disputed inspections. The work was less dramatic than clandestine courier rides, but perhaps more transformative.

Aoi called a final gathering at Ueno, back where Ichiro had first arrived in rain and confusion. This time the hall held apprentices, clerks, ferrymen, teachers, and several young women from accounting families who had begun training as record auditors despite resistance from conservative elders. On the low table lay stacks of paper labeled "Letters Forward." Each participant was asked to write one practical lesson for future caretakers of the system.

Ichiro struggled at first. Heroic stories came easily; maintenance wisdom felt plain. Eventually he wrote: "If a number seems convenient, test it twice. If a witness seems uncertain, ask what fear they carry. If a policy works, document why before memory edits the struggle." Sayo wrote about redundancy: keep duplicate logs in separate hands. Tomobe wrote about route discipline: timing is evidence. The physician wrote about mortality records: delayed grain is a medical event, not only an accounting error.

In the afternoon, a courier from the hilltop council brought mixed news. Several domains had adopted common forms fully; others accepted only partial standards. One corridor reported strong compliance but rising smuggling along bypass paths. Another saw improved relief speed yet persistent bribery at checkpoint transitions. Aoi read each report without surprise. "Systems do not become honest in one season," she said. "They become harder to abuse over many seasons."

Before dusk, Ichiro visited the cracked stone lantern where he had once hidden the ledger. The crack was wider now, moss filling its edge. He placed inside a copy of his letter, sealed but not secret. A young apprentice noticed and asked what he was doing. "Leaving instructions for someone who arrives scared," Ichiro said.

That night, lanterns were lit along the temple approach in quiet rows. No speeches, no fireworks, only steady light. Aoi invited each apprentice to read one line from the Letters Forward collection. Some voices trembled; others rang clear. Together they formed a manual woven from lived mistakes.

Historians debate whether grassroots record cultures can persist after political regime shifts. Evidence is uneven, and archives are always incomplete. Yet continuity sometimes survives in habits rather than institutions: double-checking weights, logging delays honestly, teaching novices that documentation is an ethical act.

As the ceremony ended, Aoi handed Ichiro a travel packet addressed to a school in Kai Province. "Your teacher requested a curriculum on civic accounting," she said. "They want someone who has seen both fear and procedure."

Ichiro looked down the lantern-lined path toward the city. Years earlier he had entered Edo as a messenger carrying another person's words. Now he would leave carrying methods, questions, and a duty to teach. He bowed deeply.

"I will go," he said. "And I will return with students who know that history is written in ledgers as much as in battles."`,
        choiceA: "Travel to Kai and begin teaching civic accounting methods.",
        choiceB: "Stay in Edo to strengthen anti-smuggling measures first.",
        historyNotes: [
          "Institutional durability often depends on training practices and documentation culture.",
          "Checkpoint corruption and smuggling were persistent governance challenges.",
          "Women's participation in accounting and clerical work varied by household and region.",
          "Historical continuity can survive through routines even when formal regimes change."
        ],
        glossary: [
          { term: "Redundancy", definition: "Intentional duplication that protects systems against loss or tampering." },
          { term: "Compliance", definition: "Degree to which rules are followed in practice." },
          { term: "Bypass path", definition: "Alternative route used to avoid regulated checkpoints." },
          { term: "Civic accounting", definition: "Public-oriented record practices supporting fair governance." },
          { term: "Archive", definition: "Collection of preserved records used for memory and accountability." },
          { term: "Regime shift", definition: "Major transition in governing political order." }
        ],
        quizQuestions: [
          {
            prompt: "What is the purpose of the 'Letters Forward' activity?",
            optionA: "To compose poetry for festivals",
            optionB: "To preserve practical lessons for future system caretakers",
            optionC: "To replace all official records",
            optionD: "To announce military promotions",
            correctOption: "B",
            explanation: "Participants document transferable methods and cautionary principles."
          },
          {
            prompt: "How does Aoi interpret mixed implementation results across domains?",
            optionA: "As proof reform is pointless",
            optionB: "As normal in long-term system change",
            optionC: "As evidence of foreign sabotage only",
            optionD: "As reason to stop auditing",
            correctOption: "B",
            explanation: "She emphasizes that reducing abuse is gradual and iterative across seasons."
          },
          {
            prompt: "What arc does Ichiro's final assignment represent?",
            optionA: "From learner courier to teacher of accountable practice",
            optionB: "From merchant to naval officer",
            optionC: "From exile to governor",
            optionD: "From monk to playwright",
            correctOption: "A",
            explanation: "He transitions from carrying messages to teaching durable civic methods."
          }
        ]
      }
    ]
  }
];

async function main() {
  await prisma.quizQuestion.deleteMany();
  await prisma.scene.deleteMany();
  await prisma.chapter.deleteMany();

  for (const chapter of chapters) {
    await prisma.chapter.create({
      data: {
        slug: chapter.slug,
        title: chapter.title,
        order: chapter.order,
        isPremium: chapter.isPremium,
        scenes: {
          create: chapter.scenes.map((scene) => ({
            slug: scene.slug,
            title: scene.title,
            order: scene.order,
            body: scene.body,
            choiceA: scene.choiceA,
            choiceB: scene.choiceB,
            historyNotes: scene.historyNotes,
            glossary: scene.glossary,
            quizQuestions: {
              create: scene.quizQuestions,
            },
          })),
        },
      },
    });
  }

  console.log("Seed completed: chapters, scenes, and quizzes inserted.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
