import { Router } from "express";
import chatRoutes from "./chats";
import groupRoutes from "./groups";
import messageRoutes from "./messages";
import sessionRoutes from "./sessions";
import contactRoutes from "./contacts";
import { apiKeyValidator } from "@/middlewares/api-key-validator";

const router = Router();
router.get("/", (req, res) => {
    res.json({
        code: 200,
        message: "Welcome to the WhatsApp API, Server is up and running!",
    });
});
router.use("/sessions", sessionRoutes);
router.use("/:sessionId/chats", apiKeyValidator, chatRoutes);
router.use("/:sessionId/contacts", apiKeyValidator, contactRoutes);
router.use("/:sessionId/groups", apiKeyValidator, groupRoutes);
router.use("/:sessionId/messages", apiKeyValidator, messageRoutes);

export default router;
