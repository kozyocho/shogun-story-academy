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

const GEO_URL = "https://raw.githubusercontent.com/dataofjapan/land/master/japan.geojson";

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
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState<[number, number]>([137, 37]);

  const activeStory = active ? storyBySlug.get(active) : null;
  const activeLoc = active ? LOCATIONS.find((l) => l.slug === active) : null;
  const activeCompleted = active ? completedSet.has(active) : false;
  const activeLocked = activeStory?.isPremium && !isPremium;

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="rounded-xl overflow-hidden bg-[#0d1b2a] relative">
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
          style={{ background: "#0d1b2a", width: "100%", height: "auto" }}
        >
          <ZoomableGroup
            zoom={zoom}
            center={center}
            minZoom={1}
            maxZoom={6}
            onMoveEnd={({ zoom: z, coordinates: c }) => {
              setZoom(z);
              setCenter(c as [number, number]);
            }}
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#8B6914"
                    stroke="#5C3D1E"
                    strokeWidth={0.3}
                    style={{
                      default: { fill: "#8B6914", outline: "none" },
                      hover:   { fill: "#8B6914", outline: "none" },
                      pressed: { fill: "#8B6914", outline: "none" },
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
                    r={isActive ? 7 / zoom : 5 / zoom}
                    fill={markerColor}
                    stroke={strokeColor}
                    strokeWidth={isActive ? 2 / zoom : 1.5 / zoom}
                    style={{ cursor: "pointer", transition: "all 0.15s ease" }}
                  />
                  {zoom >= 2 && (
                    <text
                      textAnchor="middle"
                      y={-10 / zoom}
                      style={{
                        fontFamily: "serif",
                        fontSize: `${10 / zoom}px`,
                        fill: completed ? "#D4AF37" : locked ? "#4a3828" : "#C4A97A",
                        pointerEvents: "none",
                        userSelect: "none",
                      }}
                    >
                      {loc.label}
                      {loc.year ? ` ${loc.year}` : ""}
                    </text>
                  )}
                </Marker>
              );
            })}
          </ZoomableGroup>
        </ComposableMap>

        {/* Zoom controls */}
        <div className="absolute bottom-3 right-3 flex flex-col gap-1">
          <button
            onClick={() => setZoom((z) => Math.min(z * 1.5, 6))}
            className="w-8 h-8 bg-black/60 text-shogun-gold border border-shogun-gold/30 rounded text-lg font-bold flex items-center justify-center hover:bg-black/80"
          >
            +
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(z / 1.5, 1))}
            className="w-8 h-8 bg-black/60 text-shogun-gold border border-shogun-gold/30 rounded text-lg font-bold flex items-center justify-center hover:bg-black/80"
          >
            −
          </button>
          <button
            onClick={() => { setZoom(1); setCenter([137, 37]); }}
            className="w-8 h-8 bg-black/60 text-gray-400 border border-gray-700 rounded text-xs flex items-center justify-center hover:bg-black/80"
          >
            ↺
          </button>
        </div>
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

      {/* Zoom hint */}
      <p className="text-center text-xs text-gray-600 mt-2 mb-1">
        Pinch or use +/− to zoom · Drag to pan
      </p>

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
