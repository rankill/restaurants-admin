import React, { useState, createContext, useContext } from "react";
import moment from "moment-timezone";

export const AuthContext = createContext();

export const AuthProvider = (props) => {
  const [auth, setAuth] = useState(JSON.parse(localStorage.getItem("auth")));
  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuthState = () => {
  const { auth, setAuth } = useContext(AuthContext);
  let isAuthenticated = false, authToken = null, authRole = null, authUser = null;
  if (auth) {
    const { token, user } = auth;
    if (moment(token.expiresIn) > moment()) {
      isAuthenticated = true;
      authToken = auth.accessToken;
      authRole = user.role;
      authUser = user;
    }
  }
  const logIn = (auth) => {
    setAuth(auth);
    localStorage.setItem("auth", JSON.stringify(auth));
  };

  const setAuthUser = (user) => {
    const newAuth = { ...auth, user };
    setAuth(newAuth);
    localStorage.setItem("auth", JSON.stringify(newAuth));
  }

  const logOut = () => {
    setAuth(null);
    localStorage.removeItem("auth");
  }
  
  return {
    isAuthenticated,
    authToken,
    authRole,
    authUser,
    setAuthUser,
    logIn,
    logOut
  };
};
