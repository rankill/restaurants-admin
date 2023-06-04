import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useAuthState } from "../../contexts/AuthContext";
const AppRoutes = ({
  component: Component,
  components,
  path,
  isPrivate,
  roles,
  ...rest
}) => {
  const { isAuthenticated, authRole } = useAuthState();
  if (components) {
    Component = components[authRole];
  }
  return (
    <Route
      exact path={path}
      render={(props) =>
        isPrivate && !isAuthenticated ? (
          <Redirect to={{ pathname: "/login" }} />
        ) : roles && !roles.includes(authRole) ? (
          <Redirect to={{ pathname: "/" }} />
        ) : (
          <Component {...props} />
        )
      }
      {...rest}
    />
  );
};

export default AppRoutes;
