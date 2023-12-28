import React, {
  useEffect,
  useState,
} from "react";
import {
  useNavigate,
  Link,
} from "react-router-dom";
import "../styles/login.css";
import axios from "../api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
} from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const [email, setEmail] = useState();
  const [pass, setPass] = useState();
  const navigate = useNavigate();
  // useEffect(() => {
  //   console.log("email", email);
  //   console.log("pass", pass);
  // }, [email, pass]);
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("users/login", {
        email: email,
        password: pass,
      })
      .then((result) => {
        console.log(result?.data);
        if (result?.data?.status === "success") {
          console.log(result?.data);
          sessionStorage.setItem(
            "user_email",
            email
          );
          navigate("/run");
        }
      })
      .catch((err) =>
        console.log(err.response.data)
      );
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>LOGIN</h2>
        <form
          onSubmit={handleSubmit}
          className="login-form"
        >
          <div className="input-container">
            <label htmlFor="email">
              {/* <strong>Email</strong> */}
            </label>
            <FontAwesomeIcon icon={faEnvelope} />
            <input
              type="text"
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
            <label htmlFor="email">
              {/* <strong>Password</strong> */}
            </label>
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
              navigate("/register");
            }}
            style={{ cursor: "pointer" }}
          >
            Don't have an account?
          </p>
          <button
            type="submit"
            className="submit-btn"
          >
            SUBMIT
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
