import React, { useState, useEffect } from "react";
import { verifyBlockchain, verifyBlock, getBlockchain, getStats } from "../utils/api";
import {
  ShieldCheck, ShieldX, ChevronRight, ChevronDown, ChevronUp,
  Cpu, Hash, Link2, Layers, Search, CheckCircle2, XCircle, AlertCircle
} from "lucide-react";

// ── Single block result badge ─────────────────────────────────────────────
function CheckRow({ label, ok }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0",
      borderBottom: "1px solid var(--ios-sep)" }}>
      {ok
        ? <CheckCircle2 size={16} color="var(--ios-green)" />
        : <XCircle size={16} color="var(--ios-red)" />}
      <span style={{ fontSize: 14, fontWeight: 500,
        color: ok ? "var(--ios-green)" : "var(--ios-red)" }}>{label}</span>
      <span className="pill" style={{
        marginLeft: "auto", fontSize: 11,
        background: ok ? "#e8f8ed" : "#fff0ef",
        color: ok ? "var(--ios-green)" : "var(--ios-red)"
      }}>{ok ? "PASS" : "FAIL"}</span>
    </div>
  );
}

export default function Verify() {
  const [allResult, setAllResult] = useState(null);
  const [allLoading, setAllLoading] = useState(false);
  const [singleResult, setSingleResult] = useState(null);
  const [singleLoading, setSingleLoading] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState("");
  const [chain, setChain] = useState([]);
  const [stats, setStats] = useState(null);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    getBlockchain().then(r => setChain(r.data.chain)).catch(() => {});
    getStats().then(r => setStats(r.data)).catch(() => {});
  }, []);

  // Verify entire chain
  const handleVerifyAll = async () => {
    setAllLoading(true);
    setAllResult(null);
    await new Promise(r => setTimeout(r, 700));
    try {
      const res = await verifyBlockchain();
      setAllResult(res.data);
    } catch { setAllResult({ valid: false, errors: ["Could not reach server"] }); }
    finally { setAllLoading(false); }
  };

  // Verify single block
  const handleVerifySingle = async () => {
    if (selectedIdx === "") return;
    setSingleLoading(true);
    setSingleResult(null);
    await new Promise(r => setTimeout(r, 500));
    try {
      const res = await verifyBlock(selectedIdx);
      setSingleResult(res.data);
    } catch (e) {
      setSingleResult({ valid: false, errors: [e.response?.data?.error || "Error"] });
    } finally { setSingleLoading(false); }
  };

  const gradients = [
    "linear-gradient(135deg,#007aff,#5856d6)",
    "linear-gradient(135deg,#34c759,#30b955)",
    "linear-gradient(135deg,#ff9500,#ff6b00)",
    "linear-gradient(135deg,#ff2d55,#ff375f)",
    "linear-gradient(135deg,#5ac8fa,#007aff)",
    "linear-gradient(135deg,#af52de,#5856d6)",
  ];

  const posts = chain.filter(b => b.index > 0);

  return (
    <div className="container page">
      <div className="anim-fade-up" style={{ marginBottom: 28 }}>
        <h1 className="section-header">Verify Blockchain</h1>
        <p className="section-sub">Cryptographic integrity — verify one post or the entire chain</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid-3 anim-fade-up delay-1" style={{ marginBottom: 28 }}>
          {[
            { icon: <Layers size={18} color="#007aff"/>, label: "Total Blocks", value: stats.total_blocks, bg: "#e8f0fe" },
            { icon: <Cpu size={18} color="#ff9500"/>, label: "Difficulty", value: stats.difficulty, bg: "#fff5e6" },
            { icon: <Hash size={18} color="#34c759"/>, label: "Posts", value: stats.total_posts, bg: "#e8f8ed" },
          ].map(({ icon, label, value, bg }) => (
            <div key={label} className="card" style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px" }}>
              <div className="icon-box" style={{ background: bg, width: 38, height: 38, borderRadius: 10 }}>{icon}</div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em" }}>{value}</div>
                <div style={{ fontSize: 12, color: "var(--ios-gray)", fontWeight: 500 }}>{label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Two columns: verify single | verify all */}
      <div className="grid-2 anim-fade-up delay-2" style={{ marginBottom: 28, alignItems: "start" }}>

        {/* ── Verify Single Post ── */}
        <div className="card" style={{ padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div className="icon-box" style={{ background: "linear-gradient(135deg,#5856d6,#af52de)", width: 38, height: 38, borderRadius: 10 }}>
              <Search size={18} color="#fff"/>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>Verify One Post</div>
              <div style={{ fontSize: 12, color: "var(--ios-gray)" }}>Check a single block's integrity</div>
            </div>
          </div>

          {/* Post selector */}
          {posts.length === 0 ? (
            <div style={{ fontSize: 14, color: "var(--ios-gray)", padding: "16px 0", textAlign: "center" }}>
              No posts yet. Write one first!
            </div>
          ) : (
            <>
              <label className="label" style={{ marginBottom: 6 }}>Select Post</label>
              <select
                value={selectedIdx}
                onChange={e => { setSelectedIdx(e.target.value); setSingleResult(null); }}
                className="input"
                style={{ marginBottom: 12, cursor: "pointer" }}
              >
                <option value="">— Choose a post —</option>
                {posts.map(b => (
                  <option key={b.index} value={b.index}>
                    Block #{b.index} — {b.data?.title?.substring(0, 30)}{b.data?.title?.length > 30 ? "…" : ""}
                  </option>
                ))}
              </select>

              <button
                className="btn btn-primary"
                style={{ width: "100%", padding: "12px", borderRadius: 12 }}
                disabled={selectedIdx === "" || singleLoading}
                onClick={handleVerifySingle}
              >
                {singleLoading
                  ? <><span style={{ animation: "spin 0.8s linear infinite", display: "inline-block" }}>⟳</span> Verifying…</>
                  : <><ShieldCheck size={16}/> Verify This Post</>}
              </button>
            </>
          )}

          {/* Single result */}
          {singleResult && (
            <div className="anim-scale-in" style={{ marginTop: 16 }}>
              <div style={{
                background: singleResult.valid ? "#e8f8ed" : "#fff0ef",
                borderRadius: 12, padding: "14px 16px", marginBottom: 12,
                display: "flex", alignItems: "center", gap: 10
              }}>
                {singleResult.valid
                  ? <CheckCircle2 size={22} color="var(--ios-green)"/>
                  : <XCircle size={22} color="var(--ios-red)"/>}
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14,
                    color: singleResult.valid ? "var(--ios-green)" : "var(--ios-red)" }}>
                    {singleResult.valid ? "Block is Valid ✅" : "Block has Errors ❌"}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--ios-label2)" }}>
                    Block #{singleResult.block_index} — {singleResult.block?.data?.title}
                  </div>
                </div>
              </div>

              <CheckRow label="Hash Integrity" ok={singleResult.hash_valid} />
              <CheckRow label="Proof of Work" ok={singleResult.pow_valid} />
              <CheckRow label="Chain Link" ok={singleResult.link_valid} />

              {singleResult.errors?.length > 0 && (
                <div style={{ marginTop: 10 }}>
                  {singleResult.errors.map((e, i) => (
                    <div key={i} style={{ background: "#fff0ef", borderRadius: 8,
                      padding: "8px 12px", fontSize: 12, color: "var(--ios-red)", marginBottom: 4 }}>
                      ⚠️ {e}
                    </div>
                  ))}
                </div>
              )}

              {/* Hash details */}
              <div style={{ marginTop: 12, background: "var(--ios-bg)", borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: "var(--ios-gray)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Block Hash</div>
                <div className="mono">{singleResult.block?.hash}</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: "var(--ios-gray)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4, marginTop: 8 }}>Nonce</div>
                <div className="mono">{singleResult.block?.nonce}</div>
              </div>
            </div>
          )}
        </div>

        {/* ── Verify All Posts ── */}
        <div className="card" style={{ padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div className="icon-box" style={{
              background: allResult
                ? allResult.valid ? "linear-gradient(135deg,#34c759,#00b347)" : "linear-gradient(135deg,#ff3b30,#ff6b6b)"
                : "linear-gradient(135deg,#007aff,#5856d6)",
              width: 38, height: 38, borderRadius: 10,
              transition: "background 0.4s var(--spring)"
            }}>
              {allResult
                ? allResult.valid ? <ShieldCheck size={18} color="#fff"/> : <ShieldX size={18} color="#fff"/>
                : <ShieldCheck size={18} color="#fff"/>}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>Verify All Posts</div>
              <div style={{ fontSize: 12, color: "var(--ios-gray)" }}>Full cryptographic chain scan</div>
            </div>
          </div>

          <p style={{ fontSize: 13, color: "var(--ios-label2)", marginBottom: 16, lineHeight: 1.6 }}>
            Scans every block — checks SHA-256 hashes, chain links, and Proof of Work across the entire chain.
          </p>

          <button
            className="btn btn-primary"
            style={{ width: "100%", padding: "12px", borderRadius: 12,
              background: allResult
                ? allResult.valid ? "var(--ios-green)" : "var(--ios-red)"
                : undefined }}
            disabled={allLoading}
            onClick={handleVerifyAll}
          >
            {allLoading
              ? <><span style={{ animation: "spin 0.8s linear infinite", display: "inline-block" }}>⟳</span> Scanning chain…</>
              : allResult
                ? allResult.valid ? "✅ Chain Valid — Re-verify" : "❌ Errors Found — Re-verify"
                : <><ShieldCheck size={16}/> Verify Entire Chain</>}
          </button>

          {/* All result */}
          {allResult && (
            <div className="anim-scale-in" style={{ marginTop: 16 }}>
              <div style={{
                background: allResult.valid ? "#e8f8ed" : "#fff0ef",
                borderRadius: 12, padding: "16px",
                textAlign: "center", marginBottom: 12
              }}>
                {allResult.valid
                  ? <CheckCircle2 size={28} color="var(--ios-green)" style={{ margin: "0 auto 6px" }}/>
                  : <AlertCircle size={28} color="var(--ios-red)" style={{ margin: "0 auto 6px" }}/>}
                <div style={{ fontWeight: 800, fontSize: 16,
                  color: allResult.valid ? "var(--ios-green)" : "var(--ios-red)" }}>
                  {allResult.valid ? "All Blocks Verified" : "Integrity Issues Found"}
                </div>
                <div style={{ fontSize: 12, color: "var(--ios-label2)", marginTop: 4 }}>
                  {allResult.valid
                    ? `${allResult.chain_length} blocks — hash linking, PoW, and data integrity confirmed`
                    : `${allResult.errors?.length} error(s) detected in the chain`}
                </div>
              </div>

              {!allResult.valid && allResult.errors?.map((e, i) => (
                <div key={i} style={{ background: "#fff0ef", borderRadius: 8,
                  padding: "8px 12px", fontSize: 12, color: "var(--ios-red)", marginBottom: 4 }}>
                  ⚠️ {e}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chain Explorer */}
      <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 12 }}
        className="anim-fade-up delay-3">
        Chain Explorer
      </h2>

      <div className="card anim-fade-up delay-4" style={{ overflow: "hidden" }}>
        {chain.length === 0 && (
          <div style={{ padding: "32px", textAlign: "center", color: "var(--ios-gray)" }}>Loading chain…</div>
        )}
        {chain.map((block, i) => (
          <div key={block.index}>
            <div className="list-row" onClick={() => setExpanded(expanded === i ? null : i)}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: gradients[block.index % gradients.length],
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
              }}>
                <Link2 size={16} color="#fff"/>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>
                  {block.index === 0 ? "⚙️ Genesis Block" : block.data?.title}
                </div>
                <div className="mono" style={{ fontSize: 10, color: "var(--ios-gray2)" }}>
                  {block.hash?.substring(0, 28)}…
                </div>
              </div>
              <span className="pill pill-gray" style={{ fontSize: 11, marginRight: 4 }}>#{block.index}</span>
              {block.index > 0 && (
                <button
                  onClick={e => { e.stopPropagation(); setSelectedIdx(String(block.index)); setSingleResult(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="btn btn-secondary"
                  style={{ padding: "4px 10px", fontSize: 11, borderRadius: 8, marginRight: 6 }}
                >
                  Verify
                </button>
              )}
              {expanded === i ? <ChevronUp size={16} color="var(--ios-gray2)"/> : <ChevronRight size={16} color="var(--ios-gray3)"/>}
            </div>

            {expanded === i && (
              <div style={{
                background: "var(--ios-bg)", borderBottom: "1px solid var(--ios-sep)",
                padding: "14px 20px", animation: "fadeUp 0.2s var(--ease-out)"
              }}>
                {[
                  { k: "Block Hash", v: block.hash },
                  { k: "Previous Hash", v: block.previous_hash },
                  { k: "Nonce", v: String(block.nonce) },
                  { k: "Timestamp", v: block.timestamp_readable },
                  { k: "Difficulty", v: String(block.difficulty) },
                ].map(({ k, v }) => (
                  <div key={k} style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: "var(--ios-gray)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>{k}</div>
                    <div className="mono">{v}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
