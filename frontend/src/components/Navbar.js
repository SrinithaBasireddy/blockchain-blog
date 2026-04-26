import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import { Layers, PenLine, ShieldCheck, LogOut, LogIn, Search, X } from "lucide-react";

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const loc = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (q.trim()) { navigate(`/search?q=${encodeURIComponent(q.trim())}`); setQ(""); setSearchOpen(false); }
  };

  const navLinks = [
    { to: "/posts", label: "Posts", icon: <Layers size={15}/> },
    { to: "/verify", label: "Verify", icon: <ShieldCheck size={15}/> },
  ];

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 200,
      background: scrolled ? "rgba(242,242,247,0.82)" : "rgba(242,242,247,0.6)",
      backdropFilter: "blur(24px) saturate(180%)",
      WebkitBackdropFilter: "blur(24px) saturate(180%)",
      borderBottom: scrolled ? "1px solid rgba(60,60,67,0.12)" : "1px solid transparent",
      transition: "all 0.3s var(--ease-ios)",
    }}>
      <div className="container" style={{
        display: "flex", alignItems: "center", gap: 12, height: 56
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", marginRight: 4 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: "linear-gradient(135deg, #007aff, #5856d6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,122,255,0.35)"
          }}>
            <Layers size={16} color="#fff"/>
          </div>
          <span style={{ fontWeight: 700, fontSize: 17, letterSpacing: "-0.03em", color: "var(--ios-label)" }}>
            Block<span style={{ color: "var(--ios-blue)" }}>Blog</span>
          </span>
        </Link>

        {/* Nav links */}
        <nav style={{ display: "flex", gap: 4, flex: 1 }}>
          {navLinks.map(({ to, label, icon }) => (
            <Link key={to} to={to} className="btn btn-ghost" style={{
              padding: "7px 14px", fontSize: 14, borderRadius: 10,
              background: loc.pathname === to ? "rgba(0,122,255,0.12)" : undefined,
              color: loc.pathname === to ? "var(--ios-blue)" : "var(--ios-label2)"
            }}>
              {icon} {label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Search toggle */}
          {searchOpen ? (
            <form onSubmit={handleSearch} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ position: "relative" }}>
                <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--ios-gray2)" }}/>
                <input
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search posts…"
                  style={{
                    height: 34, paddingLeft: 32, paddingRight: 12,
                    border: "1.5px solid var(--ios-blue)",
                    borderRadius: 10, outline: "none",
                    fontFamily: "var(--font)", fontSize: 14,
                    background: "#fff", color: "var(--ios-label)",
                    boxShadow: "0 0 0 3px rgba(0,122,255,0.15)",
                    transition: "all 0.2s",
                    width: 200,
                  }}
                />
              </div>
              <button type="button" onClick={() => setSearchOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ios-gray)", padding: 4 }}>
                <X size={16}/>
              </button>
            </form>
          ) : (
            <button onClick={() => setSearchOpen(true)} className="btn btn-ghost"
              style={{ padding: 8, borderRadius: 10 }}>
              <Search size={16}/>
            </button>
          )}

          {user ? (
            <>
              <Link to="/write" className="btn btn-primary" style={{ padding: "8px 16px", fontSize: 14 }}>
                <PenLine size={14}/> Write
              </Link>
              <button onClick={() => { logoutUser(); navigate("/"); }}
                className="btn btn-ghost" style={{ padding: 8, borderRadius: 10 }}
                title={`Log out ${user.username}`}>
                <LogOut size={16}/>
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{ padding: "8px 16px", fontSize: 14 }}>
              <LogIn size={14}/> Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
