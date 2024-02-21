import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URI } from "../Backend_URI";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const addProduct = async () => {
    if (!name || !price || !category || !company) {
      setError(true);
      return false;
    }

    // console.log(name, price, category, company);
    const userId = JSON.parse(localStorage.getItem("user"))._id;
    let result = await fetch(`${BACKEND_URI}/add-product`, {
      method: "post",
      body: JSON.stringify({ name, price, category, company, userId }),
      headers: {
        "Content-Type": "application/json",
        jwt: `${JSON.parse(localStorage.getItem("token"))}`,
      },
    });
    result = await result.json();
    console.log(result);
    alert("producted added");
    navigate("/");

    // console.log(userId);
  };

  return (
    <div className="addProduct">
      <h1>Add Product </h1>
      <input
        type="text"
        placeholder="Enter product name"
        className="inputbox"
        value={name}
        onChange={(e) => setName(e.target.value)}
      ></input>
      {error && !name && (
        <span className="invalid-input">Enter valid name</span>
      )}
      <input
        type="number"
        placeholder="Enter product price"
        className="inputbox"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      ></input>
      {error && !price && (
        <span className="invalid-input">Enter valid price</span>
      )}
      {/* {console.log("price",!price)} */}
      <input
        type="text"
        placeholder="Enter product category"
        className="inputbox"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      ></input>
      {error && !category && (
        <span className="invalid-input">Enter valid category</span>
      )}

      <input
        type="text"
        placeholder="Enter product company"
        className="inputbox"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      ></input>
      {error && !company && (
        <span className="invalid-input">Enter valid comapny</span>
      )}

      <button onClick={addProduct} className="appButton">
        Add Product
      </button>
    </div>
  );
};

export default AddProduct;
