import React, { useState, useEffect } from "react";
import { login } from '../../services';
import { useAuthState } from "../../contexts/AuthContext";

export default function Login({ history }) {

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const authState = useAuthState();

  const validateForm = () => {
    let hasError = false;
    if (email.length === 0) {
      setEmailError("Email is required");
      hasError = true;
    } else {
      setEmailError(null);
    }
    if (password.length === 0) {
      setPasswordError("Password is required");
      hasError = true;
    } else {
      setPasswordError(null);
    }
    return !hasError;
  };

  const submitLogin = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!validateForm()) {
      return;
    }
    setSubmitError(null);
    try {
      const data = await login({ email, password });
      authState.logIn(data);
      history.push('/');
    } catch (e) {
      setSubmitError(e.message);
    }
  };

  useEffect(() => {
    if (submitted) {
      validateForm();
    }
  }, [email, password])

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">Login</div>

            <div className="card-body">
              <form onSubmit={submitLogin}>
                <div className="form-group row">
                  <label className="col-md-4 col-form-label text-md-right">
                    Email Address
                  </label>

                  <div className="col-md-6">
                    <input
                      id="email"
                      type="email"
                      className={
                        "form-control" +
                        (emailError ? " is-invalid" : "")
                      }
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {emailError && (
                      <span className="invalid-feedback" role="alert">
                        <strong>{emailError}</strong>
                      </span>
                    )}
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-md-4 col-form-label text-md-right">
                    Password
                  </label>

                  <div className="col-md-6">
                    <input
                      id="password"
                      type="password"
                      className={
                        "form-control" +
                        (passwordError ? " is-invalid" : "")
                      }
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {passwordError && (
                      <span className="invalid-feedback" role="alert">
                        <strong>{passwordError}</strong>
                      </span>
                    )}
                  </div>
                </div>

                <div className="form-group row mb-0">
                  <div className="col-md-6 offset-md-4">
                    {submitError && (
                      <div className="pb-3 text-danger">
                        <strong>{submitError}</strong>
                      </div>
                    )}
                    <button type="submit" className="btn btn-primary">
                      Login
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
