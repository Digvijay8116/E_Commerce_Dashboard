import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {BACKEND_URI} from "../Backend_URI"

export default function Chats() {
  const [id, setId] = useState(JSON.parse(localStorage.getItem("user"))._id);
  const navigate = useNavigate();

  const checkUser = async () => {
    let result = await fetch(`${BACKEND_URI}/chats/${id}`);
    result = await result.json();
    if (result.result) {
      alert("you are allowed");
      navigate(`/letsChat/${id}`);
    } else {
      alert("you are not allowed");
    }
  };

  return (
    <div className="login">
      <h1>User Check</h1>
      <input
        type="text"
        className="inputbox"
        placeholder="enter user Id"
        value={id}
        onChange={(e) => setId(e.target.value)}
      ></input>
      <button className="appButton" onClick={checkUser}>
        Check user
      </button>
    </div>
  );
}
