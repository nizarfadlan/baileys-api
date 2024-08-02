import { Router } from "express";
import { body, query } from "express-validator";
import { group } from "@/controllers";
import requestValidator from "@/middlewares/request-validator";
import sessionValidator from "@/middlewares/session-validator";

const router = Router({ mergeParams: true });
router.get(
	"/",
	query("cursor").isNumeric().optional(),
	query("limit").isNumeric().optional(),
	requestValidator,
	group.list,
);
router.get("/:jid", sessionValidator, group.find);
router.get("/:jid/photo", sessionValidator, group.photo);
router.post(
	"/create",
	body("subject").isString().notEmpty(),
	// Participants up to 1024 (WhatsApp limit)
	body("participants").isArray({ min: 1, max: 1024 }).notEmpty(),
	requestValidator,
	sessionValidator,
	group.create
);
router.put(
	"/:jid/update/participants",
	body("participants").isArray({ min: 1, max: 1024 }).notEmpty(),
	body("action").isString().isIn(["add", "remove", "demote", "promote"]).optional(),
	requestValidator,
	sessionValidator,
	group.updateParticipants
);
router.put(
	"/:jid/update/subject",
	body("subject").isString().notEmpty(),
	requestValidator,
	sessionValidator,
	group.updateSubject
);
router.put(
	"/:jid/update/description",
	body("description").isString().notEmpty(),
	requestValidator,
	sessionValidator,
	group.updateDescription
);
router.put(
	"/:jid/update/setting",
	body("action").isString().isIn(["announcement", "not_announcement", "unlocked", "locked"]).notEmpty(),
	requestValidator,
	sessionValidator,
	group.updateSetting
);
router.delete("/:jid", sessionValidator, group.leave);

export default router;
