import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "../utils/api";
import { useAuth } from "../utils/AuthContext";
import { Layers, LogIn, UserPlus } from "lucide-react";
import toast from "react-hot-toast";

export default function Login() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) { toast.error("All fields required"); return; }
    setLoading(true);
    try {
      if (mode === "register") {
        await register(form);
        toast.success("Account created! Sign in.");
        setMode("login");
      } else {
        const res = await login(form);
        loginUser({ username: res.data.username, token: res.data.token });
        toast.success(`Welcome, ${res.data.username}!`);
        navigate("/");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 20px" }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        {/* App icon */}
        <div className="anim-scale-in" style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20,
            background: "linear-gradient(135deg,#007aff,#5856d6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 14px",
            boxShadow: "0 8px 32px rgba(0,122,255,0.35)"
          }}>
            <Layers size={34} color="#fff"/>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 4 }}>
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h1>
          <p style={{ fontSize: 15, color: "var(--ios-label2)" }}>
            {mode === "login" ? "Sign in to BlockBlog" : "Join the decentralized network"}
          </p>
        </div>

        <div className="card anim-fade-up" style={{ padding: "28px 24px" }}>
          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
            <div>
              <label className="label">Username</label>
              <input className="input" placeholder="satoshi"
                value={form.username} onChange={e => setForm({ ...form, username: e.target.value })}
                autoCapitalize="none" autoCorrect="off"/>
            </div>
            <div>
              <label className="label">Password</label>
              <input className="input" type="password" placeholder="••••••••"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}/>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{ width: "100%", padding: "14px", fontSize: 16, borderRadius: 14, marginTop: 4 }}>
              {loading ? "Loading…" : mode === "login"
                ? <><LogIn size={17}/> Sign In</>
                : <><UserPlus size={17}/> Create Account</>}
            </button>
          </form>

          <div className="divider"/>

          <p style={{ textAlign: "center", fontSize: 14, color: "var(--ios-label2)" }}>
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setMode(mode === "login" ? "register" : "login")}
              style={{ background: "none", border: "none", color: "var(--ios-blue)",
                fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "var(--font)" }}>
              {mode === "login" ? "Register" : "Sign In"}
            </button>
          </p>
        </div>

        <p className="anim-fade-up delay-3" style={{ textAlign: "center", fontSize: 12,
          color: "var(--ios-gray2)", marginTop: 16, lineHeight: 1.5 }}>
          Demo project — passwords stored in plaintext.<br/>Add bcrypt for production use.
        </p>
      </div>
    </div>
  );
}
