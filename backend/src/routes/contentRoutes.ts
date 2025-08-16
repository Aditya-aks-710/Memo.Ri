import express from "express";
import { createContent, getContent, deleteContent } from "../controllers/contentController";
import { UserAuth } from "../middleware"; // Your auth middleware

const router = express.Router();

router.post('/content', UserAuth, createContent);
router.get('/content', UserAuth, getContent);
router.delete('/content/:id', UserAuth, deleteContent);

export default router;