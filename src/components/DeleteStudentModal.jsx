import { useState } from "react";
import { Trash2 } from "lucide-react";
import Modal from "./Modal.jsx";

export default function DeleteStudentModal({ student, onConfirm, onClose }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    setDeleting(true);
    setError("");
    try {
      await onConfirm();
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  }

  return (
    <Modal title="Delete Student" onClose={onClose} size="sm">
      <div className="confirm">
        <span className="confirm-icon">
          <Trash2 size={24} aria-hidden="true" />
        </span>
        <p className="confirm-title">Are you sure you want to delete {student.studentName}?</p>
        <p className="confirm-text">This can't be undone. The student's record will be permanently removed from the database.</p>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <div className="form-actions">
          <button type="button" className="btn btn-light" onClick={onClose} data-autofocus>
            Cancel
          </button>
          <button type="button" className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
