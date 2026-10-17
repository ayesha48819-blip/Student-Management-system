import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Topbar from "./components/Topbar.jsx";
import EditStudentModal from "./components/EditStudentModal.jsx";
import DeleteStudentModal from "./components/DeleteStudentModal.jsx";
import Toast from "./components/Toast.jsx";
import SignedOut from "./components/SignedOut.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AddStudent from "./pages/AddStudent.jsx";
import Students from "./pages/Students.jsx";
import * as api from "./services/api.js";

export default function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [toast, setToast] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [signedOut, setSignedOut] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  async function loadStudents() {
    setLoading(true);
    setLoadError("");
    try {
      setStudents(await api.getStudents());
    } catch (error) {
      setLoadError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const notify = (text) => setToast({ text, id: Date.now() });

  async function handleCreate(data) {
    const created = await api.createStudent(data);
    setStudents((list) => [created, ...list]);
    notify(`${created.studentName} added.`);
    navigate("/students");
  }

  async function handleUpdate(data) {
    const updated = await api.updateStudent(editing._id, data);
    setStudents((list) => list.map((s) => (s._id === updated._id ? updated : s)));
    setEditing(null);
    notify(`${updated.studentName}'s details updated.`);
  }

  async function handleDelete() {
    const student = deleting;
    await api.deleteStudent(student._id);
    setStudents((list) => list.filter((s) => s._id !== student._id));
    setDeleting(null);
    notify(`${student.studentName} deleted.`);
  }

  function handleSearch(value) {
    setSearch(value);
    if (value && location.pathname !== "/students") navigate("/students");
  }

  if (signedOut) {
    return (
      <SignedOut
        onSignIn={() => {
          setSignedOut(false);
          navigate("/");
        }}
      />
    );
  }

  const tableProps = { loading, error: loadError, onRetry: loadStudents, onEdit: setEditing, onDelete: setDeleting };

  return (
    <div className="shell">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} onLogout={() => setSignedOut(true)} />
      <div className="main">
        <Topbar search={search} onSearch={handleSearch} onMenu={() => setMenuOpen(true)} />
        <main className="content">
          <Routes>
            <Route path="/" element={<Dashboard students={students} {...tableProps} />} />
            <Route path="/add" element={<AddStudent onCreate={handleCreate} />} />
            <Route
              path="/students"
              element={<Students students={students} search={search} onClearSearch={() => setSearch("")} {...tableProps} />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {editing && <EditStudentModal student={editing} onSave={handleUpdate} onClose={() => setEditing(null)} />}
      {deleting && <DeleteStudentModal student={deleting} onConfirm={handleDelete} onClose={() => setDeleting(null)} />}
      {toast && <Toast key={toast.id} text={toast.text} onDone={() => setToast(null)} />}
    </div>
  );
}
