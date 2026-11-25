// Scoopa's decorative shape language, drawn once as SVG symbols and reused
// across the page: a six-petal flower, a starburst badge, a perforated stamp
// with a smile, and a pair of googly eyes. Shapes take their colour from CSS
// `color` (currentColor); the eyes and the stamp's face keep their own.

export function ShapeDefs() {
  const holes = [];
  for (let k = 0; k <= 8; k++) {
    const p = 20 + k * 20;
    holes.push([p, 20], [p, 180], [20, p], [180, p]);
  }
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <symbol id="shape-flower" viewBox="0 0 200 200">
        <g fill="currentColor">
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <circle key={a} cx={100 + 52 * Math.cos((a * Math.PI) / 180)} cy={100 + 52 * Math.sin((a * Math.PI) / 180)} r="46" />
          ))}
          <circle cx="100" cy="100" r="54" />
        </g>
      </symbol>

      <symbol id="shape-burst" viewBox="0 0 200 200">
        <polygon
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinejoin="round"
          points={Array.from({ length: 32 }, (_, i) => {
            const r = i % 2 ? 80 : 96;
            const a = (i / 32) * Math.PI * 2;
            return `${100 + r * Math.cos(a)},${100 + r * Math.sin(a)}`;
          }).join(" ")}
        />
      </symbol>

      <symbol id="shape-stamp" viewBox="0 0 200 200">
        <mask id="stamp-holes">
          <rect width="200" height="200" fill="#fff" />
          {holes.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="7" fill="#000" />
          ))}
        </mask>
        <rect x="20" y="20" width="160" height="160" fill="currentColor" mask="url(#stamp-holes)" />
        <g fill="var(--face, #fff8e9)">
          <ellipse cx="72" cy="78" rx="9" ry="17" />
          <ellipse cx="100" cy="78" rx="9" ry="17" />
          <ellipse cx="128" cy="78" rx="9" ry="17" />
        </g>
        <path d="M 62 112 A 38 38 0 0 0 138 112" fill="none" stroke="var(--face, #fff8e9)" strokeWidth="13" strokeLinecap="round" />
      </symbol>

      <symbol id="shape-eyes" viewBox="0 0 200 220">
        <g stroke="#111" strokeWidth="10" fill="#fff">
          <ellipse cx="80" cy="86" rx="44" ry="70" transform="rotate(20 80 86)" />
          <ellipse cx="126" cy="138" rx="44" ry="70" transform="rotate(20 126 138)" />
        </g>
        <g fill="#111">
          <ellipse cx="96" cy="76" rx="22" ry="40" transform="rotate(20 96 76)" />
          <ellipse cx="142" cy="128" rx="22" ry="40" transform="rotate(20 142 128)" />
        </g>
        <g fill="#fff">
          <ellipse cx="84" cy="96" rx="6" ry="4" />
          <ellipse cx="130" cy="148" rx="6" ry="4" />
        </g>
      </symbol>
    </svg>
  );
}

// One decorative shape. name: flower | burst | stamp | eyes
export function Shape({ name, className, children }) {
  return (
    <div className={`shape ${className}`} aria-hidden={children ? undefined : true}>
      <svg viewBox={name === "eyes" ? "0 0 200 220" : "0 0 200 200"}>
        <use href={`#shape-${name}`} />
      </svg>
      {children && <span className="shape-label">{children}</span>}
    </div>
  );
}
