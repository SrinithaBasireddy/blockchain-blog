import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPost } from "../utils/api";
import { ArrowLeft, Clock, User, Hash, Cpu, ChevronDown, ChevronUp } from "lucide-react";

export default function PostDetail() {
  const { index } = useParams();
  const [block, setBlock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [techOpen, setTechOpen] = useState(false);

  useEffect(() => {
    getPost(index).then(r => setBlock(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [index]);

  if (loading) return <div className="spinner"/>;
  if (!block) return <div className="container page" style={{ color: "var(--ios-red)" }}>Block not found.</div>;

  const { data, hash, previous_hash, nonce, timestamp_readable, difficulty } = block;

  const colors = [
    "linear-gradient(135deg,#007aff,#5856d6)",
    "linear-gradient(135deg,#34c759,#30b955)",
    "linear-gradient(135deg,#ff9500,#ff6b00)",
    "linear-gradient(135deg,#ff2d55,#ff375f)",
    "linear-gradient(135deg,#5ac8fa,#007aff)",
    "linear-gradient(135deg,#af52de,#5856d6)",
  ];
  const gradient = colors[block.index % colors.length];

  return (
    <div className="container page" style={{ maxWidth: 720 }}>
      <Link to="/posts" style={{ display: "inline-flex", alignItems: "center", gap: 5,
        fontSize: 15, fontWeight: 600, color: "var(--ios-blue)", textDecoration: "none", marginBottom: 20 }}
        className="anim-fade-in">
        <ArrowLeft size={16}/> Posts
      </Link>

      {/* Hero card */}
      <div className="card anim-fade-up" style={{ marginBottom: 16, overflow: "hidden" }}>
        <div style={{ background: gradient, padding: "28px 24px 24px" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
            <span style={{ background: "rgba(255,255,255,0.22)", color: "#fff",
              fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 980 }}>
              Block #{block.index}
            </span>
            {data?.tags?.map((t, i) => (
              <span key={i} style={{ background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.9)",
                fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 980 }}>{t}</span>
            ))}
          </div>
          <h1 style={{ color: "#fff", fontSize: "clamp(22px,4vw,30px)", fontWeight: 800,
            letterSpacing: "-0.03em", lineHeight: 1.15 }}>{data?.title}</h1>
          <div style={{ display: "flex", gap: 16, marginTop: 12, fontSize: 13, color: "rgba(255,255,255,0.75)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><User size={12}/> {data?.author}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={12}/> {timestamp_readable}</span>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "24px", fontSize: 16, lineHeight: 1.8, color: "var(--ios-label)" }}>
          {data?.content?.split("\n").map((line, i) => (
            line ? <p key={i} style={{ marginBottom: 12 }}>{line}</p> : <br key={i}/>
          ))}
        </div>
      </div>

      {/* Technical details collapsible */}
      <div className="card anim-fade-up delay-2">
        <div onClick={() => setTechOpen(!techOpen)}
          style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", cursor: "pointer" }}>
          <div className="icon-box" style={{ background: "linear-gradient(135deg,#5856d6,#af52de)", width: 36, height: 36, borderRadius: 9 }}>
            <Cpu size={18} color="#fff"/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Block Technical Details</div>
            <div style={{ fontSize: 12, color: "var(--ios-gray)" }}>SHA-256 · Proof of Work · Nonce</div>
          </div>
          {techOpen ? <ChevronUp size={18} color="var(--ios-gray)"/> : <ChevronDown size={18} color="var(--ios-gray)"/>}
        </div>

        {techOpen && (
          <div style={{ borderTop: "1px solid var(--ios-sep)", padding: "0 20px 16px", animation: "fadeUp 0.25s var(--ease-out)" }}>
            {[
              { label: "Block Hash (SHA-256)", value: hash, mono: true },
              { label: "Previous Block Hash", value: previous_hash, mono: true },
              { label: "Nonce (Proof of Work)", value: String(nonce), mono: true },
              { label: "Difficulty Target", value: `${"0".repeat(difficulty)}… (${difficulty} leading zeros required)`, mono: false },
            ].map(({ label, value, mono }) => (
              <div key={label} style={{ padding: "14px 0", borderBottom: "1px solid var(--ios-sep)" }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--ios-gray)", textTransform: "uppercase",
                  letterSpacing: "0.05em", marginBottom: 4 }}>{label}</div>
                <div className={mono ? "mono" : ""} style={{ fontSize: mono ? 11 : 14, color: "var(--ios-label)", wordBreak: "break-all" }}>
                  {value}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
