"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

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

const LOCATIONS = [
  { slug: "the-battle-of-okehazama",                        coordinates: [136.9, 35.0] as [number, number], label: "桶狭間", year: 1560 },
  { slug: "bushido-the-way-of-the-warrior",                 coordinates: [135.7, 35.0] as [number, number], label: "京都",   year: null },
  { slug: "the-lone-samurai-miyamoto-musashi",               coordinates: [130.9, 33.9] as [number, number], label: "巌流島", year: 1612 },
  { slug: "from-sandal-bearer-to-ruler-toyotomi-hideyoshi", coordinates: [135.5, 34.7] as [number, number], label: "大阪城", year: 1590 },
  { slug: "the-guns-of-nagashino",                          coordinates: [137.6, 34.9] as [number, number], label: "長篠",   year: 1575 },
  { slug: "the-battle-that-made-japan-sekigahara",          coordinates: [136.4, 35.4] as [number, number], label: "関ヶ原", year: 1600 },
  { slug: "the-betrayal-at-honnoji",                        coordinates: [135.7, 35.0] as [number, number], label: "本能寺", year: 1582 },
  { slug: "hattori-hanzo-and-the-ninja-of-iga",             coordinates: [136.1, 34.8] as [number, number], label: "伊賀",   year: null },
  { slug: "ii-naotora-the-female-lord",                     coordinates: [137.7, 34.7] as [number, number], label: "遠江",   year: null },
  { slug: "tokugawa-ieyasu-the-patience-of-the-crane",      coordinates: [137.2, 34.8] as [number, number], label: "三河",   year: null },
  { slug: "takeda-shingen-the-tiger-of-kai",                coordinates: [138.6, 35.7] as [number, number], label: "甲斐",   year: null },
  { slug: "the-art-of-seppuku",                             coordinates: [135.5, 34.7] as [number, number], label: "京",     year: null },
  { slug: "yasuke-the-african-samurai",                     coordinates: [136.1, 35.1] as [number, number], label: "安土",   year: null },
  { slug: "the-forty-seven-ronin",                          coordinates: [139.7, 35.7] as [number, number], label: "江戸",   year: 1703 },
];

export function SengokuMap({ stories, completedSlugs, isPremium }: Props) {
  const router = useRouter();
  const completedSet = new Set(completedSlugs);
  const storyBySlug = new Map(stories.map((s) => [s.slug, s]));
  const [active, setActive] = useState<string | null>(null);

  const activeStory = active ? storyBySlug.get(active) : null;
  const activeLoc = active ? LOCATIONS.find((l) => l.slug === active) : null;
  const activeCompleted = active ? completedSet.has(active) : false;
  const activeLocked = activeStory?.isPremium && !isPremium;

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="rounded-xl overflow-hidden bg-[#0a0906]">
        <div className="px-3 pt-3">
          <p className="text-[10px] text-shogun-gold uppercase tracking-[0.3em] font-bold mb-1">戦国時代 · Sengoku Japan</p>
        </div>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            center: [137, 37],
            scale: 1800,
          }}
          width={360}
          height={460}
          style={{ background: "#0a0906" }}
        >
          <ZoomableGroup zoom={1} minZoom={1} maxZoom={1}>
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies
                  .filter((geo) => geo.properties.name === "Japan")
                  .map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#7A5530"
                      stroke="#5C3D1E"
                      strokeWidth={0.8}
                      style={{
                        default: { fill: "#7A5530", outline: "none" },
                        hover:   { fill: "#7A5530", outline: "none" },
                        pressed: { fill: "#7A5530", outline: "none" },
                      }}
                    />
                  ))
              }
            </Geographies>

            {LOCATIONS.map((loc) => {
              const story = storyBySlug.get(loc.slug);
              if (!story) return null;

              const completed = completedSet.has(loc.slug);
              const locked = story.isPremium && !isPremium;
              const isActive = active === loc.slug;

              const markerColor = completed ? "#D4AF37" : locked ? "#2a2018" : "#8B6040";
              const strokeColor = completed ? "#FFD700" : locked ? "#3a2a18" : "#C4A97A";

              return (
                <Marker
                  key={loc.slug}
                  coordinates={loc.coordinates}
                  onClick={() => router.push(locked ? "/pricing" : `/stories/${loc.slug}`)}
                  onMouseEnter={() => setActive(loc.slug)}
                  onMouseLeave={() => setActive(null)}
                >
                  <circle
                    r={isActive ? 7 : 5}
                    fill={markerColor}
                    stroke={strokeColor}
                    strokeWidth={isActive ? 2 : 1.5}
                    style={{ cursor: "pointer", transition: "all 0.15s ease" }}
                  />
                  <text
                    textAnchor="middle"
                    y={-10}
                    style={{
                      fontFamily: "serif",
                      fontSize: "8px",
                      fill: completed ? "#D4AF37" : locked ? "#4a3828" : "#C4A97A",
                      pointerEvents: "none",
                      userSelect: "none",
                    }}
                  >
                    {loc.label}
                  </text>
                </Marker>
              );
            })}
          </ZoomableGroup>
        </ComposableMap>
      </div>

      {/* Active story panel */}
      {activeStory && activeLoc && (
        <div className={`mt-3 rounded-lg px-4 py-3 border transition-all duration-200 ${
          activeCompleted ? "bg-yellow-950/40 border-shogun-gold/40"
          : activeLocked  ? "bg-gray-900 border-gray-800"
          : "bg-gray-900 border-gray-700"
        }`}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className={`text-xs font-bold uppercase tracking-wider mb-0.5 ${
                activeCompleted ? "text-shogun-gold" : activeLocked ? "text-gray-600" : "text-gray-400"
              }`}>
                {activeLoc.label}{activeLoc.year ? ` · ${activeLoc.year}` : ""}
              </p>
              <p className="text-sm font-semibold text-white leading-snug truncate">
                {activeStory.title}
              </p>
            </div>
            <span className={`text-xs shrink-0 px-2 py-1 rounded font-bold ${
              activeCompleted ? "bg-yellow-800/50 text-shogun-gold"
              : activeLocked  ? "bg-gray-800 text-gray-600"
              : "bg-gray-800 text-gray-400"
            }`}>
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
