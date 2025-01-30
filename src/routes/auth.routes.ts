import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

const router = express.Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  async (req, res) => {
    const user = req.user as any;
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });
    res.json({ token, user });
  }
);

export default router;
