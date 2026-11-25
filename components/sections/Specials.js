import { siteContent } from "@/data/siteContent";
import Treat from "@/components/ui/Treats";

const copy = siteContent.specials;

// The treats floating around the statement, placed in % of the statement's
// box (they can sit outside it). size: % of that box's width · rot: resting
// tilt · depth: how much it follows the pointer (0–1) · phone: [x, y] on
// narrow screens (gathered below the copy), or false = hidden there
const TREATS = [
  { kind: "scoop", flavour: "strawberry", sprinkles: true, x: -6, y: -34, size: 17, rot: -12, depth: 0.9, phone: [6, 112] },
  { kind: "scoop", flavour: "mint", x: 88, y: -42, size: 14, rot: 10, depth: 0.6, phone: [68, 108] },
  { kind: "cherry", x: 104, y: 18, size: 6, rot: 14, depth: 1, phone: [52, 128] },
  { kind: "scoop", flavour: "vanilla", sprinkles: true, x: -16, y: 70, size: 12, rot: 8, depth: 0.5, phone: false },
  { kind: "scoop", flavour: "chocolate", x: 92, y: 96, size: 11, rot: -10, depth: 0.7, phone: [34, 140] },
  { kind: "strawberry", x: 12, y: 112, size: 6, rot: -18, depth: 0.8, phone: [84, 142] },
  { kind: "sprinkles", x: 76, y: -8, size: 6, rot: 0, depth: 0.4, phone: false },
  { kind: "sprinkles", x: 0, y: 46, size: 5, rot: 40, depth: 0.3, phone: false },
];

// Specials, the homepage's sign-off: out of the navy, a wide teal arch
// (gently curved top, straight sides, open at the bottom), and the closing
// statement inside it, with a few treats floating around it.
// Motion: animations/specials.js.
//   scalloped: give its navy a scalloped top (like Our Story's), for the
//   inner pages where it follows a cream or yellow section, not Our Story
export default function Specials({ scalloped = false }) {
  return (
    <section className={`specials${scalloped ? " specials--scalloped" : ""}`} id="specials">
      <div className="specials-arch" />

      <div className="specials-statement">
        <div className="specials-treats" aria-hidden="true">
          {TREATS.map((t, i) => (
            <div
              key={i}
              className={`specials-treat${t.phone === false ? " specials-treat--wide" : ""}`}
              style={{ "--x": t.x, "--y": t.y, "--size": t.size, ...(t.phone ? { "--px": t.phone[0], "--py": t.phone[1] } : {}) }}
              data-rot={t.rot}
              data-depth={t.depth}
            >
              <div className="specials-treat-float">
                <Treat kind={t.kind} id={`treat-${i}`} flavour={t.flavour} sprinkles={t.sprinkles} />
              </div>
            </div>
          ))}
        </div>
        <h2 className="specials-heading">
          {copy.heading.map((line) => (
            <span key={line} className="specials-line">
              <span>{line}</span>
            </span>
          ))}
        </h2>
        <p className="specials-text">{copy.text}</p>
      </div>
    </section>
  );
}
