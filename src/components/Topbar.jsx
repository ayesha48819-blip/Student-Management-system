import { Menu, Search, UserRound } from "lucide-react";

export default function Topbar({ search, onSearch, onMenu }) {
  return (
    <header className="topbar">
      <button type="button" className="icon-btn menu-btn" onClick={onMenu} aria-label="Open menu">
        <Menu size={20} />
      </button>
      <label className="search">
        <Search size={17} aria-hidden="true" />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search students by name or email..."
          aria-label="Search students"
        />
      </label>
      <span className="avatar" title="Admin">
        <UserRound size={18} aria-hidden="true" />
      </span>
    </header>
  );
}
