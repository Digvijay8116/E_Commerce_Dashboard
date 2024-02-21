import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BACKEND_URI } from "../Backend_URI";

const UpdateProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [company, setCompany] = useState("");
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getProductDetail();
  }, []);

  //this api is used to display data on the UI
  const getProductDetail = async () => {
    console.log("asdfasdf", params);
    let result = await fetch(`${BACKEND_URI}/product/${params.id}`, {
      headers: {
        jwt: `${JSON.parse(localStorage.getItem("token"))}`,
      },
    });
    result = await result.json();
    // console.log(result);
    setName(result.name);
    setPrice(result.price);
    setCategory(result.category);
    setCompany(result.company);
  };
  //this api is used to update data in the backend
  const updateProduct = async () => {
    // console.log(name, price, category, company);
    let result = await fetch(`${BACKEND_URI}/product/${params.id}`, {
      method: "Put",
      body: JSON.stringify({ name, price, category, company }),
      headers: {
        "Content-Type": "application/json",
        jwt: `${JSON.parse(localStorage.getItem("token"))}`,
      },
    });
    result = await result.json();
    console.log(result);
    navigate("/");
  };

  return (
    <div className="updateProduct">
      <h1>Update Product </h1>
      <input
        type="text"
        placeholder="Enter product name"
        className="inputbox"
        value={name}
        onChange={(e) => setName(e.target.value)}
      ></input>
      <input
        type="number"
        placeholder="Enter product price"
        className="inputbox"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      ></input>

      <input
        type="text"
        placeholder="Enter product category"
        className="inputbox"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      ></input>

      <input
        type="text"
        placeholder="Enter product company"
        className="inputbox"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      ></input>

      <button onClick={updateProduct} className="appButton">
        Update Product
      </button>
    </div>
  );
};

export default UpdateProduct;
