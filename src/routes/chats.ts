import { Router } from "express";
import { query } from "express-validator";
import { chat } from "@/controllers";
import requestValidator from "@/middlewares/request-validator";

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

export default router;
