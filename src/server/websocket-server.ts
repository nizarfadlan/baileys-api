import { type EventsType } from "@/types/websocket";
import env from "@/config/env";
import { Server as SocketIOServer } from "socket.io";
import type http from "http";

interface SocketData {
	session_id: string;
}

export class SocketServer {
	private io: SocketIOServer;
	private clients: Map<string, Set<string>> = new Map();

	constructor(httpServer: http.Server) {
		this.io = new SocketIOServer(httpServer, {
			cors: {
				origin: "*",
				methods: ["GET", "POST"],
			},
		});
		this.setupConnectionHandler();
	}

	private setupConnectionHandler() {
		this.io.use((socket, next) => {
			const token = socket.handshake.auth.token
				? socket.handshake.auth.token
				: socket.handshake.headers.token;
			if (!token || token !== env.API_KEY) {
				return next(new Error("Invalid API key"));
			}
			next();
		});

		this.io.on("connection", (socket) => {
			const { session_id } = socket.handshake.query as unknown as SocketData;

			if (!session_id) {
				console.log(`Invalid connection attempt: session_id=${session_id}`);
				socket.disconnect(true);
				return;
			}

			this.addClient(session_id, socket.id);
			socket.join(session_id);

			console.log(`New Socket.IO connection: session_id=${session_id}`);
			socket.emit("connected", { session_id });

			socket.on("disconnect", () => {
				this.removeClient(session_id, socket.id);
				console.log(`Socket disconnected: session_id=${session_id}`);
			});
		});
	}

	private addClient(session_id: string, socketId: string) {
		if (!this.clients.has(session_id)) {
			this.clients.set(session_id, new Set());
		}
		this.clients.get(session_id)!.add(socketId);
	}

	private removeClient(session_id: string, socketId: string) {
		const clientSet = this.clients.get(session_id);
		if (clientSet) {
			clientSet.delete(socketId);
			if (clientSet.size === 0) {
				this.clients.delete(session_id);
			}
		}
	}

	public emitEvent(event: EventsType, session_id: string, data: unknown) {
		console.log(`Emitting event ${event} to session ${session_id}`);

		this.io.to(session_id).emit(event, { event, session_id, data });
	}

	public getConnectedClients(session_id: string): number {
		return this.clients.get(session_id)?.size || 0;
	}
}
