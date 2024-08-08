"use client";
import React from "react";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

function SocketComponent() {
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState<string>("");
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const newSocket = new WebSocket("ws://localhost:8080");

    newSocket.onopen = () => {
      console.log("Connection established", event);
    };

    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "notification") {
        toast.success(data.message);
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          { ...data, type: "received" },
        ]);
      }
    };
    newSocket.onclose = () => {
      toast("Disconnected from server");
    };
    setSocket(newSocket);

    return () => {
      if (newSocket.readyState === WebSocket.OPEN) {
        newSocket.send(
          JSON.stringify({ type: "disconnect", message: "Client disconnected" })
        );
      }
      newSocket.close();
    };
  }, []);

  const handleSendMessage = () => {
    if (socket && socket.readyState === WebSocket.OPEN && message) {
      const messageData = { name: "Me", message: message, type: "sent" };
      socket.send(JSON.stringify({ type: "message", message: message }));
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setMessage("");
      toast.success("Message Sent");
    } else {
      toast.error("Unable to send message. WebSocket not connected.");
    }
  };

  if (!socket) {
    return (
      <h1 className="text-3xl font-bold underline">Connecting to socket...</h1>
    );
  }
  return (
    <div className="flex flex-col items-center h-screen bg-gray-100 p-4 text-slate-950">
      <h1 className="text-3xl font-bold underline">WebSocket Tutorial</h1>
      <div className="w-full max-w-lg bg-white p-4 rounded shadow-md mb-4 overflow-y-auto flex-grow">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded mb-2 shadow-md ${
              msg.type === "received"
                ? "bg-gray-200 text-left"
                : "bg-green-200 text-right"
            }`}
          >
            <strong>{msg.name}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <div className="w-full max-w-lg flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message"
          className="flex-grow p-2 border rounded-l"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white p-2 rounded-r"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default SocketComponent;
