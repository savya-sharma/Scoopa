// A ticket-shaped sticker with zigzag ends: two big lines, an optional line
// of small print, and an optional oval badge stuck on its corner. Decorative
// (its words are repeated in, or not needed by, the section around it).
// Styles: app/styles/ui/ticket.css · each section places it itself.
//   lines:  the big lines (an array, one item per line)
//   small:  the small print under them
//   badge:  a word in a yellow oval on its lower-right corner
//   tone:   "yellow" | "teal"
export default function Ticket({ lines, small, badge, tone = "yellow", className = "" }) {
  return (
    <p className={`ticket ticket--${tone} ${className}`} aria-hidden="true">
      <span className="ticket-big">
        {lines.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </span>
      {small && <span className="ticket-small">{small}</span>}
      {badge && <span className="ticket-badge">{badge}</span>}
    </p>
  );
}
