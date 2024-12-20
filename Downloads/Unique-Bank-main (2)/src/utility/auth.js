import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

  const login = (email, jwt) => {
    setEmail(email);
    setToken(token);
  };

  const logout = () => {
    setEmail(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, email, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
