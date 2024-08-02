/* eslint-disable @typescript-eslint/no-explicit-any */
import type { BaileysEventEmitter } from "@whiskeysockets/baileys";
import type { BaileysEventHandler } from "@/store/types";
import { transformPrisma } from "@/store/utils";
import { prisma } from "@/db";
import { logger } from "@/shared";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export default function groupMetadataHandler(sessionId: string, event: BaileysEventEmitter) {
	const model = prisma.groupMetadata;
	let listening = false;

	const upsert: BaileysEventHandler<"groups.upsert"> = async (groups) => {
		const promises: Promise<any>[] = [];

		for (const group of groups) {
			const data = transformPrisma(group);
			promises.push(
				model.upsert({
					select: { pkId: true },
					create: { ...data, sessionId },
					update: data,
					where: { sessionId_id: { id: group.id, sessionId } },
				}),
			);
		}

		try {
			await Promise.all(promises);
		} catch (e) {
			logger.error(e, "An error occured during groups upsert");
		}
	};

	const update: BaileysEventHandler<"groups.update"> = async (updates) => {
		for (const update of updates) {
			try {
				await model.update({
					select: { pkId: true },
					data: transformPrisma(update),
					where: { sessionId_id: { id: update.id!, sessionId } },
				});
			} catch (e) {
				if (e instanceof PrismaClientKnownRequestError && e.code === "P2025")
					return logger.info({ update }, "Got metadata update for non existent group");
				logger.error(e, "An error occured during group metadata update");
			}
		}
	};

	const updateParticipant: BaileysEventHandler<"group-participants.update"> = async ({
		id,
		action,
		participants,
	}) => {
		try {
			const metadata = ((await model.findFirst({
				select: { participants: true },
				where: { id, sessionId },
			})) || []) as { participants: any[] } | null;

			if (!metadata) {
				return logger.info(
					{ update: { id, action, participants } },
					"Got participants update for non existent group",
				);
			}

			if (!metadata.participants) {
				metadata.participants = [];
			}

			switch (action) {
				case "add":
					metadata.participants.push(
						...participants.map((id) => ({
							id,
							admin: null,
							isAdmin: false,
							isSuperAdmin: false,
						}))
					);
					break;
				case "demote":
				case "promote":
					for (const participant of metadata.participants) {
						if (participants.includes(participant.id)) {
							participant.admin = action === "promote" ? "admin" : null;
							participant.isAdmin = action === "promote";
						}
					}
					break;
				case "remove":
					metadata.participants = metadata.participants?.filter((p) => !participants.includes(p.id));
					break;
			}

			await model.update({
				select: { pkId: true },
				data: transformPrisma({ participants: metadata.participants }),
				where: { sessionId_id: { id, sessionId } },
			});
		} catch (e) {
			logger.error(e, "An error occured during group participants update");
		}
	};

	const listen = () => {
		if (listening) return;

		event.on("groups.upsert", upsert);
		event.on("groups.update", update);
		event.on("group-participants.update", updateParticipant);
		listening = true;
	};

	const unlisten = () => {
		if (!listening) return;

		event.off("groups.upsert", upsert);
		event.off("groups.update", update);
		event.off("group-participants.update", updateParticipant);
		listening = false;
	};

	return { listen, unlisten };
}
