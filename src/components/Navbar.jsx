import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo_work.png";

const NAV_LINKS = {
  jobseeker: [
    { to: "/jobs", label: "Browse Jobs" },
    { to: "/my-applications", label: "Applications" },
    { to: "/profile", label: "Profile" },
  ],
  recruiter: [
    { to: "/recruiter/dashboard", label: "Dashboard" },
    { to: "/recruiter/post-job", label: "Post a Job" },
    { to: "/recruiter/jobs", label: "My Jobs" },
    { to: "/profile", label: "Profile" },
  ],
  admin: [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/jobs", label: "Jobs" },
    { to: "/admin/users", label: "Users" },
  ],
};

const ROLE_META = {
  jobseeker: {
    label: "Jobseeker",
    accent: "#63b3ed",
    bg: "rgba(99,179,237,0.12)",
    avatarBg: "linear-gradient(135deg,#3b82f6,#6366f1)",
  },
  recruiter: {
    label: "Recruiter",
    accent: "#a78bfa",
    bg: "rgba(167,139,250,0.12)",
    avatarBg: "linear-gradient(135deg,#7c3aed,#a21caf)",
  },
  admin: {
    label: "Admin",
    accent: "#f472b6",
    bg: "rgba(244,114,182,0.12)",
    avatarBg: "linear-gradient(135deg,#db2777,#e11d48)",
  },
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);
  const isLanding = location.pathname === "/";

  // Detect scroll to switch between transparent and frosted
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target))
        setDropOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMenuOpen(false), [location.pathname]);

  const links = NAV_LINKS[user?.role] || [];
  const meta = ROLE_META[user?.role];
  const isActive = (to) =>
    location.pathname === to ||
    (to !== "/" && location.pathname.startsWith(to));

  /* ─── tiny helpers ─── */
  const Logo = () => (
    <Link
      to="/"
      style={{
        textDecoration: "none",
        display: "flex",
        alignItems: "center",
        gap: 0,
      }}
    >
      <span
        style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize: 22,
          letterSpacing: "-0.03em",
          lineHeight: 1,
          userSelect: "none",
        }}
      >
        <span
          style={{
            background: "linear-gradient(135deg,#63b3ed,#a78bfa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Work
        </span>
        <span style={{ color: "#e2e8f0" }}>zoko</span>
      </span>
    </Link>
  );

  const NavPill = ({ to, label }) => {
    const active = isActive(to);
    return (
      <Link
        to={to}
        style={{
          textDecoration: "none",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 14,
          fontWeight: active ? 500 : 400,
          color: active ? "#36454F" : "#64748b",
          padding: "7px 14px",
          borderRadius: 10,
          background: active ? "rgba(255,255,255,0.07)" : "transparent",
          border: active
            ? "1px solid rgba(255,255,255,0.1)"
            : "1px solid transparent",
          transition: "all 0.2s ease",
          whiteSpace: "nowrap",
          position: "relative",
        }}
        onMouseEnter={(e) => {
          if (!active) {
            e.currentTarget.style.color = "#cbd5e1";
            e.currentTarget.style.background = "rgba(255,255,255,0.04)";
          }
        }}
        onMouseLeave={(e) => {
          if (!active) {
            e.currentTarget.style.color = "#64748b";
            e.currentTarget.style.background = "transparent";
          }
        }}
      >
        {label}
        {active && (
          <span
            style={{
              position: "absolute",
              bottom: -1,
              left: "50%",
              transform: "translateX(-50%)",
              width: 20,
              height: 2,
              borderRadius: 999,
              background: "linear-gradient(90deg,#63b3ed,#a78bfa)",
            }}
          />
        )}
      </Link>
    );
  };

  /* ─── styles ─── */
  const navStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    transition:
      "background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease",

    background: scrolled && "rgba(240,240,240,0.82)",
    // backdropFilter:
    //   scrolled || !isLanding ? "blur(20px) saturate(180%)" : "none",
    // WebkitBackdropFilter:
    //   scrolled || !isLanding ? "blur(20px) saturate(180%)" : "none",
    // borderBottom:
    //   scrolled || !isLanding
    //     ? "1px solid rgba(255,255,255,0.07)"
    //     : "1px solid transparent",
  };

  const innerStyle = {
    maxWidth: 1200,
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
    height: 64,
    fontFamily: "'DM Sans', sans-serif",
  };

  return (
    <>
      {/* Font import — injected once */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .wz-nav-link-mob {
          display: block; text-decoration: none; padding: 11px 16px;
          border-radius: 12px; font-size: 15px; font-weight: 400;
          color: #64748b; transition: all 0.2s ease;
        }
        .wz-nav-link-mob:hover, .wz-nav-link-mob.active {
          color: #e2e8f0; background: rgba(255,255,255,0.06);
        }

        .wz-drop-item {
          display: block; padding: 9px 14px; border-radius: 8px;
          text-decoration: none; font-size: 13px; color: #64748b;
          transition: all 0.15s ease; white-space: nowrap;
        }
        .wz-drop-item:hover { color: #e2e8f0; background: rgba(255,255,255,0.06); }

        .wz-btn-primary {
          display: inline-flex; align-items: center; gap: 6px;
          background: linear-gradient(135deg,#3b82f6,#6366f1);
          color: #fff; text-decoration: none;
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
          padding: 9px 20px; border-radius: 10px; border: none; cursor: pointer;
          transition: opacity 0.2s, transform 0.2s;
          box-shadow: 0 0 20px rgba(99,102,241,0.3);
        }
        .wz-btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }

        .wz-btn-ghost {
          display: inline-flex; align-items: center; gap: 6px;
          background: transparent; color: #64748b; text-decoration: none;
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 400;
          padding: 9px 20px; border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.1); cursor: pointer;
          transition: all 0.2s;
        }
        .wz-btn-ghost:hover { color: #e2e8f0; border-color: rgba(255,255,255,0.22); background: rgba(255,255,255,0.04); }

        .wz-hamburger { background: none; border: none; cursor: pointer; padding: 8px; display: flex; flex-direction: column; gap: 5px; }
        .wz-hamburger span { display: block; width: 22px; height: 1.5px; background: #64748b; border-radius: 999px; transition: all 0.3s ease; transform-origin: center; }
        .wz-hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
        .wz-hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .wz-hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

        .wz-mobile-menu {
          position: fixed; top: 64px; left: 0; right: 0; z-index: 998;
          background: rgba(8,13,20,0.96); backdrop-filter: blur(24px);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          padding: 16px 20px 24px;
          transform-origin: top;
          animation: slideDown 0.25s ease forwards;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .wz-dropdown {
          position: absolute; top: calc(100% + 10px); right: 0;
          background: rgba(8,13,20,0.96); backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.1); border-radius: 16px;
          padding: 8px; min-width: 200px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
          animation: dropIn 0.2s ease forwards;
        }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .wz-divider {
          height: 1px; background: rgba(255,255,255,0.07); margin: 6px 0;
        }

        @media (max-width: 768px) { .wz-desktop-links { display: none !important; } }
        @media (min-width: 769px) { .wz-mobile-only   { display: none !important; } }
      `}</style>

      {!isLanding && (
        <nav style={navStyle}>
          <div style={innerStyle}>
            {/* ── Logo ── */}
            <img src={logo} className="h-16 w-20" alt="" />

            {/* ── Desktop Nav Links ── */}
            {user && (
              <div
                className="wz-desktop-links"
                style={{ display: "flex", alignItems: "center", gap: 4 }}
              >
                {links.map((l) => (
                  <NavPill key={l.to} to={l.to} label={l.label} />
                ))}
              </div>
            )}

            {/* ── Right side ── */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {!user ? (
                /* ── Logged out ── */
                <>
                  <Link
                    to="/jobs"
                    className="wz-desktop-links wz-btn-ghost"
                    style={{ display: "inline-flex" }}
                  >
                    Browse Jobs
                  </Link>
                  <Link to="/login" className="wz-btn-ghost">
                    Login
                  </Link>
                  <Link to="/register" className="wz-btn-primary">
                    Get started →
                  </Link>
                </>
              ) : (
                /* ── Logged in: user dropdown ── */
                <div ref={dropRef} style={{ position: "relative" }}>
                  <button
                    onClick={() => setDropOpen((o) => !o)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      background: "rgba(255,255,255,0.04)",
                      border: `1px solid ${dropOpen ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.08)"}`,
                      borderRadius: 12,
                      padding: "6px 12px 6px 6px",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(255,255,255,0.07)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = dropOpen
                        ? "rgba(255,255,255,0.07)"
                        : "rgba(255,255,255,0.04)")
                    }
                  >
                    {/* Avatar */}
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        background: meta?.avatarBg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#fff",
                        flexShrink: 0,
                        boxShadow: `0 0 12px ${meta?.accent}55`,
                      }}
                    >
                      {user.name?.charAt(0).toUpperCase()}
                    </div>

                    {/* Name + role */}
                    <div
                      style={{ textAlign: "left", lineHeight: 1.2 }}
                      className="wz-desktop-links"
                    >
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#36454F ",
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                      >
                        {user.name?.split(" ")[0]}
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          fontWeight: 500,
                          color: meta?.accent,
                          background: meta?.bg,
                          borderRadius: 4,
                          padding: "1px 6px",
                          display: "inline-block",
                          marginTop: 1,
                        }}
                      >
                        {meta?.label}
                      </div>
                    </div>

                    {/* Chevron */}
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      style={{
                        transition: "transform 0.2s",
                        transform: dropOpen ? "rotate(180deg)" : "none",
                        marginLeft: 2,
                      }}
                    >
                      <path
                        d="M2 4l4 4 4-4"
                        stroke="#64748b"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  {/* Dropdown */}
                  {dropOpen && (
                    <div className="wz-dropdown">
                      {/* User info header */}
                      <div
                        style={{
                          padding: "8px 14px 10px",
                          borderBottom: "1px solid rgba(255,255,255,0.07)",
                          marginBottom: 6,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 500,
                            color: "#e2e8f0",
                            fontFamily: "'DM Sans', sans-serif",
                          }}
                        >
                          {user.name}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "#475569",
                            marginTop: 2,
                          }}
                        >
                          {user.email}
                        </div>
                      </div>

                      {/* Role-specific quick links */}
                      {links.map((l) => (
                        <Link
                          key={l.to}
                          to={l.to}
                          className="wz-drop-item"
                          onClick={() => setDropOpen(false)}
                        >
                          {l.label}
                        </Link>
                      ))}

                      <div className="wz-divider" />

                      {/* Logout */}
                      <button
                        onClick={() => {
                          setDropOpen(false);
                          logout();
                        }}
                        className="wz-drop-item"
                        style={{
                          width: "100%",
                          textAlign: "left",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#ef4444",
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background =
                            "rgba(239,68,68,0.08)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "none")
                        }
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ── Mobile hamburger (only when logged in) ── */}
              {user && (
                <button
                  className={`wz-hamburger wz-mobile-only ${menuOpen ? "open" : ""}`}
                  onClick={() => setMenuOpen((o) => !o)}
                  aria-label="Toggle menu"
                >
                  <span />
                  <span />
                  <span />
                </button>
              )}
            </div>
          </div>
        </nav>
      )}

      {/* ── Mobile slide-down menu ── */}
      {menuOpen && user && (
        <div className="wz-mobile-menu wz-mobile-only">
          {/* User card */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 16px",
              marginBottom: 12,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 14,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: meta?.avatarBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 15,
                fontWeight: 700,
                color: "#fff",
                boxShadow: `0 0 16px ${meta?.accent}44`,
              }}
            >
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#e2e8f0",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {user.name}
              </div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 500,
                  color: meta?.accent,
                  background: meta?.bg,
                  borderRadius: 4,
                  padding: "2px 8px",
                  display: "inline-block",
                  marginTop: 3,
                }}
              >
                {meta?.label}
              </div>
            </div>
          </div>

          {/* Nav links */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              marginBottom: 12,
            }}
          >
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`wz-nav-link-mob ${isActive(l.to) ? "active" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div
            style={{
              height: 1,
              background: "rgba(255,255,255,0.07)",
              margin: "8px 0 12px",
            }}
          />

          {/* Logout */}
          <button
            onClick={() => {
              setMenuOpen(false);
              logout();
            }}
            style={{
              width: "100%",
              padding: "11px 16px",
              borderRadius: 12,
              background: "rgba(239,68,68,0.07)",
              border: "1px solid rgba(239,68,68,0.15)",
              color: "#ef4444",
              fontSize: 14,
              fontWeight: 500,
              fontFamily: "'DM Sans', sans-serif",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            Sign out
          </button>
        </div>
      )}
    </>
  );
}
