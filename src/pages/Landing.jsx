import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const COMPANIES = [
  "Google",
  "Stripe",
  "Notion",
  "Figma",
  "Linear",
  "Vercel",
  "Anthropic",
  "OpenAI",
  "Airbnb",
  "Spotify",
];

const STATS = [
  { value: "24K+", label: "Active Jobs" },
  { value: "8K+", label: "Companies" },
  { value: "180K+", label: "Job Seekers" },
  { value: "94%", label: "Hire Rate" },
];

const FEATURES = [
  {
    icon: "⚡",
    title: "Instant Matches",
    desc: "Smart algorithms surface the right roles for your skills and ambitions — no endless scrolling.",
  },
  {
    icon: "🔒",
    title: "Verified Employers",
    desc: "Every company is reviewed before posting. No scams, no ghost jobs — only real opportunities.",
  },
  {
    icon: "📊",
    title: "Track Everything",
    desc: "A live application tracker shows exactly where you stand at every stage of every process.",
  },
  {
    icon: "🌍",
    title: "Remote & On-site",
    desc: "Full-time, part-time, contract, internship — find the work arrangement that fits your life.",
  },
  {
    icon: "🚀",
    title: "One-Click Apply",
    desc: "Your profile is your résumé. Apply to multiple roles in seconds without re-filling forms.",
  },
  {
    icon: "💬",
    title: "Direct Outreach",
    desc: "Recruiters can message you directly. Skip the black hole and get real responses.",
  },
];

const ROLES = [
  "Frontend Engineer",
  "Product Designer",
  "Data Scientist",
  "Backend Developer",
  "DevOps Engineer",
  "Growth Marketer",
  "iOS Developer",
  "ML Engineer",
  "UX Researcher",
];

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setInView(true);
      },
      { threshold },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function AnimatedCounter({ target }) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView(0.5);
  const num = parseInt(target.replace(/\D/g, ""));
  const suffix = target.replace(/[\d]/g, "");
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(num / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= num) {
        setCount(num);
        clearInterval(timer);
      } else setCount(start);
    }, 20);
    return () => clearInterval(timer);
  }, [inView, num]);
  return (
    <span ref={ref}>
      {inView ? count.toLocaleString() : "0"}
      {suffix}
    </span>
  );
}

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [roleIdx, setRoleIdx] = useState(0);
  const [roleVisible, setRoleVisible] = useState(true);
  const [heroRef, heroInView] = useInView(0.1);
  const [statsRef, statsInView] = useInView(0.2);
  const [featRef, featInView] = useInView(0.1);
  const [ctaRef, ctaInView] = useInView(0.2);

  useEffect(() => {
    if (user) navigate("/jobs", { replace: true });
  }, [user]);

  // Rotating job roles
  useEffect(() => {
    const interval = setInterval(() => {
      setRoleVisible(false);
      setTimeout(() => {
        setRoleIdx((i) => (i + 1) % ROLES.length);
        setRoleVisible(true);
      }, 400);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  // Canvas particle network
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const PARTICLE_COUNT = 55;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.15,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99,179,237,${p.opacity})`;
        ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(99,179,237,${0.12 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.7;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .land-root { font-family: 'DM Sans', sans-serif; background: #080d14; color: #e8edf5; overflow-x: hidden; }
        .land-root * { box-sizing: border-box; margin: 0; padding: 0; }

        .hero-title { font-family: 'Syne', sans-serif; font-weight: 800; line-height: 1.05; letter-spacing: -0.03em; }

        .gradient-text {
          background: linear-gradient(135deg, #63b3ed 0%, #a78bfa 50%, #f472b6 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }

        .role-chip {
          display: inline-block;
          background: linear-gradient(135deg, #1e3a5f, #2d1b69);
          border: 1px solid rgba(99,179,237,0.3);
          border-radius: 999px;
          padding: 6px 20px;
          font-size: 15px; font-weight: 500; color: #93c5fd;
          transition: opacity 0.35s ease, transform 0.35s ease;
        }
        .role-chip.hidden { opacity: 0; transform: translateY(10px); }
        .role-chip.visible { opacity: 1; transform: translateY(0); }

        .fade-up { opacity: 0; transform: translateY(32px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .fade-up.in { opacity: 1; transform: none; }
        .delay-1 { transition-delay: 0.1s; }
        .delay-2 { transition-delay: 0.2s; }
        .delay-3 { transition-delay: 0.3s; }
        .delay-4 { transition-delay: 0.4s; }
        .delay-5 { transition-delay: 0.5s; }
        .delay-6 { transition-delay: 0.6s; }

        .btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          color: #fff; font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 500; border: none; cursor: pointer;
          padding: 14px 28px; border-radius: 12px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          text-decoration: none;
          box-shadow: 0 0 0 0 rgba(99,102,241,0);
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(99,102,241,0.4); }

        .btn-outline {
          display: inline-flex; align-items: center; gap: 8px;
          background: transparent; color: #94a3b8;
          font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 500;
          border: 1px solid rgba(148,163,184,0.25); cursor: pointer;
          padding: 14px 28px; border-radius: 12px;
          transition: all 0.2s ease; text-decoration: none;
        }
        .btn-outline:hover { border-color: rgba(148,163,184,0.5); color: #e2e8f0; background: rgba(255,255,255,0.04); }

        .ticker-wrap { overflow: hidden; mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent); }
        .ticker { display: flex; gap: 40px; animation: ticker-scroll 22s linear infinite; width: max-content; }
        .ticker:hover { animation-play-state: paused; }
        @keyframes ticker-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }

        .stat-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px; padding: 32px 28px;
          text-align: center;
          transition: border-color 0.3s, background 0.3s;
        }
        .stat-card:hover { border-color: rgba(99,179,237,0.3); background: rgba(99,179,237,0.04); }

        .feat-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px; padding: 28px 24px;
          transition: transform 0.3s ease, border-color 0.3s, background 0.3s;
        }
        .feat-card:hover { transform: translateY(-4px); border-color: rgba(99,179,237,0.25); background: rgba(255,255,255,0.04); }

        .glow-orb {
          position: absolute; border-radius: 50%; filter: blur(90px); pointer-events: none; z-index: 0;
        }

        .section-label {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(99,179,237,0.08); border: 1px solid rgba(99,179,237,0.2);
          border-radius: 999px; padding: 5px 16px;
          font-size: 12px; font-weight: 500; color: #63b3ed; letter-spacing: 0.06em; text-transform: uppercase;
        }

        .noise {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 100; opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
        }

        .search-bar {
          display: flex; align-items: center;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px; overflow: hidden; backdrop-filter: blur(10px);
          transition: border-color 0.3s;
        }
        .search-bar:focus-within { border-color: rgba(99,179,237,0.4); }
        .search-bar input {
          flex: 1; background: transparent; border: none; outline: none;
          color: #e2e8f0; font-family: 'DM Sans', sans-serif; font-size: 15px;
          padding: 14px 20px;
        }
        .search-bar input::placeholder { color: #475569; }
        .search-bar button {
          margin: 6px; background: linear-gradient(135deg, #3b82f6, #6366f1);
          border: none; color: #fff; font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 500; cursor: pointer;
          padding: 10px 22px; border-radius: 10px; transition: opacity 0.2s;
        }
        .search-bar button:hover { opacity: 0.9; }

        .cta-section {
          background: linear-gradient(135deg, rgba(59,130,246,0.12), rgba(99,102,241,0.12), rgba(168,85,247,0.12));
          border: 1px solid rgba(99,179,237,0.15); border-radius: 28px;
          padding: 72px 48px; text-align: center; position: relative; overflow: hidden;
        }
      `}</style>

      <div className="land-root">
        <div className="noise" />

        {/* ── HERO ──────────────────────────────────────────────────── */}
        <section
          style={{
            position: "relative",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "80px 24px 60px",
            overflow: "hidden",
          }}
        >
          {/* Particle canvas */}
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              zIndex: 0,
            }}
          />

          {/* Glow orbs */}
          <div
            className="glow-orb"
            style={{
              width: 600,
              height: 600,
              background: "rgba(59,130,246,0.12)",
              top: -100,
              left: "50%",
              transform: "translateX(-50%)",
            }}
          />
          <div
            className="glow-orb"
            style={{
              width: 400,
              height: 400,
              background: "rgba(168,85,247,0.1)",
              bottom: 0,
              right: -100,
            }}
          />
          <div
            className="glow-orb"
            style={{
              width: 300,
              height: 300,
              background: "rgba(244,114,182,0.08)",
              top: "30%",
              left: -80,
            }}
          />

          <div
            ref={heroRef}
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: 820,
              textAlign: "center",
            }}
          >
            <div className={`fade-up ${heroInView ? "in" : ""}`}>
              <span className="section-label">
                ✦ The startup job marketplace
              </span>
            </div>

            <h1
              className={`hero-title fade-up ${heroInView ? "in" : ""} delay-1`}
              style={{
                fontSize: "clamp(48px, 8vw, 88px)",
                color: "#f0f6ff",
                marginTop: 28,
                marginBottom: 12,
              }}
            >
              Find work that
              <br />
              <span className="gradient-text">actually excites you.</span>
            </h1>

            <p
              className={`fade-up ${heroInView ? "in" : ""} delay-2`}
              style={{
                fontSize: 18,
                color: "#64748b",
                fontWeight: 300,
                lineHeight: 1.7,
                marginBottom: 28,
                maxWidth: 560,
                margin: "0 auto 28px",
              }}
            >
              Workzoko connects ambitious people with the companies building the
              future. No noise, no spam — just great jobs.
            </p>

            {/* Rotating role chip */}
            <div
              className={`fade-up ${heroInView ? "in" : ""} delay-3`}
              style={{ marginBottom: 36, minHeight: 38 }}
            >
              <span
                className={`role-chip ${roleVisible ? "visible" : "hidden"}`}
              >
                Now hiring: {ROLES[roleIdx]}
              </span>
            </div>

            {/* Search bar */}
            <div
              className={`fade-up ${heroInView ? "in" : ""} delay-4`}
              style={{ maxWidth: 580, margin: "0 auto 32px" }}
            >
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search by role, skill, or company..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter")
                      navigate(`/jobs?keyword=${e.target.value}`);
                  }}
                />
                <button onClick={() => navigate("/jobs")}>Search Jobs →</button>
              </div>
            </div>

            {/* CTA buttons */}
            <div
              className={`fade-up ${heroInView ? "in" : ""} delay-5`}
              style={{
                display: "flex",
                gap: 12,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Link to="/register" className="btn-primary">
                Get started free →
              </Link>
              <Link to="/jobs" className="btn-outline">
                Browse all jobs
              </Link>
            </div>

            <p
              className={`fade-up ${heroInView ? "in" : ""} delay-6`}
              style={{ marginTop: 20, fontSize: 13, color: "#334155" }}
            >
              Free for job seekers · No credit card required
            </p>
          </div>
        </section>

        {/* ── TICKER ─────────────────────────────────────────────────── */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.05)",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            padding: "18px 0",
            background: "rgba(255,255,255,0.015)",
          }}
        >
          <div className="ticker-wrap">
            <div className="ticker">
              {[...COMPANIES, ...COMPANIES].map((c, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#475569",
                    whiteSpace: "nowrap",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  {c}
                  <span style={{ marginLeft: 40, color: "#1e293b" }}>✦</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── STATS ──────────────────────────────────────────────────── */}
        <section
          style={{ padding: "100px 24px", maxWidth: 1100, margin: "0 auto" }}
        >
          <div
            ref={statsRef}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 20,
            }}
          >
            {STATS.map((s, i) => (
              <div
                key={i}
                className={`stat-card fade-up delay-${i + 1} ${statsInView ? "in" : ""}`}
              >
                <div
                  style={{
                    fontFamily: "Syne, sans-serif",
                    fontSize: 48,
                    fontWeight: 800,
                    color: "#e2e8f0",
                    lineHeight: 1.1,
                  }}
                >
                  <AnimatedCounter target={s.value} />
                </div>
                <div
                  style={{
                    marginTop: 8,
                    fontSize: 14,
                    color: "#64748b",
                    fontWeight: 400,
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURES ───────────────────────────────────────────────── */}
        <section
          style={{ padding: "0 24px 100px", maxWidth: 1100, margin: "0 auto" }}
        >
          <div ref={featRef} style={{ textAlign: "center", marginBottom: 56 }}>
            <div className={`fade-up ${featInView ? "in" : ""}`}>
              <span className="section-label">✦ Why Workzoko</span>
            </div>
            <h2
              className={`hero-title fade-up delay-1 ${featInView ? "in" : ""}`}
              style={{
                fontSize: "clamp(32px, 5vw, 52px)",
                color: "#f0f6ff",
                marginTop: 20,
              }}
            >
              Built for the way{" "}
              <span className="gradient-text">people actually work</span>
            </h2>
            <p
              className={`fade-up delay-2 ${featInView ? "in" : ""}`}
              style={{
                marginTop: 16,
                fontSize: 16,
                color: "#64748b",
                fontWeight: 300,
                maxWidth: 480,
                margin: "16px auto 0",
              }}
            >
              No bloated features. Just the tools that get you hired faster.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 20,
            }}
          >
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className={`feat-card fade-up delay-${(i % 3) + 1} ${featInView ? "in" : ""}`}
              >
                <div style={{ fontSize: 28, marginBottom: 16, lineHeight: 1 }}>
                  {f.icon}
                </div>
                <h3
                  style={{
                    fontFamily: "Syne, sans-serif",
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#e2e8f0",
                    marginBottom: 10,
                  }}
                >
                  {f.title}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    color: "#64748b",
                    lineHeight: 1.7,
                    fontWeight: 300,
                  }}
                >
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FOR RECRUITERS ─────────────────────────────────────────── */}
        <section
          style={{ padding: "0 24px 100px", maxWidth: 1100, margin: "0 auto" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 48,
              alignItems: "center",
            }}
          >
            <div>
              <span className="section-label">✦ For Recruiters</span>
              <h2
                className="hero-title"
                style={{
                  fontSize: "clamp(28px, 4vw, 44px)",
                  color: "#f0f6ff",
                  marginTop: 20,
                  marginBottom: 16,
                }}
              >
                Hire faster.
                <br />
                <span className="gradient-text">Hire smarter.</span>
              </h2>
              <p
                style={{
                  fontSize: 15,
                  color: "#64748b",
                  lineHeight: 1.8,
                  fontWeight: 300,
                  marginBottom: 28,
                }}
              >
                Post jobs, review applicants, shortlist candidates, and make
                offers — all from one clean dashboard. No fluff, just results.
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  marginBottom: 32,
                }}
              >
                {[
                  "Post jobs in under 2 minutes",
                  "Smart applicant filtering",
                  "Direct resume access",
                  "Real-time application status",
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      fontSize: 14,
                      color: "#94a3b8",
                    }}
                  >
                    <span style={{ color: "#22d3ee", fontSize: 16 }}>✓</span>{" "}
                    {item}
                  </div>
                ))}
              </div>
              <Link
                to="/register"
                className="btn-primary"
                style={{ display: "inline-flex" }}
              >
                Start hiring →
              </Link>
            </div>

            {/* Visual card mockup */}
            <div style={{ position: "relative" }}>
              <div
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 24,
                  padding: 24,
                  backdropFilter: "blur(10px)",
                }}
              >
                <div
                  style={{
                    marginBottom: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Syne, sans-serif",
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#94a3b8",
                    }}
                  >
                    Recent Applicants
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: "#22d3ee",
                      background: "rgba(34,211,238,0.1)",
                      padding: "3px 10px",
                      borderRadius: 999,
                    }}
                  >
                    Live
                  </span>
                </div>
                {[
                  {
                    name: "Priya Sharma",
                    role: "Frontend Dev",
                    status: "Shortlisted",
                    color: "#a78bfa",
                  },
                  {
                    name: "Arjun Mehta",
                    role: "UI/UX Designer",
                    status: "Viewed",
                    color: "#fbbf24",
                  },
                  {
                    name: "Sneha Rao",
                    role: "Data Analyst",
                    status: "Applied",
                    color: "#63b3ed",
                  },
                  {
                    name: "Rahul Das",
                    role: "Backend Dev",
                    status: "Hired 🎉",
                    color: "#34d399",
                  },
                ].map((a, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px 0",
                      borderBottom:
                        i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          background: `${a.color}22`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 13,
                          fontWeight: 700,
                          color: a.color,
                        }}
                      >
                        {a.name.charAt(0)}
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 500,
                            color: "#e2e8f0",
                          }}
                        >
                          {a.name}
                        </div>
                        <div style={{ fontSize: 11, color: "#64748b" }}>
                          {a.role}
                        </div>
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 500,
                        color: a.color,
                        background: `${a.color}18`,
                        padding: "3px 10px",
                        borderRadius: 999,
                      }}
                    >
                      {a.status}
                    </span>
                  </div>
                ))}
              </div>
              {/* Floating accent */}
              <div
                style={{
                  position: "absolute",
                  top: -16,
                  right: -16,
                  background: "linear-gradient(135deg,#3b82f6,#6366f1)",
                  borderRadius: 12,
                  padding: "10px 16px",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#fff",
                  boxShadow: "0 8px 30px rgba(99,102,241,0.4)",
                }}
              >
                +12 today ↑
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ────────────────────────────────────────────────────── */}
        <section
          style={{ padding: "0 24px 120px", maxWidth: 1000, margin: "0 auto" }}
        >
          <div
            ref={ctaRef}
            className={`cta-section fade-up ${ctaInView ? "in" : ""}`}
          >
            {/* inner glow */}
            <div
              className="glow-orb"
              style={{
                width: 400,
                height: 400,
                background: "rgba(99,102,241,0.12)",
                top: -100,
                left: "50%",
                transform: "translateX(-50%)",
              }}
            />
            <div style={{ position: "relative", zIndex: 1 }}>
              <span className="section-label">✦ Get started today</span>
              <h2
                className="hero-title"
                style={{
                  fontSize: "clamp(32px, 5vw, 56px)",
                  color: "#f0f6ff",
                  marginTop: 24,
                  marginBottom: 16,
                }}
              >
                Your next role is
                <br />
                <span className="gradient-text">one click away.</span>
              </h2>
              <p
                style={{
                  fontSize: 16,
                  color: "#64748b",
                  fontWeight: 300,
                  marginBottom: 36,
                }}
              >
                Join thousands of job seekers and companies on Workzoko.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <Link
                  to="/register"
                  className="btn-primary"
                  style={{ fontSize: 16, padding: "15px 32px" }}
                >
                  Create free account →
                </Link>
                <Link
                  to="/register?role=recruiter"
                  className="btn-outline"
                  style={{ fontSize: 16, padding: "15px 32px" }}
                >
                  Post a job
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ─────────────────────────────────────────────────── */}
        <footer
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            padding: "36px 24px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <span
              style={{
                fontFamily: "Syne, sans-serif",
                fontSize: 18,
                fontWeight: 800,
              }}
            >
              <span style={{ color: "#3b82f6" }}>Work</span>
              <span style={{ color: "#475569" }}>zoko</span>
            </span>
          </div>
          <p style={{ fontSize: 12, color: "#1e293b" }}>
            © {new Date().getFullYear()} Workzoko. Built with ♥ in India.
          </p>
          <div
            style={{
              display: "flex",
              gap: 24,
              justifyContent: "center",
              marginTop: 16,
            }}
          >
            {["Browse Jobs", "For Recruiters", "Login", "Sign Up"].map((l) => (
              <Link
                key={l}
                to={
                  l === "Browse Jobs"
                    ? "/jobs"
                    : l === "For Recruiters"
                      ? "/register"
                      : l === "Login"
                        ? "/login"
                        : "/register"
                }
                style={{
                  fontSize: 12,
                  color: "#334155",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#63b3ed")}
                onMouseLeave={(e) => (e.target.style.color = "#334155")}
              >
                {l}
              </Link>
            ))}
          </div>
        </footer>
      </div>
    </>
  );
}
