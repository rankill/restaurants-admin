import React from "react";
import { BrowserRouter as Router,  Switch } from "react-router-dom";
import routes from "./config/routes.js";
import { AuthProvider } from "./contexts/AuthContext";
import AppRoute from "./components/layout/AppRoute";
import Header from "./components/layout/Header";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Header />
          <div className="mt-2">
            <Switch>
              {routes.map((route) => (
                <AppRoute
                  key={route.path}
                  path={route.path}
                  roles={route.roles}
                  component={route.component}
                  components={route.components}
                  isPrivate={route.isPrivate}
                />
              ))}
            </Switch>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
