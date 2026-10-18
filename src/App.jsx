import { useEffect, useMemo, useState } from "react";
import {
  GraduationCap, LayoutDashboard, Users, UserPlus, Search, Pencil,
  Trash2, BookOpen, Clock3, Wallet, X, Menu, RefreshCw, CheckCircle2,
  AlertCircle, ChevronRight
} from "lucide-react";

// Same address works locally (Vite proxy) and on Vercel
const API_URL = "/api";

const blankForm = {
  studentName: "", email: "", fatherName: "", courseName: "",
  feeStructure: "", subjects: "", classTiming: ""
};

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Request failed. Check the API server.");
  return data;
}

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(blankForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [activePage, setActivePage] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  async function loadStudents() {
    setLoading(true);
    try {
      const data = await request("/students");
      setStudents(data);
    } catch (error) {
      setNotice({ type: "error", text: `${error.message} Make sure MongoDB and the backend are running.` });
    } finally { setLoading(false); }
  }

  useEffect(() => { loadStudents(); }, []);

  const filteredStudents = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return students;
    return students.filter(s =>
      [s.studentName, s.email, s.fatherName, s.courseName, ...(s.subjects || [])]
        .some(value => String(value || "").toLowerCase().includes(term))
    );
  }, [students, search]);

  const totalFees = students.reduce((sum, s) => sum + Number(s.feeStructure || 0), 0);
  const courseCount = new Set(students.map(s => s.courseName).filter(Boolean)).size;

  function openAdd() {
    setEditingId(null);
    setForm(blankForm);
    setFormOpen(true);
    setActivePage("add");
    setSidebarOpen(false);
  }

  function openEdit(student) {
    setEditingId(student._id);
    setForm({
      studentName: student.studentName || "",
      email: student.email || "",
      fatherName: student.fatherName || "",
      courseName: student.courseName || "",
      feeStructure: String(student.feeStructure ?? ""),
      subjects: (student.subjects || []).join(", "),
      classTiming: student.classTiming || ""
    });
    setFormOpen(true);
  }

  function showPage(page) {
    setActivePage(page);
    setSidebarOpen(false);
    if (page === "add") openAdd();
    else setFormOpen(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setNotice(null);
    const payload = {
      ...form,
      feeStructure: Number(form.feeStructure),
      subjects: form.subjects.split(",").map(s => s.trim()).filter(Boolean)
    };
    try {
      if (editingId) {
        await request(`/students/${editingId}`, { method: "PUT", body: JSON.stringify(payload) });
        setNotice({ type: "success", text: "Student details updated successfully." });
      } else {
        await request("/students", { method: "POST", body: JSON.stringify(payload) });
        setNotice({ type: "success", text: "New student added to the database." });
      }
      setForm(blankForm);
      setEditingId(null);
      setFormOpen(false);
      setActivePage("students");
      await loadStudents();
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    } finally { setSaving(false); }
  }

  async function handleDelete(student) {
    if (!window.confirm(`Delete ${student.studentName}'s record permanently?`)) return;
    try {
      await request(`/students/${student._id}`, { method: "DELETE" });
      setNotice({ type: "success", text: "Student record deleted from the database." });
      await loadStudents();
    } catch (error) { setNotice({ type: "error", text: error.message }); }
  }

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "add", label: "Add Student", icon: UserPlus },
    { id: "students", label: "All Students", icon: Users }
  ];

  return (
    <div className="app-shell">
      {sidebarOpen && <button className="mobile-scrim" aria-label="Close menu" onClick={() => setSidebarOpen(false)} />}
      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="brand"><span className="brand-mark"><GraduationCap size={23} /></span><span>Student<span className="brand-light">Manager</span></span></div>
        <div className="workspace-label">WORKSPACE</div>
        <nav>
          {navItems.map(item => {
            const Icon = item.icon;
            return <button key={item.id} className={`nav-item ${activePage === item.id ? "active" : ""}`} onClick={() => showPage(item.id)}><Icon size={18} /><span>{item.label}</span>{activePage === item.id && <ChevronRight size={16} className="nav-chevron" />}</button>;
          })}
        </nav>
        <div className="sidebar-bottom">
          <div className="profile-avatar">AN</div>
          <div className="profile-copy"><strong>Project Workspace</strong><span>MERN Stack</span></div>
          <span className="online-dot" title="Local workspace" />
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="menu-toggle icon-button" onClick={() => setSidebarOpen(true)} aria-label="Open menu"><Menu size={21} /></button>
          <div><div className="breadcrumb">Workspace <span>/</span> <strong>{navItems.find(n => n.id === activePage)?.label || "Dashboard"}</strong></div><h1>{activePage === "dashboard" ? "Student Management System" : activePage === "add" ? (editingId ? "Edit Student" : "Add New Student") : "All Students"}</h1></div>
          <div className="topbar-right"><span className="status-pill"><span /> API-connected UI</span><div className="top-avatar">A</div><div className="top-user"><strong>Ayesha</strong><span>Admin</span></div></div>
        </header>

        <div className="content">
          {notice && <div className={`notice ${notice.type}`}><span>{notice.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}</span><p>{notice.text}</p><button aria-label="Dismiss notification" onClick={() => setNotice(null)}><X size={17} /></button></div>}

          {activePage === "dashboard" && !formOpen && <>
            <section className="welcome-panel">
              <div className="welcome-icon"><GraduationCap size={30} /></div>
              <div className="welcome-copy"><p className="eyebrow">YOUR ACADEMIC WORKSPACE</p><h2>Welcome back, Ayesha <span></span></h2><p>Manage student records, courses, and fee details in one place.</p></div>
              <button className="primary-button" onClick={openAdd}><UserPlus size={17} /> Add Student</button>
              <div className="welcome-orb orb-one" /><div className="welcome-orb orb-two" />
            </section>
            <section className="stats-grid">
              <StatCard icon={<Users size={21}/>} label="Total Students" value={students.length} note="Saved student records" backText="Students registered in your database" tone="blue" />
              <StatCard icon={<BookOpen size={21}/>} label="Active Courses" value={courseCount} note="Unique courses listed" backText="Different courses currently offered" tone="green" />
              <StatCard icon={<Wallet size={21}/>} label="Total Fee Value" value={`Rs ${totalFees.toLocaleString("en-PK")}`} note="Sum of listed fees" backText="Combined fee of all students" tone="amber" />
              <StatCard icon={<Clock3 size={21}/>} label="Class Schedules" value={new Set(students.map(s => s.classTiming).filter(Boolean)).size} note="Unique timings" backText="Different class timings in use" tone="purple" />
            </section>
            <section className="panel recent-panel">
              <div className="panel-heading"><div><p className="eyebrow">RECORDS OVERVIEW</p><h2>Recently Added Students</h2></div><button className="text-button" onClick={() => showPage("students")}>View all students <ChevronRight size={16}/></button></div>
              <StudentTable students={students.slice(0, 5)} loading={loading} onEdit={openEdit} onDelete={handleDelete} compact />
              {students.length === 0 && !loading && <EmptyState onAdd={openAdd} />}
            </section>
          </>}

          {(activePage === "students" || (activePage === "dashboard" && formOpen)) && !formOpen && <section className="panel students-panel">
            <div className="panel-heading list-heading"><div><p className="eyebrow">STUDENT DIRECTORY</p><h2>All Students <span className="count-badge">{students.length}</span></h2><p className="subheading">Student information fetched from your MongoDB database.</p></div><button className="primary-button" onClick={openAdd}><UserPlus size={17}/> Add Student</button></div>
            <div className="table-toolbar"><div className="search-box"><Search size={18}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, email, course..." /></div><button className="secondary-button" onClick={loadStudents}><RefreshCw size={16}/> Refresh</button></div>
            <StudentTable students={filteredStudents} loading={loading} onEdit={openEdit} onDelete={handleDelete} />
            {!loading && filteredStudents.length === 0 && <EmptyState onAdd={openAdd} searched={Boolean(search)} />}
            <div className="table-footer"><span>Showing <strong>{filteredStudents.length}</strong> of <strong>{students.length}</strong> records</span><span className="database-note"><span className="online-dot"/> Stored in MongoDB</span></div>
          </section>}

          {formOpen && <section className="form-layout">
            <div className="panel form-panel">
              <div className="panel-heading"><div><p className="eyebrow">{editingId ? "UPDATE RECORD" : "NEW RECORD"}</p><h2>{editingId ? "Edit student details" : "Student information"}</h2><p className="subheading">Fields marked with * are required.</p></div><button className="icon-button close-form" onClick={() => {setFormOpen(false);setActivePage("students");}} aria-label="Close form"><X size={19}/></button></div>
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <Field label="Student Name" required><input required maxLength="100" value={form.studentName} onChange={e => setForm({...form, studentName:e.target.value})} placeholder="e.g. Ahmed Khan" /></Field>
                  <Field label="Email Address" required><input required type="email" maxLength="150" value={form.email} onChange={e => setForm({...form, email:e.target.value})} placeholder="student@example.com" /></Field>
                  <Field label="Father's Name" required><input required maxLength="100" value={form.fatherName} onChange={e => setForm({...form, fatherName:e.target.value})} placeholder="e.g. Rashid Khan" /></Field>
                  <Field label="Course Name" required><select required value={form.courseName} onChange={e => setForm({...form, courseName:e.target.value})}><option value="">Select a course</option><option>BS Computer Science</option><option>BS Software Engineering</option><option>BS Data Science</option><option>Web Development</option><option>MERN Stack Development</option><option>Other</option></select></Field>
                  <Field label="Fee Structure (PKR)" required><div className="input-prefix"><span>Rs</span><input required type="number" min="0" step="1" value={form.feeStructure} onChange={e => setForm({...form, feeStructure:e.target.value})} placeholder="60000" /></div></Field>
                  <Field label="Subjects" required hint="Separate subjects with commas"><input required value={form.subjects} onChange={e => setForm({...form, subjects:e.target.value})} placeholder="e.g. Math, Physics, Computer Science" /></Field>
                  <Field label="Class Timing" required><select required value={form.classTiming} onChange={e => setForm({...form, classTiming:e.target.value})}><option value="">Select class timing</option><option>08:00 AM - 10:00 AM</option><option>10:00 AM - 12:00 PM</option><option>01:00 PM - 03:00 PM</option><option>03:00 PM - 05:00 PM</option><option>06:00 PM - 08:00 PM</option><option>Flexible / Online</option></select></Field>
                </div>
                <div className="form-actions"><button type="button" className="secondary-button" onClick={() => {setFormOpen(false);setActivePage("students");}}>Cancel</button><button className="primary-button" disabled={saving}>{saving ? "Saving..." : editingId ? <><Pencil size={16}/> Update Student</> : <><UserPlus size={17}/> Save Student</>}</button></div>
              </form>
            </div>
            <aside className="form-side">
              <div className="tip-card"><div className="tip-icon"><CheckCircle2 size={20}/></div><h3>Keep records accurate</h3><p>Use a valid email address. Duplicate emails are not allowed.</p></div>
              <div className="tip-card blue-tip"><div className="tip-icon"><Wallet size={20}/></div><h3>Fee information</h3><p>Enter the fee as a number in PKR. It will be saved to the database.</p></div>
              <div className="form-progress"><span>FORM CHECKLIST</span><p><CheckCircle2 size={15}/> Personal details</p><p><CheckCircle2 size={15}/> Course & fee details</p><p><CheckCircle2 size={15}/> Class schedule</p></div>
            </aside>
          </section>}
          <footer className="footer"><span>Student Manager <b>·</b> MERN Stack Final Project</span><span>React · Express · MongoDB</span></footer>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, note, backText, tone }) {
  const [flipped, setFlipped] = useState(false);
  const toggle = () => setFlipped(f => !f);

  return (
    <article
      className={`stat-card ${flipped ? "flipped" : ""}`}
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      onClick={toggle}
      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } }}
    >
      <div className="stat-inner">
        <div className="stat-front">
          <div className={`stat-icon ${tone}`}>{icon}</div>
          <div className="stat-info"><p>{label}</p><h3>{value}</h3><span>{note}</span></div>
        </div>
        <div className={`stat-back back-${tone}`}>
          <p className="back-label">{label}</p>
          <h3>{value}</h3>
          <span>{backText}</span>
        </div>
      </div>
    </article>
  );
}

function Field({ label, required, hint, children }) {
  return <label className="field"><span className="field-label">{label}{required && <b> *</b>}</span>{children}{hint && <small>{hint}</small>}</label>;
}

function StudentTable({ students, loading, onEdit, onDelete, compact = false }) {
  if (loading) return <div className="loading-state"><span className="spinner"/> Loading student records from the API...</div>;
  return <div className="table-wrap"><table><thead><tr><th>STUDENT</th><th>EMAIL</th><th>FATHER'S NAME</th><th>COURSE</th><th>FEE (PKR)</th>{!compact && <th>SUBJECTS</th>}<th>CLASS TIMING</th><th className="actions-head">ACTIONS</th></tr></thead><tbody>
    {students.map((s, index) => <tr key={s._id}><td><div className="student-cell"><span className={`student-avatar avatar-${index % 5}`}>{(s.studentName || "?").trim().charAt(0).toUpperCase()}</span><strong>{s.studentName}</strong></div></td><td className="email-cell">{s.email}</td><td>{s.fatherName}</td><td><span className="course-chip">{s.courseName}</span></td><td className="fee-cell">{Number(s.feeStructure || 0).toLocaleString("en-PK")}</td>{!compact && <td><div className="subject-list">{(s.subjects || []).join(", ")}</div></td>}<td><span className="time-cell"><Clock3 size={13}/>{s.classTiming}</span></td><td><div className="action-buttons"><button className="action-edit" title="Edit student" aria-label={`Edit ${s.studentName}`} onClick={() => onEdit(s)}><Pencil size={15}/></button><button className="action-delete" title="Delete student" aria-label={`Delete ${s.studentName}`} onClick={() => onDelete(s)}><Trash2 size={15}/></button></div></td></tr>)}
  </tbody></table></div>;
}

function EmptyState({ onAdd, searched }) {
  return <div className="empty-state"><div className="empty-icon"><Users size={26}/></div><h3>{searched ? "No matching students" : "No student records yet"}</h3><p>{searched ? "Try another name, email, or course." : "Add your first student to start building the directory."}</p>{!searched && <button className="primary-button" onClick={onAdd}><UserPlus size={16}/> Add First Student</button>}</div>;
}

export default App;