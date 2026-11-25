// A decorative sticker (public/illustrators/stickers/web) with a curled,
// folded-back corner that peels open as the page scrolls
// (animations/stickers.js). The artwork is never redrawn: the rig cuts and
// curls the original image.
//   n:      which sticker, 1–3
//   src, size: any other artwork instead of n (its path and [width, height])
//   corner: the corner that peels open: "tl", "tr", "bl" or "br"
//   rot:    its resting tilt, in degrees
//   pop:    true: instead of peeling, it pops onto the page (fully open)
//           as it scrolls into view; delay: seconds to wait before popping
//   className: places it (see styles/ui/stickers.css)
const SIZES = { 1: [396, 400], 2: [291, 400], 3: [380, 400] };

// The peeling flap is a chain of thin strips, each hinged to the one before
// it: bending each a little makes the curl. The last strip is the flat tail.
const STRIPS = 9;

// One strip: the artwork on its front, the sticker's underside on its back,
// and the next strip hinged to its far edge
function Strip({ left }) {
  return (
    <div className="peel-strip">
      <div className="peel-side peel-side--front">
        <div className="peel-art" />
      </div>
      <div className="peel-side peel-side--back">
        <div className="peel-art" />
      </div>
      {left > 1 && <Strip left={left - 1} />}
    </div>
  );
}

export default function Sticker({ n, src = `/illustrators/stickers/web/stick${n}.webp`, size = SIZES[n], corner, rot, pop = false, delay, className }) {
  const [w, h] = size;
  return (
    <div className={`sticker ${className}`} data-corner={corner} data-rot={rot} data-pop={pop ? (delay ?? 0) : undefined} aria-hidden="true">
      <div className="peel" style={{ "--src": `url(${src})` }}>
        {/* the part stuck to the page */}
        <div className="peel-stuck">
          <img className="peel-face" src={src} width={w} height={h} alt="" decoding="async" />
        </div>
        {/* shadow the lifted flap casts on the sticker and the page */}
        <div className="peel-shadow" />
        {/* the flap: curled up from the fold and folded back */}
        <div className="peel-frame">
          <Strip left={STRIPS} />
        </div>
      </div>
    </div>
  );
}
