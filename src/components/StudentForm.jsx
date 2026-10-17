import { useEffect, useState } from "react";
import SubjectSelect from "./SubjectSelect.jsx";
import { CLASS_TIMINGS, COURSES } from "../constants.js";

// Keep only the fields the form edits, so old records still load
const toForm = (s = {}) => ({
  studentName: s.studentName || "",
  email: s.email || "",
  fatherName: s.fatherName || "",
  courseName: s.courseName || "",
  feeStructure: s.feeStructure === undefined ? "" : String(s.feeStructure),
  subjects: s.subjects || [],
  classTiming: s.classTiming || "",
  status: s.status || "Active"
});

// Show a saved value even if it is no longer in the list
const withCurrent = (list, current) => (current && !list.includes(current) ? [current, ...list] : list);

function Field({ id, label, required, hint, children }) {
  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {required && <span className="req" aria-hidden="true"> *</span>}
      </label>
      {children}
      {hint && <small className="field-hint">{hint}</small>}
    </div>
  );
}

export default function StudentForm({ initial, submitLabel, savingLabel, onSubmit, onCancel, onFormChange }) {
  const [form, setForm] = useState(() => toForm(initial));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Lets the page react to typing (used by the Add Student checklist)
  useEffect(() => {
    onFormChange?.(form);
  }, [form, onFormChange]);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.subjects.length) {
      setError("Select at least one subject.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSubmit({ ...form, feeStructure: Number(form.feeStructure) });
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <Field id="studentName" label="Student Name" required>
        <input id="studentName" required maxLength={100} value={form.studentName} onChange={update("studentName")} placeholder="e.g. Ahmed Khan" />
      </Field>

      <Field id="email" label="Email Address" required>
        <input id="email" type="email" required maxLength={150} value={form.email} onChange={update("email")} placeholder="student@example.com" />
      </Field>

      <Field id="fatherName" label="Father's Name" required>
        <input id="fatherName" required maxLength={100} value={form.fatherName} onChange={update("fatherName")} placeholder="e.g. Rashid Khan" />
      </Field>

      <Field id="courseName" label="Course Name" required>
        <select id="courseName" required value={form.courseName} onChange={update("courseName")}>
          <option value="">Select a course</option>
          {withCurrent(COURSES, form.courseName).map((course) => (
            <option key={course}>{course}</option>
          ))}
        </select>
      </Field>

      <Field id="feeStructure" label="Fee Structure (PKR)" required>
        <div className="input-prefix">
          <span aria-hidden="true">Rs</span>
          <input id="feeStructure" type="number" required min="0" step="1" value={form.feeStructure} onChange={update("feeStructure")} placeholder="60000" />
        </div>
      </Field>

      <Field id="subjects" label="Subjects" required hint="Pick one or more subjects">
        <SubjectSelect id="subjects" value={form.subjects} onChange={(subjects) => setForm({ ...form, subjects })} />
      </Field>

      <Field id="classTiming" label="Class Timing" required>
        <select id="classTiming" required value={form.classTiming} onChange={update("classTiming")}>
          <option value="">Select class timing</option>
          {withCurrent(CLASS_TIMINGS, form.classTiming).map((timing) => (
            <option key={timing}>{timing}</option>
          ))}
        </select>
      </Field>

      <Field id="status" label="Status">
        <select id="status" value={form.status} onChange={update("status")}>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </Field>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <div className="form-actions">
        {onCancel && (
          <button type="button" className="btn btn-light" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className={`btn btn-primary${onCancel ? "" : " btn-block"}`} disabled={saving}>
          {saving ? savingLabel : submitLabel}
        </button>
      </div>
    </form>
  );
}