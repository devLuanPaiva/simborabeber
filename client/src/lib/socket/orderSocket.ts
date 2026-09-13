import { io, Socket } from "socket.io-client";

export function connectOrderSocket(): Socket {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "";

    return io(`${baseUrl}/order`, {
        transports: ["websocket"],
        autoConnect: true,
    });
}
