import React, { useState, useEffect } from "react";
import { register } from "../../services";
import { useAuthState } from '../../contexts/AuthContext';

export default function Login({ history }) {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(null);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [role, setRole] = useState("regular");
  const [submitted, setSubmitted] = useState(null);
  const authState = useAuthState();

  const validateForm = () => {
    let hasError = false;
    if (name.length === 0) {
      setNameError("Name is required");
      hasError = true;
    } else {
      setNameError(null);
    }
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
      if (password !== confirmPassword) {
        setConfirmPasswordError("Confirm password doesn't match");
        hasError = true;
      } else {
        setConfirmPasswordError(null);
      }
    }
    return !hasError;
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!validateForm()) {
      return;
    }
    setSubmitError(null);
    try {
      const data = await register({ name, email, password, role });
      authState.logIn(data);
      history.push("/");
    } catch (e) {
      setSubmitError(e.message);
    }
  };

  useEffect(() => {
    if (submitted) {
      validateForm();
    }
  }, [name, email, password, confirmPassword])


  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">Register</div>

            <div className="card-body">
              <form onSubmit={submitForm}>
                <div className="form-group row">
                  <label className="col-md-4 col-form-label text-md-right">
                    Name
                  </label>

                  <div className="col-md-6">
                    <input
                      id="name"
                      type="text"
                      className={
                        "form-control" + (nameError ? " is-invalid" : "")
                      }
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    {nameError && (
                      <span className="invalid-feedback" role="alert">
                        <strong>{nameError}</strong>
                      </span>
                    )}
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-md-4 col-form-label text-md-right">
                    Email Address
                  </label>

                  <div className="col-md-6">
                    <input
                      id="email"
                      type="email"
                      className={
                        "form-control" + (emailError ? " is-invalid" : "")
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
                        "form-control" + (passwordError ? " is-invalid" : "")
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

                <div className="form-group row">
                  <label className="col-md-4 col-form-label text-md-right">
                    Confirm Password
                  </label>

                  <div className="col-md-6">
                    <input
                      id="password-confirm"
                      type="password"
                      className={
                        "form-control" +
                        (confirmPasswordError ? " is-invalid" : "")
                      }
                      name="password_confirmation"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {confirmPasswordError && (
                      <span className="invalid-feedback" role="alert">
                        <strong>{confirmPasswordError}</strong>
                      </span>
                    )}
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-md-4 col-form-label text-md-right">
                    User Type
                  </label>

                  <div className="col-md-6">
                    <div className="btn-group">
                      <button
                        type="button"
                        className={
                          "btn " +
                          (role === "regular"
                            ? "btn-secondary"
                            : "btn-outline-secondary")
                        }
                        onClick={() => setRole("regular")}
                      >
                        Customer
                      </button>
                      <button
                        type="button"
                        className={
                          "btn " +
                          (role === "owner"
                            ? "btn-secondary"
                            : "btn-outline-secondary")
                        }
                        onClick={() => setRole("owner")}
                      >
                        Restaurant Owner
                      </button>
                    </div>
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
                      Register
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
