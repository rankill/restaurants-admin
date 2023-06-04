import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";

function UserForm({
  user,
  formError,
  submitButtonText = "Create User",
  handleSubmit,
  history,
}) {
  const [name, setName] = useState(user ? user.name : "");
  const [nameError, setNameError] = useState(null);
  const [email, setEmail] = useState(user ? user.email : "");
  const [emailError, setEmailError] = useState(null);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(null);
  const [role, setRole] = useState(user ? user.role : "user");
  const [submitted, setSubmitted] = useState(false);
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

    if (!user && password.length === 0) {
      setPasswordError("Password is required");
      hasError = true;
    } else {
      setPasswordError(null);
    }
    return !hasError;
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!validateForm()) {
      return;
    }
    const formData = {
      name,
      email,
      role,
    };
    if (password.length > 0) {
      formData["password"] = password;
    }

    handleSubmit(formData);
  };
  useEffect(() => {
    if (submitted) {
      validateForm();
    }
  }, [name, email, password, submitted]);

  const cancel = (e) => {
    e.preventDefault();
    history.push("/users");
  };

  return (
    <form onSubmit={submitForm}>
      <div className="form-group row">
        <label className="col-md-4 col-form-label text-md-right">Name</label>

        <div className="col-md-6">
          <input
            id="name"
            type="text"
            className={"form-control" + (nameError ? " is-invalid" : "")}
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
            className={"form-control" + (emailError ? " is-invalid" : "")}
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
            className={"form-control" + (passwordError ? " is-invalid" : "")}
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
          User Type
        </label>

        <div className="col-md-6">
          <select
            className="form-control"
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
            }}
          >
            <option value="regular">Regular</option>
            <option value="owner">Restaurant Owner</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      <div className="form-group row mb-0">
        <div className="col-md-6 offset-md-4">
          {formError && (
            <div className="pb-3 text-danger">
              <strong>{formError}</strong>
            </div>
          )}
          <button type="submit" className="btn btn-primary">
            {submitButtonText}
          </button>
          <button className="ml-2 btn btn-secondary" onClick={cancel}>
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}

export default withRouter(UserForm);
