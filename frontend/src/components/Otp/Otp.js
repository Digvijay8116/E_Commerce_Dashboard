import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {BACKEND_URI} from "../Backend_URI"

export default function Otp() {
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const getOtp = async () => {
    let result = await fetch(`${BACKEND_URI}/loginotp`, {
      method: "post",
      body: JSON.stringify({ email }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    result = await result.json();
    console.log(result);
    if (result.success) {
      console.log("otp send");
      navigate(`/verifyotp/${email}`);
    } else {
      alert("enter correct details");
    }
  };

  return (
    <div className="otp">
      <h1>Forget Password</h1>
      <p>Enter Email</p>
      <input
        className="otp-box"
        type="text"
        placeholder="Enter email"
        onChange={(e) => setEmail(e.target.value)}
      ></input>
      <button className="appButton" onClick={getOtp}>
        Getotp
      </button>
    </div>
  );
}
