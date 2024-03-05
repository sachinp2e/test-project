import { useRef } from "react";
import { io } from "socket.io-client";

import useEffectOnce from "./useEffectOnce";

const UseNotificationSocket = (cb: any) => {
  const socket = useRef<any>(null);
  const fetchInitialData = () => {
    const userId = localStorage.getItem("id");
    socket.current.emit(
      "joinRoom",
      { roomId: `NFTM:${userId}` },
      (res: any) => {
        // eslint-disable-next-line no-console
        console.info(res);
      }
    );
  };

  useEffectOnce(() => {
    const url = process.env.NEXT_PUBLIC_NOTIFICATION_API_URL;
    socket.current = io(url || "", {
      transports: ["websocket"],
    });
    socket.current.on("connect", () => {
      // eslint-disable-next-line no-console
      console.info("socket has been connected");
      fetchInitialData();
    });
    socket.current.on("disconnect", () => {
      // eslint-disable-next-line no-console
      console.info("socket has been disconnected");
    });
    socket.current.on("notification", (res: any) => {
      cb(res);
    });
  });

  return {
    socket: socket.current,
  };
};

export default UseNotificationSocket;
