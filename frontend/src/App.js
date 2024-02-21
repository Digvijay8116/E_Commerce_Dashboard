import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import SignUp from "./components/Authentication/Signup";
import PrivateComponent from "./components/PrivateComponent";

import AddProduct from "./components/Products/AddProduct";
import ProductList from "./components/Products/ProductList";
import UpdateProduct from "./components/Products/UpdateProduct";
import Otp from "./components/Otp/Otp";
import VerifyOtp from "./components/Otp/VerifyOtp";
import UpdatePassword from "./components/Otp/UpdatePassword";
import Profile from "./components/Authentication/Profile";
import Chats from "./components/Chat/Chats";
import LetsChat from "./components/Chat/LetsChat";
import Login from "./components/Authentication/Login";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Nav />

        <Routes>
          <Route element={<PrivateComponent />}>
            <Route path="/" element={<ProductList />} />
            <Route path="/add" element={<AddProduct />} />
            <Route path="/update/:id" element={<UpdateProduct />} />
            <Route path="/logout" element={<h1>logout component</h1>} />
            {/* <Route  path="/Chats" element={<Chats />}/> */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/letsChat/:id" element = {<LetsChat />}/>
          </Route>

          <Route path="/verifyotp/:email" element={<VerifyOtp />} />
          <Route path="/forget" element={<Otp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/updatepassword/:email" element={<UpdatePassword />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;
