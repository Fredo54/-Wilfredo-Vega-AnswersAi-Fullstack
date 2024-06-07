import { io } from "socket.io-client";
import Cookies from "js-cookie";
// "undefined" means the URL will be computed from the `window.location` object
const URL =
  process.env.NODE_ENV === "production"
    ? undefined
    : import.meta.env.VITE_API_URL;

export const socket = io(URL as string, {
  transports: ["websocket"],
  extraHeaders: {
    Authorization: `Bearer ${Cookies.get("accessToken")}`,
  },
  auth: { token: Cookies.get("accessToken") },
});

// export const socket = io(URL as string);
