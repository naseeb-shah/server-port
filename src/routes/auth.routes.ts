import express from "express";


import { sendOtp, verifyOTP,createProfile } from "../app/controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";




const router = express.Router();
router.post("/send-otp",sendOtp)
router.post("/verify-otp",verifyOTP)
router.post("/create-user",authenticate,createProfile)
export default router;
