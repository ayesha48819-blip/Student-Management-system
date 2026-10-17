import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export default function Modal({ title, onClose, size = "md", children }) {
  const ref = useRef(null);

  useEffect(() => {
    const previous = document.activeElement;
    const first = ref.current.querySelector("[data-autofocus]") || ref.current.querySelector("input, select");
    first?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      previous?.focus?.();
    };
  }, []);

  return (
    <div
      className="overlay"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <div className={`modal modal-${size}`} role="dialog" aria-modal="true" aria-labelledby="modal-title" ref={ref}>
        <div className="modal-head">
          <h2 id="modal-title">{title}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
