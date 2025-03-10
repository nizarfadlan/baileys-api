import type { RequestHandler } from "express";
import { logger } from "@/utils";
import { makePhotoURLHandler } from "./misc";
import { prisma } from "@/config/database";
import WhatsappService from "@/whatsapp/service";
import { Prisma } from "@prisma/client";

export const list: RequestHandler = async (req, res) => {
	try {
		const { sessionId } = req.params;
		const { cursor = undefined, limit = 25, search } = req.query;
		// Create whereConditions
		const whereConditions: Prisma.ContactWhereInput = {
			id: { endsWith: "s.whatsapp.net" },
			sessionId,
		};
		// Add  OR condition if only search parameter is exist
		if (search) {
			whereConditions.OR = [
				{
					name: {
						contains: String(search),
					},
				},
				{
					verifiedName: {
						contains: String(search),
					},
				},
				{
					notify: {
						contains: String(search),
					},
				},
			];
		}
		const contacts = await prisma.contact.findMany({
			cursor: cursor ? { pkId: Number(cursor) } : undefined,
			take: Number(limit),
			skip: cursor ? 1 : 0,
			where: whereConditions,
		});
		res.status(200).json({
			data: contacts,
			cursor:
				contacts.length !== 0 && contacts.length === Number(limit)
					? contacts[contacts.length - 1].pkId
					: null,
		});
	} catch (e:any) {
		const message = "An error occurred during contact list";
		logger.error(e, message);
		res.status(500).json({ error: message });
	}
};

export const listBlocked: RequestHandler = async (req, res) => {
	try {
		const session = WhatsappService.getSession(req.params.sessionId)!;
		const data = await session.fetchBlocklist();
		res.status(200).json(data);
	} catch (e:any) {
		const message = "An error occured during blocklist fetch";
		logger.error(e, message);
		res.status(500).json({ error: message });
	}
};

export const updateBlock: RequestHandler = async (req, res) => {
	try {
		const session = WhatsappService.getSession(req.params.sessionId)!;
		const { jid, action = "block" } = req.body;

		const exists = await WhatsappService.jidExists(session, jid);
		if (!exists) return res.status(400).json({ error: "Jid does not exists" });

		await session.updateBlockStatus(jid, action);
		res.status(200).json({ message: `Contact ${action}ed` });
	} catch (e:any) {
		const message = "An error occured during blocklist update";
		logger.error(e, message);
		res.status(500).json({ error: message });
	}
};

export const check: RequestHandler = async (req, res) => {
	try {
		const { sessionId, jid } = req.params;
		const session = WhatsappService.getSession(sessionId)!;

		const exists = await WhatsappService.jidExists(session, jid);
		res.status(200).json({ exists });
	} catch (e:any) {
		const message = "An error occured during jid check";
		logger.error(e, message);
		res.status(500).json({ error: message });
	}
};

export const photo = makePhotoURLHandler();
