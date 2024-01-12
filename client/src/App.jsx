import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");     
const App = () => {
  const [userName, setUserName] = useState("");
 const [chatActive, setChatActive] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
 console.log("messages-->",messages)
  useEffect(() => {
    socket.on("Received-message", (message) => {
      setMessages([...messages, message]);
      
    });
  }, [messages,socket]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const messageData = {
      message: newMessage,
      user: userName,
      time: new Date(Date.now()).getHours()+":"+new Date(
        Date.now()
      ).getMinutes()
    };

    if (userName.trim() !== "") {
      socket.emit("send-message", messageData);
      setChatActive(true)
    } else {
      alert("Please enter a username");
    }
    setNewMessage("");
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      {chatActive ? (
        <div className="w-full max-w-md p-4 bg-white rounded shadow-xl">
          <div className="shadow">
          <h1 className="text-center text-2xl font-bold mb-4">Chat App</h1>
          <h4 className="text-xl text-center font-bold ">{userName} joined the chat</h4>
          </div>
          <div className="overflow-y-auto h-96 mb-4">
            {messages.map((message, index) => {
              const { user, time, message: userMessage } = message;
              return (
                <div key={index} className={`flex justify-start ${userName==user && "justify-end"}`}>
                <div className="w-8 h-8 text-center bg-amber-400 rounded-full my-4">
                  <p className="text-xl rounded-full font-bold">{user.charAt(0).toUpperCase()}</p>
                  </div>
                  <div className={`bg-blue-300 my-4 rounded p-1 ${userName==user && "bg-green-300"}`}>
                  {/* <p className="text-sm">{user}</p> */}
                  <p className="text-base">{userMessage}</p>
                  <p className="text-xs italic">{time}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <form className="flex gap-3" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Type your message"
              className="flex-1 rounded border p-2 outline-none"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Send
            </button>
          </form>
        </div>
      ) : (
        <div className="text-center m-auto ">
          <input
            type="text"
            className="border p-2 mr-2 rounded"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <button
            onClick={handleSubmit }
            className="bg-blue-500 text-white px-6 py-2 rounded"
          >
            Start the Chat
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
