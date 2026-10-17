import { useState } from "react";
import { RotateCw } from "lucide-react";

// Click (or press Enter/Space) to flip the card and see more detail
export default function StatCard({ icon: Icon, tone, label, value, backTitle, backText }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      type="button"
      className={`stat-card tone-${tone}${flipped ? " is-flipped" : ""}`}
      onClick={() => setFlipped((f) => !f)}
      aria-pressed={flipped}
    >
      <span className="stat-inner">
        <span className="stat-face stat-front" aria-hidden={flipped}>
          <span className="stat-icon">
            <Icon size={22} aria-hidden="true" />
          </span>
          <span className="stat-text">
            <span className="stat-label">{label}</span>
            <span className="stat-value">{value}</span>
          </span>
          <RotateCw size={14} className="flip-hint" aria-hidden="true" />
        </span>
        <span className="stat-face stat-back" aria-hidden={!flipped}>
          <span className="stat-back-label">{label}</span>
          <span className="stat-back-title">{backTitle}</span>
          <span className="stat-back-text">{backText}</span>
        </span>
      </span>
    </button>
  );
}
