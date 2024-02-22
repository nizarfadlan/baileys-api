import { Router } from "express";
import { query } from "express-validator";
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

export default router;
