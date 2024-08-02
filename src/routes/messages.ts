import { Router } from "express";
import { message } from "@/controllers";
import requestValidator from "@/middlewares/request-validator";
import sessionValidator from "@/middlewares/session-validator";
import { query, body } from "express-validator";

const router = Router({ mergeParams: true });
router.get(
	"/",
	query("cursor").isNumeric().optional(),
	query("limit").isNumeric().optional(),
	requestValidator,
	message.list,
);
router.post(
	"/send",
	body("jid").isString().notEmpty(),
	body("type").isString().isIn(["group", "number"]).optional(),
	body("message").isObject().notEmpty(),
	body("options").isObject().optional(),
	requestValidator,
	sessionValidator,
	message.send,
);
router.post(
	"/send/bulk",
	body().isArray().notEmpty(),
	requestValidator,
	sessionValidator,
	message.sendBulk,
);
router.post(
	"/download",
	body().isObject().notEmpty(),
	requestValidator,
	sessionValidator,
	message.download,
);
router.delete(
	"/delete",
	body("jid").isString().notEmpty(),
	body("type").isString().isIn(["group", "number"]).optional(),
	body("message").isObject().notEmpty(),
	requestValidator,
	sessionValidator,
	message.deleteMessage,
);
router.delete(
	"/delete/onlyme",
	body("jid").isString().notEmpty(),
	body("type").isString().isIn(["group", "number"]).optional(),
	body("message").isObject().notEmpty(),
	requestValidator,
	sessionValidator,
	message.deleteMessage,
);

export default router;
