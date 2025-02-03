import { Request, Response } from "express";
import User from "../../models/user.model"; // Adjust the path to your User model
import transporter from "../../config/nodemailer";
import jwt from "jsonwebtoken";
import { generateOTP } from "../../utils/otp";
import { loadEmailTemplate } from "../../utils/templet";
import path from "path";

// Send OTP to user's email
export const sendOtp = async (req: Request, res: Response): Promise<void> => {
  const { email } = req?.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 2 * 60 * 1000); // OTP expires in 2 minutes
 const emailTemplatePath = path.join(process.cwd(), "src", "templates", "otpTemplate.html");
    const time = ` Request at ${new Date().toLocaleString()}`;


    // Replace placeholders with actual values
    const emailHTML = loadEmailTemplate(emailTemplatePath, {
     otp
    });

    // Save OTP and expiration time in the user model

    if (user) {
      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();
    }

    // Send OTP via email
    let from = `OTP  <${"PortfolioIQ Dashboard"}>`;
    const mailOptions = {
      from,
      to: email,
      subject: "Your OTP for Verification",
      html:emailHTML
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(403).json({ message: "User not found" });
      return;
    }
    if (user) {
      if (
        user.otp === otp &&
        user?.otpExpires &&
        user.otpExpires > new Date()
      ) {
        // Clear OTP and expiration time after successful verification
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        // Generate JWT token
        const token = jwt.sign(
          { userId: user._id, email: user.email }, // Payload
          "deen shah here", // Secret key
          { expiresIn: "7d" } // Token expiration time
        );

        // Send the token in the response
        res.status(200).json({ message: "OTP verified successfully", token });
      } else {
        res.status(400).json({ message: "Invalid or expired OTP" });
      }
    }
    // Check if OTP matches and is not expired
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to verify OTP" });
  }
};

export const createProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;
    const user = await User.create({ email });
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to creteUser" });
  }
};
