import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./letschat.css";
import { useNavigate, useParams } from "react-router-dom";

import {BACKEND_URI} from "../Backend_URI"
const socket = io.connect("https://e-comm-back.vercel.app/");

export default function LetsChat() {

  const params = useParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [messagereceived, setMessagereceived] = useState([]);
  const [name, setName] = useState("");
  const [userID, setUserID] = useState("");
  const [file, setFile] = useState(null);
  const [receiver, setReceiver] = useState("");
  const [alluser, setAllUser] = useState([]);
  const [userSelected, setUserSelected] = useState(true);
  const [rangeuser, setRangeUser] = useState([]);

  const scrollToBottom = () => {
    const messageArea = document.querySelector(".message__area");
    messageArea.scrollTop = messageArea.scrollHeight;
  };

  const checkUser = async () => {
    try {
      let result = await fetch(`${BACKEND_URI}/chats/${params.id}`);
      result = await result.json();
      setName(result.result[0].name);
      setUserID(result.result[0]._id);
    } catch (error) {
      alert("You are not allowed");
      navigate("/");
    }
  };

  const getAllUser = async () => {
    try {
      let result = await fetch(`${BACKEND_URI}/alluser/${params.id}`);
      result = await result.json();
      setAllUser(result);
    } catch (error) {
      console.error("Error fetching all users:", error);
    }
  };

  const rengeuser = async () => {
    try {
      const { coordinates } = JSON.parse(localStorage.getItem("user")).location;
      const [lat, long] = coordinates;
      let result = await fetch(`${BACKEND_URI}/3kmUser`, {
        method: "put",
        body: JSON.stringify({ lat, long }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      result = await result.json();
      setRangeUser(result);
    } catch (error) {
      console.error("Error fetching users within range:", error);
    }
  };

  useEffect(() => {
    getAllUser();
    checkUser();
    socket.on("message", (msg) => {
      if (msg.receiver === userID) {
        appendMessage(msg, "incoming");
        scrollToBottom();
      }
    });
    return () => {
      socket.off("message");
    };
  }, [userID]); 

  const sendMessage = () => {
    scrollToBottom();
    let msg;
    const reader = new FileReader();

    if (!file && !message) {
      alert("Please enter a message");
      return;
    }

    if (file) {
      reader.readAsDataURL(file);
      reader.onload = () => {
        msg = {
          sender: name,
          receiver: receiver,
          message: message.trim(),
          image: reader.result,
        };
        socket.emit("message", msg);
        appendMessage(msg, "outgoing");
        setMessage("");
        setFile(null);
      };
    } else {
      msg = {
        sender: name,
        receiver: receiver,
        message: message.trim(),
        image: null,
      };
      socket.emit("message", msg);
      appendMessage(msg, "outgoing");
      setMessage("");
    }
  };

  const appendMessage = (msg, type) => {
    setMessagereceived((prevMessages) => [...prevMessages, { ...msg, type }]);
    scrollToBottom();
  };

  return (
    <div className="chat">
      <div className="body1">
        <div className="receiver-div">
          <div className="getalluser">
            <button onClick={rengeuser}>3km</button>
            {rangeuser &&
              rangeuser.map((result, index) => (
                <div key={index}>
                  <h2>{result.name}</h2>
                  <button
                    onClick={() => {
                      setReceiver(result._id);
                      setUserSelected(false);
                    }}
                  >
                    Click to chat
                  </button>
                </div>
              ))}
          </div>
        </div>
        <section className="chat__section">
          <div className="brand">
            <img src="/wassup.png" alt="no pic found" />
            <h1>{`Whatsupp ${name}`}</h1>
          </div>

          <div className="message__area">
            {messagereceived.map((msg, index) => (
              <div key={index} className={`message ${msg.type}`}>
                <h4>{msg.sender}</h4>
                <p>{msg.message}</p>
                {msg.image && (
                  <img src={msg.image} alt={msg.message || "Image"} />
                )}
              </div>
            ))}
          </div>

          <div className="input-div">
            <input
              id="input"
              cols="30"
              rows="1"
              placeholder="Write a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <button onClick={sendMessage}>Send</button>
          </div>
        </section>
      </div>
    </div>
  );
} 
  
