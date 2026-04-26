import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getStats, getHealth, getPosts } from "../utils/api";
import BlockCard from "../components/BlockCard";
import { Layers, ShieldCheck, Cpu, PenLine, ArrowRight, Zap, Lock, Link2 } from "lucide-react";

function StatPill({ label, value, color, delay }) {
  const [displayed, setDisplayed] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseInt(value) || 0;
    if (end === 0) { setDisplayed(end); return; }
    const step = Math.ceil(end / 30);
    const t = setInterval(() => {
      start += step;
      if (start >= end) { setDisplayed(end); clearInterval(t); }
      else setDisplayed(start);
    }, 30);
    return () => clearInterval(t);
  }, [value]);

  return (
    <div className="card anim-scale-in" style={{ animationDelay: `${delay}s`, textAlign: "center", padding: "20px 16px" }}>
      <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.04em", color }}>{displayed}</div>
      <div style={{ fontSize: 12, color: "var(--ios-gray)", marginTop: 2, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</div>
    </div>
  );
}

export default function Home() {
  const [stats, setStats] = useState(null);
  const [posts, setPosts] = useState([]);
  const [health, setHealth] = useState(null);

  useEffect(() => {
    getStats().then(r => setStats(r.data)).catch(() => {});
    getHealth().then(r => setHealth(r.data)).catch(() => {});
    getPosts().then(r => setPosts(r.data.posts.slice(-3).reverse())).catch(() => {});
  }, []);

  const features = [
    { icon: <Lock size={20} color="#fff"/>, bg: "linear-gradient(135deg,#007aff,#5856d6)", title: "Tamper-Proof", desc: "SHA-256 hash linking makes every post cryptographically immutable." },
    { icon: <Link2 size={20} color="#fff"/>, bg: "linear-gradient(135deg,#34c759,#00b347)", title: "Hash Linking", desc: "Blocks chain together — altering one breaks all subsequent links." },
    { icon: <Cpu size={20} color="#fff"/>, bg: "linear-gradient(135deg,#ff9500,#ff6b00)", title: "Proof of Work", desc: "Each post is mined with configurable PoW difficulty, preventing spam." },
    { icon: <ShieldCheck size={20} color="#fff"/>, bg: "linear-gradient(135deg,#ff2d55,#ff375f)", title: "Instant Verify", desc: "One-click full cryptographic chain integrity verification." },
  ];

  return (
    <div>
      {/* ── Hero ── */}
      <section style={{
        background: "linear-gradient(160deg, #fff 0%, #f0f4ff 50%, #f2f2f7 100%)",
        borderBottom: "1px solid var(--ios-sep)",
        padding: "60px 0 52px",
        overflow: "hidden",
        position: "relative",
      }}>
        {/* Decorative blobs */}
        <div style={{ position: "absolute", width: 420, height: 420, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,122,255,0.12) 0%, transparent 70%)",
          top: -100, right: -100, pointerEvents: "none" }}/>
        <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(88,86,214,0.10) 0%, transparent 70%)",
          bottom: -80, left: -60, pointerEvents: "none" }}/>

        <div className="container" style={{ position: "relative", textAlign: "center", maxWidth: 700 }}>
          {/* App icon */}
          <div className="anim-scale-in" style={{
            width: 72, height: 72,
            background: "linear-gradient(135deg, #007aff, #5856d6)",
            borderRadius: 18,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px",
            boxShadow: "0 8px 32px rgba(0,122,255,0.35), 0 2px 8px rgba(0,0,0,0.1)"
          }}>
            <Layers size={34} color="#fff"/>
          </div>

          <div className="anim-fade-up delay-1">
            <h1 style={{ fontSize: "clamp(32px,6vw,52px)", fontWeight: 800,
              letterSpacing: "-0.04em", lineHeight: 1.08, marginBottom: 14 }}>
              Decentralized Blogging<br/>
              <span style={{ background: "linear-gradient(90deg,#007aff,#5856d6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                on the Blockchain
              </span>
            </h1>
          </div>

          <p className="anim-fade-up delay-2" style={{ fontSize: 17, color: "var(--ios-label2)",
            maxWidth: 520, margin: "0 auto 28px", lineHeight: 1.65 }}>
            Every post is a block. Every block is immutable. Publish with SHA-256 
            cryptographic proof — censorship-resistant, forever.
          </p>

          <div className="anim-fade-up delay-3" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/write" className="btn btn-primary btn-lg">
              <PenLine size={18}/> Start Writing
            </Link>
            <Link to="/posts" className="btn btn-secondary btn-lg">
              <Layers size={18}/> Browse Posts
            </Link>
          </div>

          {/* Status pill */}
          {health && (
            <div className="anim-fade-up delay-4" style={{
              display: "inline-flex", alignItems: "center", gap: 8, marginTop: 28,
              background: "rgba(255,255,255,0.8)", backdropFilter: "blur(12px)",
              border: "1px solid var(--ios-sep)", borderRadius: 980,
              padding: "8px 16px", fontSize: 13, color: "var(--ios-label2)"
            }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%",
                background: "var(--ios-green)", display: "inline-block",
                boxShadow: "0 0 6px rgba(52,199,89,0.6)" }}/>
              API Online · {health.blocks} blocks · MongoDB {health.mongo ? "✓" : "in-memory"}
            </div>
          )}
        </div>
      </section>

      <div className="container page">
        {/* Stats */}
        {stats && (
          <div className="grid-3" style={{ marginBottom: 32 }}>
            <StatPill label="Total Blocks" value={stats.total_blocks} color="var(--ios-blue)" delay={0.05}/>
            <StatPill label="Posts Published" value={stats.total_posts} color="var(--ios-green)" delay={0.1}/>
            <StatPill label="Mining Difficulty" value={stats.difficulty} color="var(--ios-indigo)" delay={0.15}/>
          </div>
        )}

        {/* Features */}
        <div style={{ marginBottom: 40 }}>
          <h2 className="section-header anim-fade-up" style={{ marginBottom: 16 }}>Why Blockchain?</h2>
          <div className="grid-2">
            {features.map((f, i) => (
              <div key={i} className={`card anim-fade-up delay-${i+1}`}
                style={{ display: "flex", gap: 14, padding: "18px 20px", alignItems: "flex-start" }}>
                <div className="icon-box" style={{ background: f.bg, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
                  {f.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 3 }}>{f.title}</div>
                  <div style={{ fontSize: 13, color: "var(--ios-label2)", lineHeight: 1.55 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent posts */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 className="section-header" style={{ fontSize: 22 }}>Recent Posts</h2>
          <Link to="/posts" style={{ display: "flex", alignItems: "center", gap: 3,
            fontSize: 14, fontWeight: 600, color: "var(--ios-blue)", textDecoration: "none" }}>
            See all <ArrowRight size={15}/>
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: "48px 24px" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📝</div>
            <p style={{ color: "var(--ios-label2)", marginBottom: 16 }}>No posts yet. Be the first to publish!</p>
            <Link to="/write" className="btn btn-primary">
              <PenLine size={15}/> Write First Post
            </Link>
          </div>
        ) : (
          <div className="grid-3">
            {posts.map((b, i) => <BlockCard key={b.index} block={b} delay={i * 0.06}/>)}
          </div>
        )}
      </div>
    </div>
  );
}
