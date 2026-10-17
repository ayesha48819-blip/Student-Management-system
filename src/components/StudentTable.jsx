import { Link } from "react-router-dom";
import { Pencil, RefreshCw, Trash2, UserPlus } from "lucide-react";
import { formatFee } from "../constants.js";

const TONES = ["blue", "green", "purple", "red"];

// "Morning (9:00 AM - 12:00 PM)" -> two lines: "Morning" and the hours
function Timing({ value = "" }) {
  const match = value.match(/^(.*?)\s*\((.*)\)$/);
  if (!match) return value;
  return (
    <span className="stack">
      <span>{match[1]}</span>
      <span className="sub">{match[2]}</span>
    </span>
  );
}

export default function StudentTable({ students, loading, error, onRetry, onEdit, onDelete, detailed = false }) {
  if (loading) return <p className="state">Loading students...</p>;

  if (error) {
    return (
      <div className="state state-error" role="alert">
        <p>{error}</p>
        <button type="button" className="btn btn-light" onClick={onRetry}>
          <RefreshCw size={15} aria-hidden="true" />
          Try again
        </button>
      </div>
    );
  }

  if (!students.length) {
    return (
      <div className="state">
        <p>No students yet. Add your first student to get started.</p>
        <Link to="/add" className="btn btn-primary">
          <UserPlus size={16} aria-hidden="true" />
          Add Student
        </Link>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table className={detailed ? "is-detailed" : ""}>
        <thead>
          <tr>
            <th>#</th>
            <th>{detailed ? "Student" : "Name"}</th>
            {!detailed && <th>Email</th>}
            <th>Course</th>
            <th>Fee Structure</th>
            {detailed && <th>Subjects</th>}
            <th>Class Timing</th>
            {detailed && <th>Status</th>}
            <th className="col-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s, i) => (
            <tr key={s._id}>
              <td className="muted">{i + 1}</td>
              <td>
                <span className="name-cell">
                  <span className={`initial tone-${TONES[s.studentName.charCodeAt(0) % TONES.length]}`} aria-hidden="true">
                    {s.studentName.trim().charAt(0).toUpperCase()}
                  </span>
                  {detailed ? (
                    <span className="stack">
                      <span>{s.studentName}</span>
                      <span className="sub">{s.email}</span>
                    </span>
                  ) : (
                    s.studentName
                  )}
                </span>
              </td>
              {!detailed && <td className="muted">{s.email}</td>}
              <td className="nowrap">{s.courseName}</td>
              <td className="nowrap">{formatFee(s.feeStructure)}</td>
              {detailed && (
                <td>
                  <span className="chip-list">
                    {(s.subjects || []).map((subject) => (
                      <span className="chip" key={subject}>{subject}</span>
                    ))}
                  </span>
                </td>
              )}
              <td className={detailed ? "" : "nowrap"}>{detailed ? <Timing value={s.classTiming} /> : s.classTiming}</td>
              {detailed && (
                <td>
                  <span className={`badge ${s.status === "Inactive" ? "badge-off" : "badge-on"}`}>
                    {s.status || "Active"}
                  </span>
                </td>
              )}
              <td className="col-actions">
                <span className="row-actions">
                  <button type="button" className="action action-edit" onClick={() => onEdit(s)} aria-label={`Edit ${s.studentName}`} title="Edit">
                    <Pencil size={14} />
                  </button>
                  <button type="button" className="action action-delete" onClick={() => onDelete(s)} aria-label={`Delete ${s.studentName}`} title="Delete">
                    <Trash2 size={14} />
                  </button>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
