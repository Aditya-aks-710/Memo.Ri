import express from "express";
import { signup, signin, getCloudinarySignature } from "../controllers/userControllers";
import { UserAuth } from "../middleware";
import { getMyProfile } from "../controllers/userControllers";

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/cloudinary-signature', getCloudinarySignature);

router.get('/me', UserAuth, getMyProfile);

export default router;