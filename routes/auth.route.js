import express from "express";
import { SignUp, SignIn, SignOut, changePassword, verifyAuth } from "../controllers/auth.controller.js";
import { googleOAuthCallback } from "../controllers/googleauth.controller.js";
import { verifyToken } from "../middlewares/verify.js";

const router = express.Router();

router.post("/signup", SignUp);
router.post("/signin", SignIn);
router.get("/signout", SignOut);
router.post("/changepassword", verifyToken, changePassword);
router.post("/verifyauth", verifyToken, verifyAuth);
router.get("/google/callback", googleOAuthCallback);

export default router;