import type { RequestHandler } from "express";
import { logger } from "@/utils";
import WhatsappService, { type Session } from "@/whatsapp/service";
import { WAPresence } from "@/types";

export const makePhotoURLHandler =
	(type: "number" | "group" = "number"): RequestHandler =>
	async (req, res) => {
		try {
			const { sessionId, jid } = req.params;
			const session = WhatsappService.getSession(sessionId)!;

			const exists = await WhatsappService.jidExists(session, jid, type);
			if (!exists) return res.status(400).json({ error: "Jid does not exists" });

			const url = await session.profilePictureUrl(jid, "image");
			res.status(200).json({ url });
		} catch (e:any) {
			const message = "An error occured during photo fetch";
			logger.error(e, message);
			res.status(500).json({ error: message });
		}
	};

export const presenceHandler =
	(type: "number" | "group" = "number"): RequestHandler =>
	async (req, res) => {
		const { sessionId, jid } = req.params;
		const { presence } = req.body;
		const session = WhatsappService.getSession(sessionId)!;

		const exists = await WhatsappService.jidExists(session, jid, type);
		if (!exists) return res.status(400).json({ error: "Jid does not exists" });

		const result = await updatePresence(session, presence, jid);
		if (result.error) return res.status(result.code ?? 500).json({ error: result.error });

		res.status(200).json(result);
	};

export const updatePresence = async (session: Session, presence: WAPresence, jid: string) => {
	try {
		if (!Object.values(WAPresence).includes(presence))
			return { code: 400, error: "Invalid presence" };

		await session.sendPresenceUpdate(presence, jid);
		return { message: "Presence updated" };
	} catch (e:any) {
		const message = "An error occured during presence update";
		logger.error(e, message);
		return { code: 500, error: message };
	}
};
