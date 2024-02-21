import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {BACKEND_URI} from "../Backend_URI"

export default function VerifyOtp() {
  const params = useParams();
  const [otp, setOtp] = useState("");
  const navigate = useNavigate()  

  let verifyOtp = async () => {
    let result = await fetch(
      `${BACKEND_URI}/verifyotp/${params.email}`,
      {
        method: "put",
        body: JSON.stringify({ otp }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    result = await result.json();

    if (result.value) {
      console.log("verifyOtp", result);
      navigate(`/updatepassword/${params.email}`)
      
    } else {
      console.log("verifyOtp", result);
    }
  };

  return (
    <div className="otp">
      <h1>Enter Otp</h1>
      <input
        className="otp-box"
        type="text"
        placeholder="enter otp"
        onChange={(e) => setOtp(e.target.value)}
      ></input>
      {/* {console.log(otp)} */}

      <button onClick={verifyOtp} className="appButton">
        Verify Otp
      </button>
    </div>
  );
}
