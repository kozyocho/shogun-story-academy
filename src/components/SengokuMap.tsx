"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Story = {
  id: string;
  slug: string;
  title: string;
  figure: string | null;
  isPremium: boolean;
};

type Props = {
  stories: Story[];
  completedSlugs: string[];
  isPremium: boolean;
};

// Historical battle/story locations on the Sengoku map
const LOCATIONS = [
  {
    slug: "the-battle-of-okehazama",
    x: 220, y: 295,
    label: "桶狭間", year: 1560,
    labelOffset: { x: 0, y: 20 },
  },
  {
    slug: "bushido-the-way-of-the-warrior",
    x: 168, y: 272,
    label: "京都", year: null,
    labelOffset: { x: -20, y: 0 },
  },
  {
    slug: "the-lone-samurai-miyamoto-musashi",
    x: 98, y: 330,
    label: "巌流島", year: 1612,
    labelOffset: { x: 0, y: 20 },
  },
  {
    slug: "from-sandal-bearer-to-ruler-toyotomi-hideyoshi",
    x: 158, y: 288,
    label: "大阪城", year: 1590,
    labelOffset: { x: -24, y: 0 },
  },
  {
    slug: "the-guns-of-nagashino",
    x: 240, y: 278,
    label: "長篠", year: 1575,
    labelOffset: { x: 20, y: 0 },
  },
  {
    slug: "the-battle-that-made-japan-sekigahara",
    x: 196, y: 270,
    label: "関ヶ原", year: 1600,
    labelOffset: { x: 0, y: -18 },
  },
  {
    slug: "the-betrayal-at-honnoji",
    x: 172, y: 262,
    label: "本能寺", year: 1582,
    labelOffset: { x: 22, y: 0 },
  },
  {
    slug: "hattori-hanzo-and-the-ninja-of-iga",
    x: 192, y: 295,
    label: "伊賀", year: null,
    labelOffset: { x: 20, y: 0 },
  },
  {
    slug: "ii-naotora-the-female-lord",
    x: 248, y: 288,
    label: "遠江", year: null,
    labelOffset: { x: 20, y: 0 },
  },
  {
    slug: "tokugawa-ieyasu-the-patience-of-the-crane",
    x: 232, y: 295,
    label: "三河", year: null,
    labelOffset: { x: 0, y: 20 },
  },
  {
    slug: "takeda-shingen-the-tiger-of-kai",
    x: 272, y: 248,
    label: "甲斐", year: null,
    labelOffset: { x: 20, y: 0 },
  },
  {
    slug: "the-art-of-seppuku",
    x: 162, y: 278,
    label: "京", year: null,
    labelOffset: { x: -18, y: 0 },
  },
  {
    slug: "yasuke-the-african-samurai",
    x: 178, y: 265,
    label: "安土", year: null,
    labelOffset: { x: 0, y: -18 },
  },
  {
    slug: "the-forty-seven-ronin",
    x: 308, y: 218,
    label: "江戸", year: 1703,
    labelOffset: { x: 20, y: 0 },
  },
];

export function SengokuMap({ stories, completedSlugs, isPremium }: Props) {
  const router = useRouter();
  const completedSet = new Set(completedSlugs);
  const storyBySlug = new Map(stories.map((s) => [s.slug, s]));
  const [active, setActive] = useState<string | null>(null);

  function handleMarker(slug: string, locked: boolean) {
    router.push(locked ? "/pricing" : `/stories/${slug}`);
  }

  const activeStory = active ? storyBySlug.get(active) : null;
  const activeLoc = active ? LOCATIONS.find((l) => l.slug === active) : null;
  const activeCompleted = active ? completedSet.has(active) : false;
  const activeLocked = activeStory?.isPremium && !isPremium;

  return (
    <div className="w-full max-w-sm mx-auto">
      <style>{`
        @keyframes map-pulse {
          0%, 100% { r: 9; }
          50%       { r: 12; }
        }
        @keyframes map-glow {
          0%, 100% { opacity: 0.4; r: 16; }
          50%       { opacity: 0.8; r: 19; }
        }
      `}</style>

      <svg
        viewBox="0 0 380 520"
        className="w-full h-auto rounded-xl overflow-hidden"
        style={{ background: "#0a0906" }}
        aria-label="Sengoku Japan map"
      >
        <defs>
          <radialGradient id="island-fill" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#C4A97A" />
            <stop offset="100%" stopColor="#7A5530" />
          </radialGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.6" />
          </filter>
        </defs>

        {/* Faint grid — aged-map feel */}
        {[102, 204, 306].map((x) => (
          <line key={`gx${x}`} x1={x} y1="0" x2={x} y2="520" stroke="#1a1208" strokeWidth="0.5" />
        ))}
        {[130, 260, 390].map((y) => (
          <line key={`gy${y}`} x1="0" y1={y} x2="380" y2={y} stroke="#1a1208" strokeWidth="0.5" />
        ))}

        {/* ── Islands ─────────────────────────────────────────────────── */}

        {/* ── Honshu (本州) ── */}
        <path
          d="
            M 88,342
            C 90,338 94,334 98,330
            C 102,326 104,322 106,318
            C 108,312 110,306 114,300
            C 118,294 122,290 126,286
            C 130,282 134,278 138,275
            C 142,272 146,270 150,268
            C 154,266 156,264 158,260
            C 160,256 160,252 162,248
            C 164,244 166,240 168,236
            C 170,232 172,228 175,224
            C 178,220 181,216 184,212
            C 187,208 189,204 191,200
            C 193,196 194,192 196,188
            C 198,184 200,180 202,176
            C 204,172 206,168 208,164
            C 210,160 212,156 215,152
            C 218,148 221,144 224,140
            C 227,136 230,132 233,128
            C 236,124 239,120 242,116
            C 245,112 248,108 251,104
            C 254,100 257,97  260,94
            C 263,91  266,89  269,88
            C 271,87  273,87  275,88
            C 277,89  278,91  279,94
            C 280,97  280,100 279,104
            C 278,108 276,112 274,116
            C 272,120 270,124 268,128
            C 266,132 264,136 262,140
            C 260,144 258,148 256,152
            C 254,156 252,160 250,164
            C 248,168 246,172 244,176
            C 242,180 240,184 238,188
            C 236,192 234,196 232,200
            C 230,204 228,208 226,212
            C 224,216 222,220 221,224
            C 220,228 220,232 220,236
            C 220,240 221,244 222,248
            C 223,252 225,256 226,260
            C 227,264 228,268 228,272
            C 228,276 227,280 226,284
            C 225,288 224,292 222,296
            C 220,300 218,304 216,308
            C 214,312 212,316 210,320
            C 208,324 207,328 206,332
            C 205,336 205,340 206,344
            C 207,348 209,352 211,355
            C 213,358 216,360 219,362
            C 222,364 225,365 228,365
            C 231,365 234,364 237,362
            C 240,360 242,357 244,354
            C 246,351 247,348 248,344
            C 249,340 249,336 248,332
            C 247,328 245,324 244,320
            C 243,316 242,312 242,308
            C 242,304 243,300 244,296
            C 245,292 247,288 249,285
            C 251,282 254,280 257,278
            C 260,276 263,275 266,274
            C 269,273 272,273 275,274
            C 278,275 281,277 283,280
            C 285,283 286,287 287,291
            C 288,295 288,299 287,303
            C 286,307 284,311 282,314
            C 280,317 278,320 276,322
            C 274,324 272,326 270,328
            C 268,330 266,332 264,334
            C 262,336 260,338 258,340
            C 256,342 254,344 252,346
            C 250,348 248,350 246,352
            C 244,354 242,356 241,358
            C 240,360 240,362 240,364
            L 236,366
            L 232,368
            L 228,369
            L 220,368
            L 210,364
            L 198,358
            L 184,352
            L 170,348
            L 158,346
            L 146,346
            L 136,347
            L 126,348
            L 116,347
            L 106,344
            L 98,342
            L 88,342
            Z
          "
          fill="url(#island-fill)"
          stroke="#5C3D1E"
          strokeWidth="1.5"
          strokeLinejoin="round"
          filter="url(#shadow)"
        />

        {/* ── Kyushu (九州) ── */}
        <path
          d="
            M 88,342
            C 86,344 84,347 82,350
            C 80,353 78,357 76,362
            C 74,367 72,373 71,379
            C 70,385 70,391 71,397
            C 72,403 74,409 77,414
            C 80,419 83,423 87,427
            C 91,431 95,434 99,436
            C 103,438 107,439 111,439
            C 115,439 119,438 123,436
            C 127,434 130,431 133,428
            C 136,425 138,421 140,417
            C 142,413 143,409 143,405
            C 143,401 142,397 140,393
            C 138,389 135,386 132,383
            C 129,380 126,378 123,376
            C 120,374 117,372 114,370
            C 111,368 108,366 106,363
            C 104,360 102,357 100,354
            C 98,351 96,348 94,346
            C 92,344 90,342 88,342
            Z
          "
          fill="url(#island-fill)"
          stroke="#5C3D1E"
          strokeWidth="1.5"
          strokeLinejoin="round"
          filter="url(#shadow)"
        />

        {/* ── Shikoku (四国) ── */}
        <path
          d="
            M 136,347
            C 140,349 144,352 148,356
            C 152,360 156,365 160,370
            C 164,375 167,379 170,382
            C 173,385 176,387 179,388
            C 182,389 185,389 188,388
            C 191,387 194,385 197,382
            C 200,379 202,375 203,371
            C 204,367 204,363 203,359
            C 202,355 200,351 197,348
            C 194,345 191,343 188,342
            C 185,341 182,341 179,341
            C 176,341 173,342 170,343
            C 167,344 164,345 161,346
            C 158,347 155,347 152,347
            C 149,347 146,347 143,347
            C 140,347 138,347 136,347
            Z
          "
          fill="url(#island-fill)"
          stroke="#5C3D1E"
          strokeWidth="1.5"
          strokeLinejoin="round"
          filter="url(#shadow)"
        />

        {/* ── Hokkaido (北海道) ── */}
        <path
          d="
            M 269,88
            C 271,82 274,76 278,70
            C 282,64 287,58 293,53
            C 299,48 305,44 312,41
            C 319,38 326,37 333,38
            C 340,39 347,42 352,47
            C 357,52 360,58 361,65
            C 362,72 361,79 358,85
            C 355,91 350,96 344,100
            C 338,104 331,107 324,108
            C 317,109 310,109 303,107
            C 296,105 290,102 284,98
            C 278,94 273,90 269,88
            Z
          "
          fill="url(#island-fill)"
          stroke="#5C3D1E"
          strokeWidth="1.5"
          strokeLinejoin="round"
          filter="url(#shadow)"
        />

        {/* ── Awaji Island ── */}
        <ellipse cx="164" cy="336" rx="5" ry="9"
          fill="#B89460" stroke="#5C3D1E" strokeWidth="1"
          transform="rotate(-20, 164, 336)"
        />

        {/* ── Izu Peninsula (伊豆半島) ── */}
        <path
          d="M 268,268 C 270,275 271,282 270,290 C 269,298 266,305 262,310 C 260,306 259,300 260,293 C 261,286 264,278 268,268 Z"
          fill="url(#island-fill)" stroke="#5C3D1E" strokeWidth="1"
        />

        {/* ── Noto Peninsula (能登半島) ── */}
        <path
          d="M 218,210 C 214,204 210,198 208,192 C 207,186 208,181 211,178 C 214,182 216,188 217,195 C 218,202 218,207 218,210 Z"
          fill="url(#island-fill)" stroke="#5C3D1E" strokeWidth="1"
        />

        {/* ── Map labels ──────────────────────────────────────────────── */}
        <text x="22" y="30" fontFamily="serif" fontSize="11" fill="#D4AF37" opacity="0.9" letterSpacing="3">
          戦国時代
        </text>
        <text x="22" y="44" fontFamily="serif" fontSize="7" fill="#7A5530" letterSpacing="2" opacity="0.8">
          SENGOKU JAPAN
        </text>

        {/* Compass */}
        <g transform="translate(352, 28)">
          <circle r="12" fill="#0f0c08" stroke="#3a2a18" strokeWidth="1" />
          <text x="0" y="-4" textAnchor="middle" fontSize="7" fill="#D4AF37" fontFamily="serif">N</text>
          <polygon points="-2,0 0,-8 2,0" fill="#D4AF37" opacity="0.9" />
          <polygon points="-2,0 0,8  2,0" fill="#5C3D1E" opacity="0.7" />
        </g>

        {/* Region labels (subtle context) */}
        <text x="192" y="268" fontFamily="serif" fontSize="7" fill="#7A5530" opacity="0.6" textAnchor="middle">畿内</text>
        <text x="248" y="318" fontFamily="serif" fontSize="7" fill="#7A5530" opacity="0.6" textAnchor="middle">東海</text>
        <text x="300" y="240" fontFamily="serif" fontSize="7" fill="#7A5530" opacity="0.6" textAnchor="middle">関東</text>
        <text x="108" y="410" fontFamily="serif" fontSize="7" fill="#7A5530" opacity="0.55" textAnchor="middle">九州</text>

        {/* ── Story markers ───────────────────────────────────────────── */}
        {LOCATIONS.map((loc) => {
          const story = storyBySlug.get(loc.slug);
          if (!story) return null;

          const completed = completedSet.has(loc.slug);
          const locked = story.isPremium && !isPremium;
          const isActive = active === loc.slug;

          const markerColor = completed
            ? "#D4AF37"
            : locked
            ? "#2a2018"
            : "#8B6040";
          const strokeColor = completed
            ? "#FFD700"
            : locked
            ? "#3a2a18"
            : "#C4A97A";
          const labelColor = completed ? "#D4AF37" : locked ? "#4a3828" : "#C4A97A";

          const lx = loc.x + loc.labelOffset.x;
          const ly = loc.y + loc.labelOffset.y + (loc.labelOffset.y !== 0 ? 0 : 3);

          return (
            <g
              key={loc.slug}
              style={{ cursor: "pointer" }}
              onClick={() => handleMarker(loc.slug, locked ?? false)}
              onMouseEnter={() => setActive(loc.slug)}
              onMouseLeave={() => setActive(null)}
              onTouchStart={() => setActive(loc.slug)}
              onTouchEnd={() => setTimeout(() => setActive(null), 1500)}
            >
              {/* Glow ring — completed */}
              {completed && (
                <circle
                  cx={loc.x}
                  cy={loc.y}
                  r="16"
                  fill="none"
                  stroke="#D4AF37"
                  strokeWidth="1"
                  style={{ animation: "map-glow 2.5s ease-in-out infinite" }}
                />
              )}

              {/* Main circle */}
              <circle
                cx={loc.x}
                cy={loc.y}
                r={isActive ? 13 : 9}
                fill={markerColor}
                stroke={strokeColor}
                strokeWidth={isActive ? 2.5 : 1.5}
                style={{
                  transition: "all 0.18s ease",
                  ...((!completed && !locked)
                    ? { animation: "map-pulse 2.2s ease-in-out infinite" }
                    : {}),
                }}
              />

              {/* Status symbol */}
              <text
                x={loc.x}
                y={loc.y + 4}
                textAnchor="middle"
                fontSize="9"
                fontFamily="sans-serif"
                fill={completed ? "#1a1208" : locked ? "#4a3828" : "#e0c890"}
                style={{ userSelect: "none", pointerEvents: "none" }}
              >
                {completed ? "✦" : locked ? "✕" : "◉"}
              </text>

              {/* Location label */}
              <text
                x={lx}
                y={loc.labelOffset.y === 0 ? loc.y + 4 : ly}
                dy={loc.labelOffset.y === 0 ? "0" : "0"}
                textAnchor={
                  loc.labelOffset.x < 0
                    ? "end"
                    : loc.labelOffset.x > 0
                    ? "start"
                    : "middle"
                }
                fontFamily="serif"
                fontSize="9"
                fill={labelColor}
                style={{ userSelect: "none", pointerEvents: "none" }}
              >
                {loc.label}
              </text>

              {/* Year */}
              {loc.year && (
                <text
                  x={lx}
                  y={
                    loc.labelOffset.y === 0
                      ? loc.y + 14
                      : ly + 11
                  }
                  textAnchor={
                    loc.labelOffset.x < 0
                      ? "end"
                      : loc.labelOffset.x > 0
                      ? "start"
                      : "middle"
                  }
                  fontFamily="serif"
                  fontSize="7"
                  fill="#5C3D1E"
                  opacity="0.9"
                  style={{ userSelect: "none", pointerEvents: "none" }}
                >
                  {loc.year}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Active story info panel */}
      {activeStory && activeLoc && (
        <div
          className={`mt-3 rounded-lg px-4 py-3 border transition-all duration-200 ${
            activeCompleted
              ? "bg-yellow-950/40 border-shogun-gold/40"
              : activeLocked
              ? "bg-gray-900 border-gray-800"
              : "bg-gray-900 border-gray-700"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p
                className={`text-xs font-bold uppercase tracking-wider mb-0.5 ${
                  activeCompleted
                    ? "text-shogun-gold"
                    : activeLocked
                    ? "text-gray-600"
                    : "text-gray-400"
                }`}
              >
                {activeLoc.label}
                {activeLoc.year ? ` · ${activeLoc.year}` : ""}
              </p>
              <p className="text-sm font-semibold text-white leading-snug truncate">
                {activeStory.title}
              </p>
            </div>
            <span
              className={`text-xs shrink-0 px-2 py-1 rounded font-bold ${
                activeCompleted
                  ? "bg-yellow-800/50 text-shogun-gold"
                  : activeLocked
                  ? "bg-gray-800 text-gray-600"
                  : "bg-gray-800 text-gray-400"
              }`}
            >
              {activeCompleted ? "✦ Conquered" : activeLocked ? "🔒 Premium" : "Tap to read"}
            </span>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-3 flex items-center justify-center gap-5 text-xs text-gray-600">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-600 inline-block ring-1 ring-yellow-400" />
          Conquered
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-900 inline-block ring-1 ring-amber-700" />
          Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-gray-800 inline-block ring-1 ring-gray-700" />
          Locked
        </span>
      </div>
    </div>
  );
}
