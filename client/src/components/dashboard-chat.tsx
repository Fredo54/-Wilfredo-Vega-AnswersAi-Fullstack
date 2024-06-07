import { useState, useEffect } from "react";
import { socket } from "../socket";
import { Message, ResponseState } from "../types";
import { ChatWindow } from "./chat-window";
import { useUser } from "../hooks/use-user";
import { useNavigate } from "react-router-dom";
import { useCurrentMessages } from "../hooks/use-current-messages";

export const DashboardChat = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState("");
  const user = useUser();
  const { messages: preloadedMessages, isLoading } = useCurrentMessages();
  useEffect(() => {
    const onDisconnect = () => {
      setError("Not connected, please refresh.");
    };

    const onChatMessage = (msg: Message) => {
      setMessages((prevMessages) => {
        const lastMessage = prevMessages[prevMessages.length - 1];
        lastMessage.responseState = ResponseState.Success;
        lastMessage.response = msg.response;
        return [...prevMessages.slice(0, -1), lastMessage];
      });
    };

    const onConnectError = (err: Error) => {
      alert("Please log in again");
      navigate("/login");
      setError(err.message);
    };

    socket.on("disconnect", onDisconnect);
    socket.on("chat message", onChatMessage);
    socket.on("connect_error", onConnectError);

    return () => {
      socket.off("disconnect", onDisconnect);
      socket.off("chat message", onChatMessage);
      socket.off("connect_error", onConnectError);
    };
  }, [navigate, user.id]);

  useEffect(() => {
    if (!isLoading) {
      setMessages((prevMessages) => [...preloadedMessages, ...prevMessages]);
    }
  }, [preloadedMessages, isLoading]);

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleSend = () => {
    const newMessage = {
      id: "",
      userId: user.id,
      message: message.trim(),
      responseState: ResponseState.Pending,
      response: "",
    };

    if (message.trim() !== "") {
      socket.emit("chat message", newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage("");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="w-full h-screen flex flex-col justify-end pl-4 pr-4">
      <div className="overflow-auto w-full">
        {isLoading && <p>Loading previous messages...</p>}
        <ChatWindow messages={messages} />
        {error && <p className="text-red-400">{error}</p>}
      </div>
      <div className="flex flex-row pt-10 pb-10 items-end">
        <input
          className="flex w-full h-full"
          placeholder="Type here"
          onChange={handleMessageChange}
          value={message}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};
