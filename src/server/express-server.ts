import express from "express";
import type { Application, Request, Response } from "express";
import cors from "cors";
import routes from "@/routes";

export class ExpressServer {
	private app: Application;

	constructor() {
		this.app = express();
		this.setupMiddleware();
		this.setupRoutes();
	}

	private setupMiddleware() {
		this.app.use(cors());
		this.app.use(express.json());
	}

	private setupRoutes() {
		this.app.use("/", routes);

		this.app.all("*", (_: Request, res: Response) =>
			res.status(404).json({ error: "URL not found" }),
		);
	}

	public getApp(): Application {
		return this.app;
	}
}
