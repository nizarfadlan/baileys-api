import type { RequestHandler } from "express";
import { logger } from "@/shared";
import { getSession, jidExists } from "@/whatsapp";
import { makePhotoURLHandler } from "./misc";
import { prisma } from "@/db";

export const list: RequestHandler = async (req, res) => {
	try {
		const { sessionId } = req.params;
		const { cursor = undefined, limit = 25, search } = req.query;
		const groups = await prisma.contact.findMany({
			cursor: cursor ? { pkId: Number(cursor) } : undefined,
			take: Number(limit),
			skip: cursor ? 1 : 0,
			where: {
				id: { endsWith: "g.us" },
				sessionId,
				OR: [
					{
						name: {
							contains: String(search),
						}
					}
				]
			},
		});

		res.status(200).json({
			data: groups,
			cursor:
				groups.length !== 0 && groups.length === Number(limit)
					? groups[groups.length - 1].pkId
					: null,
		});
	} catch (e) {
		const message = "An error occured during group list";
		logger.error(e, message);
		res.status(500).json({ error: message });
	}
};

export const find: RequestHandler = async (req, res) => {
	try {
		const { sessionId, jid } = req.params;
		const session = getSession(sessionId)!;
		const data = await session.groupMetadata(jid);
		res.status(200).json(data);
	} catch (e) {
		const message = "An error occured during group metadata fetch";
		logger.error(e, message);
		res.status(500).json({ error: message });
	}
};

export const photo = makePhotoURLHandler("group");

export const create: RequestHandler = async (req, res) => {
	try {
		const session = getSession(req.params.sessionId)!;
		const { subject, participants } = req.body;

		if (!Array.isArray(participants) || participants.length < 1) {
			return res.status(400).json({ error: "Participants must be an array and have at least 1 members"
			});
		} else if (subject.length > 100) {
			return res.status(400).json({ error: "Subject must be less than 100 characters"
			});
		}

		const listNumbersNotExists: string[] = [];
		participants.forEach(async (participant) => {
			const exists = await jidExists(session, participant);
			if (!exists) {
				listNumbersNotExists.push(participant);
			}
		});

		const data = await session.groupCreate(subject, participants);
		res.status(200).json({
			data,
			error: listNumbersNotExists.length > 0 ? `The following numbers do not exist: ${listNumbersNotExists.join(", ")}` : null,
		});
	} catch (e) {
		const message = "An error occured during group creation";
		logger.error(e, message);
		res.status(500).json({ error: message });
	}
};

export const updateParticipants: RequestHandler = async (req, res) => {
	try {
		const { sessionId, jid } = req.params;
		const session = getSession(sessionId)!;
		const { participants, action = "add" } = req.body;

		if (!Array.isArray(participants) || participants.length < 1) {
			return res.status(400).json({ error: "Participants must be an array and have at least 1 members"
			});
		}

		const listNumbersNotExists: string[] = [];
		participants.forEach(async (participant) => {
			const exists = await jidExists(session, participant);
			if (!exists) {
				listNumbersNotExists.push(participant);
			}
		});

		const data = await session.groupParticipantsUpdate(jid, participants, action);
		res.status(200).json({
			data,
			error: listNumbersNotExists.length > 0 ? `The following numbers do not exist: ${listNumbersNotExists.join(", ")}` : null,
		});
	} catch (e) {
		const message = "An error occured during group participants update";
		logger.error(e, message);
		res.status(500).json({ error: message });
	}
};

export const updateSubject: RequestHandler = async (req, res) => {
	try {
		const { sessionId, jid } = req.params;
		const session = getSession(sessionId)!;
		const { subject } = req.body;

		if (subject.length > 100) {
			return res.status(400).json({ error: "Subject must be less than 100 characters"
			});
		}

		await session.groupUpdateSubject(jid, subject);
		res.status(200).json({
			message: "Group subject updated",
		});
	} catch (e) {
		const message = "An error occured during group subject update";
		logger.error(e, message);
		res.status(500).json({ error: message });
	}
};

export const updateSetting: RequestHandler = async (req, res) => {
	try {
		const { sessionId, jid } = req.params;
		const session = getSession(sessionId)!;
		const { action } = req.body;

		await session.groupSettingUpdate(jid, action);
		res.status(200).json({
			message: "Group setting updated",
		});
	} catch (e) {
		const message = "An error occured during group setting update";
		logger.error(e, message);
		res.status(500).json({ error: message });
	}
};

export const updateDescription: RequestHandler = async (req, res) => {
	try {
		const { sessionId, jid } = req.params;
		const session = getSession(sessionId)!;
		const { description } = req.body;

		await session.groupUpdateDescription(jid, description);
		res.status(200).json({
			message: "Group description updated",
		});
	} catch (e) {
		const message = "An error occured during group subject update";
		logger.error(e, message);
		res.status(500).json({ error: message });
	}
};

export const leave: RequestHandler = async (req, res) => {
	try {
		const { sessionId, jid } = req.params;
		const session = getSession(sessionId)!;
		await session.groupLeave(jid);
		res.status(200).json({
			message: "Group leaved",
		});
	} catch (e) {
		const message = "An error occured during group leave";
		logger.error(e, message);
		res.status(500).json({ error: message });
	}
};
