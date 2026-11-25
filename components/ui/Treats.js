// Little ice cream treats, drawn as shaded SVG so they read as soft 3D
// objects: a scoop (with or without sprinkles), a cherry, a strawberry and a
// sprinkle cluster. Each takes its colours from props, so one drawing serves
// every flavour. Used in the Specials arch (components/sections/Specials.js).
// ⚠️ PLACEHOLDER ART — stand-ins until real 3D renders are supplied; swap the
// <Treat> elements for <img> renders without changing the animation.

// a scoop's colours: base, light (highlight side), dark (shadow side)
export const SCOOPS = {
  strawberry: ["#ff7fb0", "#ffc2da", "#e0457f"],
  mint: ["#7fe0c8", "#c9f5ea", "#2fb597"],
  vanilla: ["#ffe7a3", "#fff6d8", "#efc35a"],
  chocolate: ["#8a4b32", "#c07a58", "#5c2c1c"],
  mango: ["#ffc23f", "#ffe49a", "#f29a1f"],
};

const SPRINKLES = ["#ff4f9a", "#16a995", "#ffc928", "#102070", "#ff7138", "#fff8e9"];

// a scoop: a soft dome over a scalloped, drippy base
function Scoop({ id, flavour, sprinkles }) {
  const [base, light, dark] = SCOOPS[flavour];
  return (
    <svg viewBox="0 0 200 180">
      <defs>
        <radialGradient id={`${id}-body`} cx="38%" cy="30%" r="80%">
          <stop offset="0" stopColor={light} />
          <stop offset="0.45" stopColor={base} />
          <stop offset="1" stopColor={dark} />
        </radialGradient>
      </defs>
      <path
        fill={`url(#${id}-body)`}
        d="M20 108C12 58 58 16 100 16s88 42 80 92c-3 17-17 14-24 24-6 12-20 10-26 1-8 15-26 17-32 4-7 14-28 12-31-2-8 9-24 6-25-6-13 4-21-5-22-21Z"
      />
      {/* the base's ridge, a little darker */}
      <path fill={dark} opacity="0.35" d="M24 112c14 6 30 3 44 8 14 5 30 4 44 0 16-5 34 1 48-6 9-4 15-8 18-8-3 13-15 13-22 22-6 12-20 10-26 1-8 15-26 17-32 4-7 14-28 12-31-2-8 9-24 6-25-6-10 3-17-3-18-13Z" />
      {/* soft highlight */}
      <ellipse cx="72" cy="52" rx="30" ry="16" fill="#fff" opacity="0.45" transform="rotate(-24 72 52)" />
      <ellipse cx="60" cy="44" rx="9" ry="5" fill="#fff" opacity="0.75" transform="rotate(-24 60 44)" />
      {sprinkles &&
        [
          [62, 82, 30], [96, 60, -20], [128, 76, 60], [110, 98, 10], [80, 104, -50], [146, 100, 25], [138, 52, -40], [48, 102, 70],
        ].map(([x, y, r], k) => (
          <rect key={k} x={x - 8} y={y - 3} width="16" height="6" rx="3" fill={SPRINKLES[k % SPRINKLES.length]} transform={`rotate(${r} ${x} ${y})`} />
        ))}
    </svg>
  );
}

function Cherry({ id }) {
  return (
    <svg viewBox="0 0 120 140">
      <defs>
        <radialGradient id={`${id}-c`} cx="35%" cy="35%" r="75%">
          <stop offset="0" stopColor="#ff8a8a" />
          <stop offset="0.5" stopColor="#e3263f" />
          <stop offset="1" stopColor="#a10f26" />
        </radialGradient>
      </defs>
      <path d="M62 62C62 36 74 14 96 6" fill="none" stroke="#3f7a2c" strokeWidth="6" strokeLinecap="round" />
      <path d="M92 8c10-6 22-2 24 6-10 6-20 4-24-6Z" fill="#5aa83c" />
      <circle cx="60" cy="92" r="40" fill={`url(#${id}-c)`} />
      <ellipse cx="46" cy="76" rx="11" ry="7" fill="#fff" opacity="0.55" transform="rotate(-30 46 76)" />
    </svg>
  );
}

function Strawberry({ id }) {
  return (
    <svg viewBox="0 0 120 140">
      <defs>
        <radialGradient id={`${id}-s`} cx="38%" cy="35%" r="80%">
          <stop offset="0" stopColor="#ff8f8f" />
          <stop offset="0.5" stopColor="#ef3b4a" />
          <stop offset="1" stopColor="#b51d2c" />
        </radialGradient>
      </defs>
      <path d="M60 136C30 120 10 86 14 58c3-22 22-30 46-30s43 8 46 30c4 28-16 62-46 78Z" fill={`url(#${id}-s)`} />
      {[[38, 60], [60, 54], [82, 60], [30, 82], [52, 80], [74, 80], [92, 82], [42, 102], [64, 102], [84, 100], [54, 120]].map(([x, y], k) => (
        <ellipse key={k} cx={x} cy={y} rx="2.6" ry="4" fill="#ffe49a" />
      ))}
      <path d="M60 32 38 18l14 16-24 0 22 8-12 14 22-14 22 14-12-14 22-8-24 0 14-16Z" fill="#4c9a35" />
      <ellipse cx="40" cy="58" rx="9" ry="5" fill="#fff" opacity="0.4" transform="rotate(-30 40 58)" />
    </svg>
  );
}

function SprinkleCluster() {
  return (
    <svg viewBox="0 0 100 100">
      {[[30, 30, 30], [62, 22, -40], [74, 56, 60], [40, 64, -10], [20, 82, 45], [66, 86, -60]].map(([x, y, r], k) => (
        <rect key={k} x={x - 10} y={y - 3.5} width="20" height="7" rx="3.5" fill={SPRINKLES[k % SPRINKLES.length]} transform={`rotate(${r} ${x} ${y})`} />
      ))}
    </svg>
  );
}

// kind: scoop | cherry | strawberry | sprinkles · id: unique per page (for gradients)
export default function Treat({ kind, id, flavour = "strawberry", sprinkles = false }) {
  if (kind === "scoop") return <Scoop id={id} flavour={flavour} sprinkles={sprinkles} />;
  if (kind === "cherry") return <Cherry id={id} />;
  if (kind === "strawberry") return <Strawberry id={id} />;
  return <SprinkleCluster />;
}
