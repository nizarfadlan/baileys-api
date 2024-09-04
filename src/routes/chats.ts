import { Router } from "express";
import { body, query } from "express-validator";
import { chat } from "@/controllers";
import requestValidator from "@/middlewares/request-validator";
import sessionValidator from "@/middlewares/session-validator";
import { WAPresence } from "@/types";

const router = Router({ mergeParams: true });
router.get(
	"/",
	query("cursor").isNumeric().optional(),
	query("limit").isNumeric().optional(),
	requestValidator,
	chat.list,
);
router.get(
	"/:jid",
	query("cursor").isNumeric().optional(),
	query("limit").isNumeric().optional(),
	requestValidator,
	chat.find,
);
router.post(
	"/:jid/presence",
	body("presence").isString().isIn(Object.values(WAPresence)),
	requestValidator,
	sessionValidator,
	chat.presence,
);

export default router;
