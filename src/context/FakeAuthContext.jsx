/* eslint-disable react/prop-types */

import { createContext, useContext, useReducer } from "react";
const AuthContext = createContext();
const inititalState = { user: null, isAuthenticated: false, error: "" };

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return { ...state, isAuthenticated: true, user: action.payload };
    case "logout":
      return { ...state, isAuthenticated: false, user: null };
    case "error":
      return { ...state, error: action.payload };
    default:
      throw new Error("Unknown DISPACH");
  }
}

const FAKE_USER = {
  name: "Jack",
  email: "jack@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

function AuthProvider({ children }) {
  const [{ user, isAuthenticated, error }, dispach] = useReducer(
    reducer,
    inititalState
  );

  function login(email, password) {
    if (FAKE_USER.email === email && FAKE_USER.password === password) {
      dispach({ type: "login", payload: FAKE_USER });
    } else
      dispach({ type: "error", payload: "email or password is not current" });
  }

  function logout() {
    dispach({ type: "logout" });
  }

  return (
    <AuthContext.Provider
      value={{ login, logout, user, isAuthenticated, error }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("not value in AuthContex");
  return context;
}
export { AuthProvider, useAuth };
