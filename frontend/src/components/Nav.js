import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URI } from "./Backend_URI";

const Nav = () => {
  const navigate = useNavigate();

  const auth = localStorage.getItem("user");

  const logout = () => {
    localStorage.clear();
    navigate("/signup");
  };
  let data = false;

  //this function is used to check whether the user is present inside the data base or not
  const checkUser = async () => {
    const id = JSON.parse(localStorage.getItem("user"))._id;
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
    <div className="nav-position">
      <img className="logo" src="E-Commerce.png" alt="logo"></img>
      {auth ? (
        <ul className="nav-ul">
          <li>
            <Link to="/">Products</Link>
          </li>
          <li>
            <Link to="/add">Add Products</Link>
          </li>
          {data ? (
            <li>
              <Link to="/update">Update Product</Link>
            </li>
          ) : null}
          <li>
            <Link to="/Profile">Profile</Link>
          </li>
          {/* <li>
            <Link to="/chats">Click to chat</Link>
          </li> */}
          <li>
            <Link onClick={checkUser}>Click to chat</Link>
          </li>
          <li>
            <Link onClick={logout} to="/signup">
              Logout ({JSON.parse(auth).name})
            </Link>
          </li>
        </ul>
      ) : (
        <ul className="nav-ul nav-right">
          <li>
            <Link to="/signup">SignUP</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
        </ul>
      )}
    </div>
  );
};

export default Nav;
