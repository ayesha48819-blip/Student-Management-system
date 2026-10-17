import { Link } from "react-router-dom";
import { BookOpen, Plus, UserCheck, Users, Wallet } from "lucide-react";
import StatCard from "../components/StatCard.jsx";
import StudentTable from "../components/StudentTable.jsx";
import { formatFee } from "../constants.js";

function getStats(students) {
  const total = students.length;
  const now = new Date();
  const addedThisMonth = students.filter((s) => {
    const d = new Date(s.createdAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const perCourse = {};
  students.forEach((s) => (perCourse[s.courseName] = (perCourse[s.courseName] || 0) + 1));
  const [topCourse, topCount] = Object.entries(perCourse).sort((a, b) => b[1] - a[1])[0] || [];

  const active = students.filter((s) => s.status !== "Inactive").length;
  const totalFees = students.reduce((sum, s) => sum + Number(s.feeStructure || 0), 0);

  return { total, addedThisMonth, courses: Object.keys(perCourse).length, topCourse, topCount, active, totalFees };
}

export default function Dashboard({ students, ...tableProps }) {
  const s = getStats(students);
  const show = (value) => (tableProps.loading ? "–" : value);

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Student Management System</h1>
          <p>Manage your students easily and efficiently.</p>
        </div>
        <Link to="/add" className="btn btn-primary">
          <Plus size={17} aria-hidden="true" />
          Add Student
        </Link>
      </div>

      <section className="stats" aria-label="Summary">
        <StatCard
          icon={Users}
          tone="blue"
          label="Total Students"
          value={show(s.total)}
          backTitle={`${s.addedThisMonth} added this month`}
          backText="All student records saved in MongoDB."
        />
        <StatCard
          icon={BookOpen}
          tone="green"
          label="Courses"
          value={show(s.courses)}
          backTitle={s.topCourse || "No courses yet"}
          backText={s.topCourse ? `Most popular, ${s.topCount} student${s.topCount === 1 ? "" : "s"}` : "Add a student to see courses."}
        />
        <StatCard
          icon={UserCheck}
          tone="purple"
          label="Active"
          value={show(s.active)}
          backTitle={`${s.total ? Math.round((s.active / s.total) * 100) : 0}% of all students`}
          backText={`${s.total - s.active} marked inactive`}
        />
        <StatCard
          icon={Wallet}
          tone="red"
          label="Total Fees"
          value={show(formatFee(s.totalFees))}
          backTitle={`Average ${formatFee(s.total ? Math.round(s.totalFees / s.total) : 0)}`}
          backText="Fee per student, on average."
        />
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2>Recent Students</h2>
          <Link to="/students" className="link">
            View all
          </Link>
        </div>
        <StudentTable students={students.slice(0, 6)} {...tableProps} />
      </section>
    </>
  );
}
