import http from "http";
import { ExpressServer } from "./express-server";
import env from "@/config/env";
import { SocketServer } from "./websocket-server";
import WhatsappService from "@/whatsapp/service";
import { initializeSocketEmitter } from "@/utils";

export class Server {
	private httpServer: ExpressServer;
	private socketServer: SocketServer;
	private httpPort = env.PORT;
	private server: http.Server;

	constructor() {
		this.httpServer = new ExpressServer();
		this.server = http.createServer(this.httpServer.getApp());
		this.setupSocketServer();
	}

	private setupSocketServer() {
		if (env.ENABLE_WEBSOCKET) {
			this.socketServer = new SocketServer(this.server);
		}
	}

	public async start(): Promise<void> {
		// Initialize WhatsApp connection
		new WhatsappService();

		this.server.listen(this.httpPort, () => {
			console.log(`Server is running on port ${this.httpPort}`);
		});

		if (this.socketServer) {
			initializeSocketEmitter(this.socketServer);
			console.log("WebSocket server is running");
		}
	}
}
