
import { Link, useLocation } from "react-router-dom";
import {
  House,
  Search,
  LayoutGrid,
  Bolt,
  BookmarkCheck,
} from "lucide-react";

import "../Styles/Navbar.css";

const navLinks = [
  { name: "Home", path: "/", Icon: House },
  { name: "Discover", path: "/search", Icon: Search },
  { name: "Categories", path: "/recommendation", Icon: LayoutGrid },
  { name: "Wishlist", path: "/wishlist", Icon: BookmarkCheck },
  { name: "Settings", path: "/settings", Icon: Bolt },
];

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname === path ||
        location.pathname.startsWith(`${path}/`);

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* LEFT - LOGO */}
        <Link to="/" className="nav-left">
          <img src="/logo01.png" className="logo" alt="Samanta E-Book Stall" />
          <h1>Samanta E-Book Stall</h1>
        </Link>

        {/* CENTER - DESKTOP LINKS / MOBILE ICONS */}
        <div className="nav-center">
          {navLinks.map(({ name, path, Icon }) => (
            <Link
              key={path}
              to={path}
              className={`nav-link ${isActive(path) ? "active" : ""}`}
              aria-label={name}
              aria-current={isActive(path) ? "page" : undefined}
              title={name}
            >
              <Icon className="nav-icon" size={22} strokeWidth={2} />
              <span className="nav-label">{name}</span>
            </Link>
          ))}
        </div>

        {/* RIGHT - ADMIN LOGIN */}
        <div className="nav-right">
          <Link to="/admin/login" className="signin-btn" target="_blank" rel="noopener noreferrer">
            Admin Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
