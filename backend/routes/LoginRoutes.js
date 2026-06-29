import express from "express";
import { getLoginData, getSignUpData, getProfile } from "../controller/Auth.js";

const router = express.Router();

// auth routes
router.post("/signup", getSignUpData);
router.post("/login", getLoginData);
router.get("/profile", getProfile);

export default router;
