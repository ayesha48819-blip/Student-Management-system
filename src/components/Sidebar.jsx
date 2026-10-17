import { NavLink } from "react-router-dom";
import { GraduationCap, LayoutDashboard, LogOut, UserPlus, Users } from "lucide-react";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/add", label: "Add Student", icon: UserPlus },
  { to: "/students", label: "Students", icon: Users }
];

export default function Sidebar({ open, onClose, onLogout }) {
  return (
    <>
      {open && <div className="scrim" onClick={onClose} aria-hidden="true" />}
      <aside className={`sidebar${open ? " is-open" : ""}`}>
        <div className="brand">
          <GraduationCap size={26} aria-hidden="true" />
          <span>StudentMS</span>
        </div>
        <nav className="nav" aria-label="Main">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className="nav-link">
              <Icon size={18} aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>
        <button type="button" className="nav-link logout" onClick={onLogout}>
          <LogOut size={18} aria-hidden="true" />
          Logout
        </button>
      </aside>
    </>
  );
}
