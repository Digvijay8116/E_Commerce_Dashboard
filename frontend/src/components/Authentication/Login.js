import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {BACKEND_URI} from "../Backend_URI"

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem("user");
    if (auth) {
      navigate("/");
    }
  });

  let handleLogin = async () => {
    console.log(email, password);
    let result = await fetch(`${BACKEND_URI}/login`, {
      method: "post",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    result = await result.json();
    if (result.auth) {
      localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.setItem("token", JSON.stringify(result.auth));

      navigate("/");
    } else {
      alert(result.result);
    }
  };

  return (
    <div className="login">
      <h1>Login</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <input
          type="email"
          className="inputbox"
          placeholder="enter email"
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <input
          type="password"
          className="inputbox"
          placeholder="enter password"
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <input
          className="appButton"
          type="button"
          value="Forget Password"
          onClick={() => navigate("/forget")}
        />
        <input
          className="appButton"
          type="submit"
          value="LOGIN"
          // onClick={() => handleLogin()}
        />
      </form>
    </div>
  );
};

export default Login;
