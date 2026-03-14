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
    x: 242,
    y: 340,
    label: "桶狭間",
    year: 1560,
    labelOffset: { x: 0, y: 22 },
  },
  {
    slug: "bushido-the-way-of-the-warrior",
    x: 175,
    y: 285,
    label: "京都",
    year: null,
    labelOffset: { x: -18, y: 0 },
  },
  {
    slug: "the-lone-samurai-miyamoto-musashi",
    x: 108,
    y: 366,
    label: "巌流島",
    year: 1612,
    labelOffset: { x: 0, y: 22 },
  },
  {
    slug: "from-sandal-bearer-to-ruler-toyotomi-hideyoshi",
    x: 178,
    y: 322,
    label: "大阪城",
    year: 1590,
    labelOffset: { x: -22, y: 0 },
  },
  {
    slug: "the-guns-of-nagashino",
    x: 262,
    y: 325,
    label: "長篠",
    year: 1575,
    labelOffset: { x: 18, y: 0 },
  },
  {
    slug: "the-battle-that-made-japan-sekigahara",
    x: 215,
    y: 308,
    label: "関ヶ原",
    year: 1600,
    labelOffset: { x: 0, y: -18 },
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
        viewBox="0 0 360 510"
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
          <line key={`gx${x}`} x1={x} y1="0" x2={x} y2="510" stroke="#1a1208" strokeWidth="0.5" />
        ))}
        {[128, 256, 384].map((y) => (
          <line key={`gy${y}`} x1="0" y1={y} x2="360" y2={y} stroke="#1a1208" strokeWidth="0.5" />
        ))}

        {/* ── Islands ─────────────────────────────────────────────────── */}

        {/* Honshu — main island */}
        <path
          d="M 103,362
             L 122,370 L 145,373 L 162,374 L 178,378
             L 188,384 L 194,400 L 200,420 L 210,408
             L 222,390 L 238,368 L 252,350 L 262,328
             L 270,305 L 284,278 L 298,252 L 312,222
             L 320,192 L 312,160 L 300,130 L 285,100
             L 270,88
             L 255,98  L 240,122 L 226,152 L 213,184
             L 200,214 L 188,242 L 175,262 L 158,282
             L 138,298 L 118,315 L 98,336
             Z"
          fill="url(#island-fill)"
          stroke="#5C3D1E"
          strokeWidth="1.5"
          strokeLinejoin="round"
          filter="url(#shadow)"
        />

        {/* Kyushu */}
        <path
          d="M 100,360
             L 108,372 L 118,392 L 122,415
             L 114,440 L 102,460 L 90,475
             L 78,480 L 68,470
             L 62,448 L 66,422 L 72,398
             L 80,378 L 92,362
             Z"
          fill="url(#island-fill)"
          stroke="#5C3D1E"
          strokeWidth="1.5"
          strokeLinejoin="round"
          filter="url(#shadow)"
        />

        {/* Shikoku */}
        <path
          d="M 148,372
             L 152,382 L 165,398 L 180,415
             L 196,420 L 210,408 L 218,392
             L 206,378 L 188,370 L 168,368
             Z"
          fill="url(#island-fill)"
          stroke="#5C3D1E"
          strokeWidth="1.5"
          strokeLinejoin="round"
          filter="url(#shadow)"
        />

        {/* Hokkaido */}
        <path
          d="M 275,92
             L 280,75 L 295,58 L 318,42
             L 340,40 L 355,56
             L 353,80 L 336,98
             L 312,108 L 288,104
             Z"
          fill="url(#island-fill)"
          stroke="#5C3D1E"
          strokeWidth="1.5"
          strokeLinejoin="round"
          filter="url(#shadow)"
        />

        {/* Awaji Island (small, in Inland Sea) */}
        <ellipse cx="174" cy="370" rx="5" ry="9" fill="#B89460" stroke="#5C3D1E" strokeWidth="1" />

        {/* ── Map labels ──────────────────────────────────────────────── */}
        <text x="22" y="30" fontFamily="serif" fontSize="11" fill="#D4AF37" opacity="0.9" letterSpacing="3">
          戦国時代
        </text>
        <text x="22" y="44" fontFamily="serif" fontSize="7" fill="#7A5530" letterSpacing="2" opacity="0.8">
          SENGOKU JAPAN
        </text>

        {/* Compass */}
        <g transform="translate(332, 28)">
          <circle r="12" fill="#0f0c08" stroke="#3a2a18" strokeWidth="1" />
          <text x="0" y="-4" textAnchor="middle" fontSize="7" fill="#D4AF37" fontFamily="serif">N</text>
          <polygon points="-2,0 0,-8 2,0" fill="#D4AF37" opacity="0.9" />
          <polygon points="-2,0 0,8  2,0" fill="#5C3D1E" opacity="0.7" />
        </g>

        {/* Region labels (subtle context) */}
        <text x="192" y="268" fontFamily="serif" fontSize="7" fill="#7A5530" opacity="0.6" textAnchor="middle">畿内</text>
        <text x="248" y="318" fontFamily="serif" fontSize="7" fill="#7A5530" opacity="0.6" textAnchor="middle">東海</text>
        <text x="290" y="240" fontFamily="serif" fontSize="7" fill="#7A5530" opacity="0.6" textAnchor="middle">関東</text>
        <text x="88" y="432" fontFamily="serif" fontSize="7" fill="#7A5530" opacity="0.55" textAnchor="middle">九州</text>

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
