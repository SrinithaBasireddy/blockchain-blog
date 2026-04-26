import axios from "axios";

const API = axios.create({ baseURL: "/api" });

API.interceptors.request.use((cfg) => {
  const u = JSON.parse(localStorage.getItem("bb_user") || "{}");
  if (u.token) cfg.headers.Authorization = `Bearer ${u.token}`;
  return cfg;
});

export const register = (d) => API.post("/register", d);
export const login = (d) => API.post("/login", d);
export const getPosts = () => API.get("/posts");
export const getPost = (i) => API.get(`/posts/${i}`);
export const createPost = (d) => API.post("/posts", d);
export const searchPosts = (q) => API.get(`/search?q=${encodeURIComponent(q)}`);
export const getBlockchain = () => API.get("/blockchain");
export const verifyBlockchain = () => API.get("/blockchain/verify");
export const verifyBlock = (idx) => API.get(`/blockchain/verify/${idx}`);
export const getStats = () => API.get("/blockchain/stats");
export const getHealth = () => API.get("/health");

export default API;
