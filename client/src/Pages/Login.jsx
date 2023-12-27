import React, {
  useEffect,
  useState,
} from "react";
import {
  useNavigate,
  Link,
} from "react-router-dom";
import axios from "../api/axios";

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
        console.log(result.data);
        if (result.data.status === "success") {
          console.log(result.data);
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
    <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email</strong>
            </label>
            <input
              type="text"
              placeholder="Enter email"
              autoComplete="off"
              name="email"
              className="form-control rounded-0"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Password</strong>
            </label>
            <input
              type="password"
              placeholder="Enter password"
              name="password"
              className="form-control rounded-0"
              onChange={(e) => {
                setPass(e.target.value);
              }}
            />
          </div>
          <p>Don't have an account?</p>
          <button
            type="submit"
            className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
