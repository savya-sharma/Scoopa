import { Fragment } from "react";

// Renders copy stored as lines (see data/siteContent.js): each item after the
// first starts on a new line. A plain string renders as it is.
export default function Lines({ text }) {
  if (!Array.isArray(text)) return text;
  return text.map((line, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {line}
    </Fragment>
  ));
}

// The same copy as one string, for labels (aria-label, alt, title)
export const asText = (text) => (Array.isArray(text) ? text.join(" ") : text);
