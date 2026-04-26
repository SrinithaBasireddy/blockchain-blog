import React, { useEffect, useState } from "react";
import { getPosts } from "../utils/api";
import BlockCard from "../components/BlockCard";
import { Layers } from "lucide-react";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPosts().then(r => setPosts(r.data.posts.reverse())).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="container page">
      <div className="anim-fade-up" style={{ marginBottom: 24 }}>
        <h1 className="section-header">All Posts</h1>
        <p className="section-sub">{posts.length} posts on the blockchain</p>
      </div>

      {loading ? <div className="spinner"/> : posts.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "48px 24px", color: "var(--ios-label2)" }}>
          No posts yet.
        </div>
      ) : (
        <div className="grid-3">
          {posts.map((b, i) => <BlockCard key={b.index} block={b} delay={i * 0.04}/>)}
        </div>
      )}
    </div>
  );
}
