import WhatsappService from "@/whatsapp/service";
import type { RequestHandler } from "express";

export const list: RequestHandler = (req, res) => {
	res.status(200).json(WhatsappService.listSessions());
};

export const find: RequestHandler = (req, res) =>
	res.status(200).json({ message: "Session found" });

export const status: RequestHandler = (req, res) => {
	const session = WhatsappService.getSession(req.params.sessionId)!;
	res.status(200).json({ status: WhatsappService.getSessionStatus(session) });
};

export const add: RequestHandler = async (req, res) => {
	const { sessionId, readIncomingMessages, ...socketConfig } = req.body;

	if (WhatsappService.sessionExists(sessionId))
		return res.status(400).json({ error: "Session already exists" });
	WhatsappService.createSession({ sessionId, res, readIncomingMessages, socketConfig });
};

export const addSSE: RequestHandler = async (req, res) => {
	const { sessionId } = req.params;
	res.writeHead(200, {
		"Content-Type": "text/event-stream",
		"Cache-Control": "no-cache",
		Connection: "keep-alive",
	});

	if (WhatsappService.sessionExists(sessionId)) {
		res.write(`data: ${JSON.stringify({ error: "Session already exists" })}\n\n`);
		res.end();
		return;
	}
	WhatsappService.createSession({ sessionId, res, SSE: true });
};

export const del: RequestHandler = async (req, res) => {
	await WhatsappService.deleteSession(req.params.sessionId);
	res.status(200).json({ message: "Session deleted" });
};
