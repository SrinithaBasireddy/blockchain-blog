import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../utils/api";
import { useAuth } from "../utils/AuthContext";
import { PenLine, X, Cpu, CheckCircle2, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

export default function Write() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", content: "", tags: [] });
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mined, setMined] = useState(null);

  const addTag = (e) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      if (!form.tags.includes(tagInput.trim()) && form.tags.length < 5)
        setForm(f => ({ ...f, tags: [...f.tags, tagInput.trim()] }));
      setTagInput("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) { toast.error("Title and content required"); return; }
    setLoading(true);
    const tid = toast.loading("⛏️ Mining block…");
    try {
      const res = await createPost({ ...form, author: user?.username || "Anonymous" });
      toast.success("Block mined!", { id: tid });
      setMined(res.data.block);
    } catch (err) {
      toast.error(err.response?.data?.error || "Error", { id: tid });
    } finally { setLoading(false); }
  };

  if (mined) return (
    <div className="container page" style={{ maxWidth: 560 }}>
      <div className="card anim-scale-in" style={{ textAlign: "center", padding: "40px 32px" }}>
        <div style={{
          width: 72, height: 72, borderRadius: 20,
          background: "linear-gradient(135deg,#34c759,#00b347)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 16px",
          boxShadow: "0 8px 24px rgba(52,199,89,0.35)"
        }}>
          <CheckCircle2 size={36} color="#fff"/>
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 6 }}>Block Mined!</h2>
        <p style={{ color: "var(--ios-label2)", fontSize: 15, marginBottom: 24 }}>
          Your post is now permanently on the blockchain.
        </p>

        <div style={{ background: "var(--ios-bg)", borderRadius: 14, padding: "16px 18px",
          textAlign: "left", marginBottom: 24 }}>
          {[
            { label: "Block Index", value: `#${mined.index}` },
            { label: "SHA-256 Hash", value: mined.hash, mono: true },
            { label: "Nonce", value: String(mined.nonce) },
          ].map(({ label, value, mono }) => (
            <div key={label} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--ios-gray)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>{label}</div>
              <div className={mono ? "mono" : ""} style={{ fontSize: mono ? 11 : 15, fontWeight: mono ? 400 : 700, color: "var(--ios-label)", wordBreak: "break-all" }}>
                {value}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => navigate(`/post/${mined.index}`)}>
            <ExternalLink size={15}/> View Post
          </button>
          <button className="btn btn-secondary" style={{ flex: 1 }}
            onClick={() => { setMined(null); setForm({ title: "", content: "", tags: [] }); }}>
            Write Another
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container page" style={{ maxWidth: 680 }}>
      <div className="anim-fade-up" style={{ marginBottom: 24 }}>
        <h1 className="section-header">New Post</h1>
        <p className="section-sub">Published as an immutable block on the blockchain</p>
      </div>

      {!user && (
        <div className="anim-fade-up delay-1" style={{
          background: "#fff9e6", border: "1px solid #ffd84d", borderRadius: 14,
          padding: "12px 16px", marginBottom: 16, fontSize: 14, color: "#7a5c00",
          display: "flex", alignItems: "center", gap: 8
        }}>
          ⚠️ Not signed in — post will be published as "Anonymous"
        </div>
      )}

      <div className="card anim-fade-up delay-2" style={{ padding: "24px" }}>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 20 }}>
          <div>
            <label className="label">Title</label>
            <input className="input" placeholder="Give your post a compelling title…"
              value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}/>
          </div>

          <div>
            <label className="label">Content</label>
            <textarea className="input" placeholder="Write your thoughts…"
              rows={9} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}/>
          </div>

          <div>
            <label className="label">Tags <span style={{ fontSize: 11, textTransform: "none", color: "var(--ios-gray2)" }}>(press Enter to add, max 5)</span></label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
              {form.tags.map(t => (
                <span key={t} className="pill pill-blue" style={{ cursor: "pointer" }} onClick={() => setForm(f => ({ ...f, tags: f.tags.filter(x => x !== t) }))}>
                  {t} <X size={11}/>
                </span>
              ))}
            </div>
            <input className="input" placeholder="blockchain, web3, technology…"
              value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={addTag}/>
          </div>

          {/* PoW notice */}
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            background: "var(--ios-blue-light)", borderRadius: 12, padding: "12px 16px"
          }}>
            <div className="icon-box" style={{ background: "var(--ios-blue)", width: 34, height: 34, borderRadius: 9 }}>
              <Cpu size={17} color="#fff"/>
            </div>
            <p style={{ fontSize: 13, color: "var(--ios-blue)", lineHeight: 1.5 }}>
              Publishing mines a new SHA-256 block using <strong>Proof of Work</strong>. This takes a moment.
            </p>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}
            style={{ width: "100%", padding: "14px", fontSize: 16, borderRadius: 14, letterSpacing: "-0.01em" }}>
            {loading ? "⛏️ Mining Block…" : "⛏️ Mine & Publish"}
          </button>
        </form>
      </div>
    </div>
  );
}
