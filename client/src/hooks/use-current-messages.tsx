import { useEffect, useState } from "react";
import { Message } from "../types";
import { useUser } from "./use-user";

export const useCurrentMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { id, token } = useUser();
  // console.log("useCurrentUser: ", id, email, token);
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        console.log("fetching messages");
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/chats/all?userId=${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const { chats } = await response.json();
          setMessages(chats);
          setIsLoading(false);
        } else {
          setError(response.statusText);
        }
      } catch (error) {
        setError((error as Error)?.message);
      }
    };

    if (id) {
      fetchMessages();
    }
  }, [id, token]);

  return { messages, isLoading, error };
};
