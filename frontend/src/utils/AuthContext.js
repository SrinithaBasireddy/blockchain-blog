import React, { createContext, useContext, useState } from "react";

const Ctx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("bb_user") || "null"); }
    catch { return null; }
  });

  const loginUser = (u) => { localStorage.setItem("bb_user", JSON.stringify(u)); setUser(u); };
  const logoutUser = () => { localStorage.removeItem("bb_user"); setUser(null); };

  return <Ctx.Provider value={{ user, loginUser, logoutUser }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
