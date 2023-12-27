import React, { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import "../styles/login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const Signup = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [pass, setPass] = useState();
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(
        "http://localhost:8080/api/v1/users",
        { name, email, password: pass }
      )
      .then((result) => {
        console.log(result);
        navigate("/login");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div
      className="login-container"
      style={{ backgroundColor: "#FDFD96" }}
    >
      <div className="login-box">
        <h2>REGISTER</h2>
        <form
          onSubmit={handleSubmit}
          className="login-form"
        >
          <div className="input-container">
            <label htmlFor="email"></label>
            <FontAwesomeIcon icon={faUser} />
            <input
              type="text"
              placeholder="Name"
              autoComplete="off"
              name="email"
              className="input-box"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
          <div className="input-container">
            <label htmlFor="email"></label>
            <FontAwesomeIcon icon={faEnvelope} />
            <input
              type="email"
              placeholder="Email"
              autoComplete="off"
              name="email"
              className="input-box"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div className="input-container">
            <label htmlFor="email"></label>
            <FontAwesomeIcon icon={faLock} />
            <input
              type="password"
              placeholder="Password"
              name="password"
              className="input-box"
              onChange={(e) => {
                setPass(e.target.value);
              }}
            />
          </div>
          <p
            onClick={() => {
              navigate("/login");
            }}
            style={{ cursor: "pointer" }}
          >
            Already have an account?
          </p>
          <button
            type="submit"
            className="submit-btn"
            style={{ backgroundColor: "#FDDD5C" }}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
