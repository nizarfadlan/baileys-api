import { Router } from "express";
import { session } from "@/controllers";
import sessionValidator from "@/middlewares/session-validator";
import requestValidator from "@/middlewares/request-validator";
import { body } from "express-validator";
import { apiKeyValidator, apiKeyValidatorParam } from "@/middlewares/api-key-validator";

const router = Router();
router.get("/", apiKeyValidator, session.list);
router.get("/:sessionId", apiKeyValidator, sessionValidator, session.find);
router.get("/:sessionId/status", apiKeyValidator, sessionValidator, session.status);
router.post("/add", body("sessionId").isString().notEmpty(), apiKeyValidator, requestValidator, session.add);
router.get("/:sessionId/add-sse", apiKeyValidatorParam, session.addSSE);
router.delete("/:sessionId", apiKeyValidator, sessionValidator, session.del);

export default router;
