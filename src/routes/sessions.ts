import { Router } from "express";
import { session } from "@/controllers";
import sessionValidator from "@/middlewares/session-validator";
import requestValidator from "@/middlewares/request-validator";
import { body } from "express-validator";

const router = Router();
router.get("/", session.list);
router.get("/:sessionId", sessionValidator, session.find);
router.get("/:sessionId/status", sessionValidator, session.status);
router.post("/add", body("sessionId").isString().notEmpty(), requestValidator, session.add);
router.get("/:sessionId/add-sse", session.addSSE);
router.delete("/:sessionId", sessionValidator, session.del);

export default router;
