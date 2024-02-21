import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {BACKEND_URI} from "../Backend_URI"

export default function UpdatePassword() {
  const [updatedPass, setupdatedPass] = useState("");
    const params =useParams()
    const navigate = useNavigate()
  const updatePass = async () => {
    // console.log(updatedPass);
    let password =updatedPass 
    let result = await fetch(`${BACKEND_URI}/updatepassword/${params.email}`,{
        method: "put",
        body: JSON.stringify({ password }),
        headers: {
          "Content-Type": "application/json",
        },
    })
    result= await result.json()
    console.log(result);
    alert("password updated")

    if(alert){
        navigate('/login')
    }

  };
  return (
    <div className="updatePass">
      <h1>Enter new password</h1>
      <input
        className="updatepass-box"
        type="text"
        placeholder="enter new Password"
        onChange={(e) => setupdatedPass(e.target.value)}
      ></input>
      <button onClick={updatePass} className="appButton" type="button">
        Update Password
      </button>
    </div>
  );
}
