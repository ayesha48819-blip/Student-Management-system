import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { SUBJECTS } from "../constants.js";

// Multi-select with removable chips, like the mockup
export default function SubjectSelect({ id, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const options = [...new Set([...SUBJECTS, ...value])];

  useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (e) => {
      if (!ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [open]);

  const toggle = (subject) =>
    onChange(value.includes(subject) ? value.filter((s) => s !== subject) : [...value, subject]);

  function handleKeyDown(e) {
    if (e.key === "Escape" && open) {
      e.stopPropagation(); // close the list, not the whole modal
      setOpen(false);
    }
  }

  return (
    <div className="multi" ref={ref} onKeyDown={handleKeyDown}>
      <div className={`multi-control${open ? " is-open" : ""}`}>
        <div className="multi-chips" onClick={() => setOpen(true)}>
          {value.length ? (
            value.map((subject) => (
              <span className="chip chip-removable" key={subject}>
                {subject}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggle(subject);
                  }}
                  aria-label={`Remove ${subject}`}
                >
                  <X size={12} />
                </button>
              </span>
            ))
          ) : (
            <span className="multi-placeholder">Select subjects (multiple)</span>
          )}
        </div>
        <button
          type="button"
          id={id}
          className="multi-toggle"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-label="Choose subjects"
        >
          <ChevronDown size={16} />
        </button>
      </div>

      {open && (
        <ul className="multi-menu" role="listbox" aria-multiselectable="true" aria-label="Subjects">
          {options.map((subject) => {
            const selected = value.includes(subject);
            return (
              <li key={subject} role="option" aria-selected={selected}>
                <button type="button" onClick={() => toggle(subject)} className={selected ? "is-selected" : ""}>
                  {subject}
                  {selected && <Check size={15} aria-hidden="true" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
