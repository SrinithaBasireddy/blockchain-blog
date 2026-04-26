import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchPosts } from "../utils/api";
import BlockCard from "../components/BlockCard";
import { Search } from "lucide-react";

export default function SearchResults() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!q) { setLoading(false); return; }
    setLoading(true);
    searchPosts(q).then(r => setResults(r.data.results)).catch(() => {}).finally(() => setLoading(false));
  }, [q]);

  return (
    <div className="container page">
      <div className="anim-fade-up" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <Search size={20} color="var(--ios-blue)"/>
          <h1 className="section-header" style={{ fontSize: 24 }}>Search Results</h1>
        </div>
        <p className="section-sub">
          {results.length} result{results.length !== 1 ? "s" : ""} for "
          <strong style={{ color: "var(--ios-blue)" }}>{q}</strong>"
        </p>
      </div>

      {loading ? <div className="spinner"/> : results.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "48px 24px" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
          <p style={{ color: "var(--ios-label2)" }}>No posts found for "{q}"</p>
        </div>
      ) : (
        <div className="grid-3">
          {results.map((b, i) => <BlockCard key={b.index} block={b} delay={i * 0.05}/>)}
        </div>
      )}
    </div>
  );
}
