import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import StudentTable from "../components/StudentTable.jsx";

const matches = (student, term) =>
  [student.studentName, student.email, student.fatherName, student.courseName].some((value) =>
    (value || "").toLowerCase().includes(term)
  );

export default function Students({ students, search, onClearSearch, ...tableProps }) {
  const term = search.trim().toLowerCase();
  const shown = term ? students.filter((s) => matches(s, term)) : students;

  let summary = `${students.length} student${students.length === 1 ? "" : "s"} in the database.`;
  if (tableProps.loading) summary = "Loading students...";
  else if (term) summary = `${shown.length} of ${students.length} match "${search.trim()}".`;

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Students</h1>
          <p>{summary}</p>
        </div>
        <Link to="/add" className="btn btn-primary">
          <Plus size={17} aria-hidden="true" />
          Add Student
        </Link>
      </div>

      <section className="panel">
        {term && !shown.length && !tableProps.loading && !tableProps.error ? (
          <div className="state">
            <p>No students match "{search.trim()}". Try a different name or email.</p>
            <button type="button" className="btn btn-light" onClick={onClearSearch}>
              Clear search
            </button>
          </div>
        ) : (
          <StudentTable students={shown} detailed {...tableProps} />
        )}
      </section>
    </>
  );
}
