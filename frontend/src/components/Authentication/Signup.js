import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {BACKEND_URI} from "../Backend_URI"

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [lat, setLat] = useState("");
  const [long, setLong] = useState("");
  const navigate = useNavigate();

  let otp = "asdf"; // this line is used to to store default value in the database so that no error will acuur at the time of sign up
  const collectData = async () => {
    let result = await fetch(`${BACKEND_URI}/register`, {
      method: "post",
      body: JSON.stringify({ name, email, password, lat, long, otp }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    result = await result.json();

    if (!result.auth) {
      alert(result.result);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="register">
      <h1>Register</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          collectData();
        }}
      >
        <input
          className="inputbox"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        ></input>

        <input
          className="inputbox"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        ></input>

        <input
          className="inputbox"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        ></input>
        <input
          className="inputbox"
          type="text"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          placeholder="Enter your latitude"
        ></input>
        <input
          className="inputbox"
          type="text"
          value={long}
          onChange={(e) => setLong(e.target.value)}
          placeholder="Enter your longitude"
        ></input>

        <input
          className="appButton"
          type="submit"
          value="Signup"
          // onClick={ ()=>collectData()}
        />
      </form>
    </div>
  );
};

export default SignUp;
