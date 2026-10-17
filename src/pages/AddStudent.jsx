import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, CircleCheck, UserPlus, Wallet, X } from "lucide-react";
import StudentForm from "../components/StudentForm.jsx";

export default function AddStudent({ onCreate }) {
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const close = () => navigate("/students");

  // Ticks turn green as each part of the form is filled in
  const checklist = [
    { label: "Personal details", done: Boolean(form?.studentName && form.email && form.fatherName) },
    { label: "Course & fee details", done: Boolean(form?.courseName && form.feeStructure !== "" && form.subjects.length) },
    { label: "Class schedule", done: Boolean(form?.classTiming) }
  ];

  return (
    <div className="add-layout">
      <section className="panel form-panel">
        <div className="form-head">
          <div>
            <p className="eyebrow">New record</p>
            <h1 className="form-title">Student information</h1>
            <p className="form-sub">Fields marked with * are required.</p>
          </div>
          <button type="button" className="icon-btn icon-btn-outline" onClick={close} aria-label="Close form">
            <X size={18} />
          </button>
        </div>
        <StudentForm
          submitLabel={
            <>
              <UserPlus size={17} aria-hidden="true" />
              Save Student
            </>
          }
          savingLabel="Saving..."
          onSubmit={onCreate}
          onCancel={close}
          onFormChange={setForm}
        />
      </section>

      <aside className="add-aside" aria-label="Tips">
        <div className="tip-card">
          <span className="tip-icon tone-green">
            <CheckCircle2 size={20} aria-hidden="true" />
          </span>
          <h2>Keep records accurate</h2>
          <p>Use a valid email address. Duplicate emails are not allowed.</p>
        </div>

        <div className="tip-card tip-card-blue">
          <span className="tip-icon tone-blue">
            <Wallet size={20} aria-hidden="true" />
          </span>
          <h2>Fee information</h2>
          <p>Enter the fee as a number in PKR. It will be saved to the database.</p>
        </div>

        <div className="tip-card">
          <p className="eyebrow">Form checklist</p>
          <ul className="checklist">
            {checklist.map(({ label, done }) => (
              <li key={label} className={done ? "is-done" : ""}>
                <CircleCheck size={16} aria-hidden="true" />
                {label}
                <span className="sr-only">{done ? " (done)" : " (not done yet)"}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}