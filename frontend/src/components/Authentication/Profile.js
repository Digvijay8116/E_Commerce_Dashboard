import React, { useEffect, useState } from "react";
import {BACKEND_URI} from "../Backend_URI"

export default function Profile() {
  const [data, setData] = useState("");

  useEffect(() => {
    getProfile();
  }, []);

  const logedEmail = JSON.parse(localStorage.getItem("user")).email;
  const getProfile = async () => {
    let result = await fetch(`${BACKEND_URI}/profile/${logedEmail}`);
    result = await result.json();
    // console.log(result);
    setData(result);
  };
  console.log("profile data", data.name);

  //   console.log("email is",logedEmail);

  return (
    <div className="profile">
      <h1 style={{ textAlign: "center", fontSize: "100px" }}>Profile Detail</h1>
      <div className="pname" style={{ fontSize: "80px" }}>
        <label>Name :-</label>
        {data.name}
      </div>
      <div className="pemail" style={{ fontSize: "80px" }}>
        <label>Email :-</label>
        {data.email}
      </div>
    </div>
  );
}
