import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./utils/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Posts from "./pages/Posts";
import PostDetail from "./pages/PostDetail";
import Write from "./pages/Write";
import Verify from "./pages/Verify";
import Login from "./pages/Login";
import SearchResults from "./pages/Search";
import "./index.css";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(20px)",
              color: "#1c1c1e",
              border: "1px solid rgba(60,60,67,0.12)",
              borderRadius: "14px",
              fontFamily: "var(--font)",
              fontSize: "14px",
              fontWeight: 500,
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              padding: "12px 18px",
            },
            success: { iconTheme: { primary: "#34c759", secondary: "#fff" } },
            error:   { iconTheme: { primary: "#ff3b30", secondary: "#fff" } },
            loading: { iconTheme: { primary: "#007aff", secondary: "#fff" } },
          }}
        />
        <Navbar />
        <main>
          <Routes>
            <Route path="/"         element={<Home />} />
            <Route path="/posts"    element={<Posts />} />
            <Route path="/post/:index" element={<PostDetail />} />
            <Route path="/write"    element={<Write />} />
            <Route path="/verify"   element={<Verify />} />
            <Route path="/login"    element={<Login />} />
            <Route path="/search"   element={<SearchResults />} />
          </Routes>
        </main>
        <footer style={{
          borderTop: "1px solid var(--ios-sep)",
          padding: "20px 0",
          textAlign: "center",
          fontSize: 12,
          color: "var(--ios-gray2)",
          fontFamily: "var(--font)",
          background: "rgba(242,242,247,0.8)",
          backdropFilter: "blur(12px)",
        }}>
          BlockBlog · Decentralized · SHA-256 · Proof of Work
        </footer>
      </BrowserRouter>
    </AuthProvider>
  );
}
