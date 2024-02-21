import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {BACKEND_URI} from "../Backend_URI"


export default function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts();
  }, []);

  //this api is used to get products from the backend
  const getProducts = async () => {
    let result = await fetch(`${BACKEND_URI}/products`, {
      headers: {
        jwt: `${JSON.parse(localStorage.getItem("token"))}`,
      },
    });
    result = await result.json();
    setProducts(result);
  };

  // this function is used to delete product from the backend
  const deleteProduct = async (id) => {
    let result = await fetch(`${BACKEND_URI}/product/${id}`, {
      method: "delete",
      headers: {
        jwt: `${JSON.parse(localStorage.getItem("token"))}`,
      },
    });
    result = await result.json();
    if (result) {
      alert("record is deleted");
      getProducts(); //if you did not write this code then data will not be refreshed on the browser so to refresh data from the browser call this function  so that the backend data will call again anda the data updated data will be displayed on th browser
    }
  };

  // this function is used to search the data inside the backend accounding to the name
  const searchHandle = async (event) => {
    let key = event.target.value;
    if (key) {
      let result = await fetch(`${BACKEND_URI}/search/${key}`, {
        headers: {
          jwt: `${JSON.parse(localStorage.getItem("token"))}`,
        },
      });
      result = await result.json();
      if (result) {
        setProducts(result);
      }
    } else {
      getProducts();
    }
  };
  return (
    <div className="product-list">
      <h1>ProductList</h1>
      <input
        type="text"
        placeholder="Search Product"
        className="search-product-box"
        onChange={searchHandle}
      ></input>
      <ul>
        <li>Sr.NO</li>
        <li>Name</li>
        <li>Price</li>
        <li>Category</li>
        <li>Company</li>
        <li>Operation</li>
      </ul>

      <div className="scroller">
        {products.length > 0 ? (
          products.map((value, index) => (
            <ul key={value._id}>
              <li>{index + 1}</li>
              <li>{value.name}</li>
              <li>{value.price}</li>
              <li>{value.category}</li>

              <li>{value.company}</li>

              <li>
                <button
                  style={{ cursor: "pointer", color: "black" }}
                  onClick={() => {
                    if (window.confirm("are you sure want to delete ")) {
                      deleteProduct(value._id);
                    }
                  }}
                >
                  delete
                </button>
                <button style={{ marginLeft: "5px" }}>
                  <Link
                    to={`/update/${value._id}`}
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    Update
                  </Link>
                </button>
              </li>
            </ul>
          ))
        ) : (
          <h1>No Data Found</h1>
        )}
      </div>
    </div>
  );
}
