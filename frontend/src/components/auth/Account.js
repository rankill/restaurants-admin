import React, { useState, useEffect } from "react";
import { updateProfile } from "../../services";
import { useAuthState } from "../../contexts/AuthContext";

const Account = () => {
  const { authUser, setAuthUser } = useAuthState();
  const [name, setName] = useState(authUser.name);
  const [email, setEmail] = useState(authUser.email);
  const [password, setPassword] = useState("");
  const [nameError, setNameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (submitted) {
      validateInput();
    }
  }, [name, email, password]);

  const validateInput = () => {
    let hasError = false;

    if (name.trim().length === 0) {
      setNameError("Name is required.");
      hasError = true;
    } else {
      setNameError(null);
    }

    if (email.trim().length === 0) {
      setEmailError("Email is required.");
      hasError = true;
    } else {
      setEmailError(null);
    }

    return !hasError;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(true);
    if (validateInput()) {
      try {
        let data = { name, email };
        if (password && password.length > 0) {
          data["password"] = password;
        }
        const newProfile = await updateProfile(data);
        setAuthUser(newProfile);
        setMessage("Your profile has been updated successfully.");
        setSubmitError(null);
      } catch (e) {
        setSubmitError(e.message);
        setMessage(null);
      }
    }
  };

  const roleText = (role) => {
    if (role === "admin") {
      return "Admin";
    } else if (role === "regular") {
      return "Regular";
    } else if (role === "owner") {
      return "Owner";
    }
  };

  return (
    <div className="container">
      {message && <div className="alert alert-success">{message}</div>}
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">My Account Information</div>

            <div className="card-body">
              <form onSubmit={handleSubmit}>
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
                      className="form-control"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-md-4 col-form-label text-md-right">
                    User Type
                  </label>

                  <div className="col-md-6">
                    <label className="col-form-label text-md-right">
                      {roleText(authUser.role)}
                    </label>
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
                      Update Account Information
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
};
export default Account;
