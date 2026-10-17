import { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";

export default function Toast({ text, onDone }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 3200);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="toast" role="status">
      <CheckCircle2 size={18} aria-hidden="true" />
      {text}
    </div>
  );
}
