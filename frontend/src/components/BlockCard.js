import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Hash, Clock, User, Tag, ChevronRight } from "lucide-react";

export default function BlockCard({ block, delay = 0 }) {
  const [hovered, setHovered] = useState(false);
  const { index, data, hash, timestamp_readable, nonce } = block;

  const colors = [
    { bg: "linear-gradient(135deg, #007aff, #5856d6)", light: "#e8f0fe" },
    { bg: "linear-gradient(135deg, #34c759, #30b955)", light: "#e8f8ed" },
    { bg: "linear-gradient(135deg, #ff9500, #ff6b00)", light: "#fff5e6" },
    { bg: "linear-gradient(135deg, #ff2d55, #ff375f)", light: "#fff0f2" },
    { bg: "linear-gradient(135deg, #5ac8fa, #007aff)", light: "#e6f5ff" },
    { bg: "linear-gradient(135deg, #af52de, #5856d6)", light: "#f3effe" },
  ];
  const c = colors[index % colors.length];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="card anim-fade-up"
      style={{
        animationDelay: `${delay}s`,
        transform: hovered ? "translateY(-4px) scale(1.01)" : "translateY(0) scale(1)",
        boxShadow: hovered ? "0 16px 48px rgba(0,0,0,0.13), 0 4px 12px rgba(0,0,0,0.06)" : "var(--shadow)",
        transition: "transform 0.3s var(--spring), box-shadow 0.3s var(--ease-out)",
        overflow: "visible",
        cursor: "pointer",
      }}
    >
      {/* Color strip header */}
      <div style={{
        background: c.bg,
        borderRadius: "16px 16px 0 0",
        padding: "14px 18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <span style={{
          background: "rgba(255,255,255,0.22)",
          color: "#fff",
          fontSize: 11, fontWeight: 700,
          padding: "3px 9px", borderRadius: 980,
          backdropFilter: "blur(8px)"
        }}>Block #{index}</span>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", display: "flex", alignItems: "center", gap: 4 }}>
          <Clock size={10}/> {timestamp_readable?.split(" ")[0]}
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: "16px 18px 14px" }}>
        <h3 style={{
          fontSize: 17, fontWeight: 700, letterSpacing: "-0.02em",
          marginBottom: 6, lineHeight: 1.3,
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden"
        }}>
          {data?.title || "Untitled"}
        </h3>
        <p style={{
          fontSize: 14, color: "var(--ios-label2)", lineHeight: 1.6, marginBottom: 12,
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden"
        }}>
          {data?.content}
        </p>

        {/* Tags */}
        {data?.tags?.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
            {data.tags.slice(0, 3).map((t, i) => (
              <span key={i} className="pill" style={{ background: c.light, color: "var(--ios-label2)", fontSize: 11 }}>
                {t}
              </span>
            ))}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 13, color: "var(--ios-gray)", display: "flex", alignItems: "center", gap: 4 }}>
            <User size={12}/> {data?.author || "Anonymous"}
          </span>
          <Link to={`/post/${index}`}
            style={{
              display: "flex", alignItems: "center", gap: 2,
              fontSize: 13, fontWeight: 600, color: "var(--ios-blue)",
              textDecoration: "none"
            }}
            onClick={(e) => e.stopPropagation()}>
            Read <ChevronRight size={14}/>
          </Link>
        </div>
      </div>

      {/* Hash footer */}
      <div style={{ padding: "8px 18px 12px", borderTop: "1px solid var(--ios-sep)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <Hash size={10} color="var(--ios-gray3)"/>
          <span className="mono">{hash?.substring(0, 20)}…</span>
          <span className="mono" style={{ marginLeft: "auto" }}>nonce {nonce}</span>
        </div>
      </div>
    </div>
  );
}
