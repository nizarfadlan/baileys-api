import { Router } from "express";
import { body, query } from "express-validator";
import { contact } from "@/controllers";
import requestValidator from "@/middlewares/request-validator";
import sessionValidator from "@/middlewares/session-validator";

const router = Router({ mergeParams: true });
router.get(
	"/",
	query("cursor").isNumeric().optional(),
	query("limit").isNumeric().optional(),
	requestValidator,
	contact.list,
);
router.get("/blocklist", sessionValidator, contact.listBlocked);
router.post(
	"/blocklist/update",
	body("jid").isString().notEmpty(),
	body("action").isString().isIn(["block", "unblock"]).optional(),
	requestValidator,
	sessionValidator,
	contact.updateBlock,
);
router.get("/:jid", sessionValidator, contact.check);
router.get("/:jid/photo", sessionValidator, contact.photo);

export default router;
