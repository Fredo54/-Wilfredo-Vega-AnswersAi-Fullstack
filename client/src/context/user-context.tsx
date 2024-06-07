import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";
import { JwtPayload, jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { socket } from "../socket";

interface CustomJwtPayload extends JwtPayload {
  email: string;
  id: string;
}

export const UserContext = createContext<{
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  id: string;
  setId: Dispatch<SetStateAction<string>>;
  token: string | undefined;
  setToken: Dispatch<SetStateAction<string | undefined>>;
  chatTokens: number | undefined;
  setChatTokens: Dispatch<SetStateAction<number | undefined>>;
}>({
  email: "",
  setEmail: () => {},
  id: "",
  setId: () => {},
  token: undefined,
  setToken: () => {},
  chatTokens: undefined,
  setChatTokens: () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [token, setToken] = useState(Cookies.get("accessToken"));
  const [chatTokens, setChatTokens] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!token) {
      return;
    }
    let decoded = {} as CustomJwtPayload;
    let savedEmail = "";
    let savedId = "";
    try {
      decoded = jwtDecode(token) as CustomJwtPayload;
      savedEmail = decoded.email;
      savedId = decoded.id;
      setEmail(savedEmail);
      setId(savedId);
    } catch (err) {
      Cookies.remove("accessToken");
      setToken(undefined);
    }

    function handleConnect() {
      socket.emit("get tokens", { userId: savedId });
    }

    function getTokens(value: number) {
      console.log("value: ", value);
      setChatTokens(value);
    }
    socket.on("connect", handleConnect);
    socket.on("get tokens", getTokens);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("get tokens", getTokens);
    };
  }, [token]);

  return (
    <UserContext.Provider
      value={{
        email,
        setEmail,
        id,
        setId,
        token,
        setToken,
        chatTokens,
        setChatTokens,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
