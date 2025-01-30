import { Request, Response } from "express";
import Query from "../../models/query.model";
import transporter from "../../config/nodemailer";
import path from "path";
import { loadEmailTemplate } from "../../utils/templet";

export const addRequest = async (req: Request, res: Response) => {
  try {
    let {
      fullName,
      workEmail,
      message,
role,
      organization,
    } = req.body;
    if (!fullName || !workEmail || !message || !organization||!role) {
       throw Error()
    }
    const createRequest = await Query.create({
      fullName,
      workEmail,
      message,
      organization,role
    });

   
    const emailTemplatePath = path.join(process.cwd(), "src", "templates", "emailTemplate.html");
    const time = `New request at ${new Date().toLocaleString()}`;


    // Replace placeholders with actual values
    const emailHTML = loadEmailTemplate(emailTemplatePath, {
      fullName,
      workEmail,
      message,
      organization,time,role
    });

    let from = `${organization} <${workEmail}>`;
    const info = await transporter
      .sendMail({
        from: from,
        to: "lineo3551@gmail.com",
        subject: organization,
        html: emailHTML,
        
      })
      .then((e) => console.log(e))
      .catch((e) => res.status(403).json({ ...e }));

    res.status(200).json({ success: "Request Submit Data" });
  } catch(e) {
    res.status(500).json({
      e: "Server Error",error:e
    });
  }
};
