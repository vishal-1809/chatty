import express from "express";
import protectRoute from "../middleware/auth.middleware.js";
import { getUsers, getMessages, sendMessage, deleteMessage, updateView, getNotification, updateNotification } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsers);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);
router.delete("/delete/:selectedUserid/:messageid", protectRoute, deleteMessage);
router.put("/update/:messageid/:userId", protectRoute, updateView);
router.get("/getNotification/:id", protectRoute, getNotification);
router.put("/updateNotification/:selectedUser", protectRoute, updateNotification);

export default router;