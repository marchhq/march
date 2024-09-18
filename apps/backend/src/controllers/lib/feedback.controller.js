import nodemailer from "nodemailer";
import { upload } from "../../loaders/s3.loader.js";

export default async function feedbackController(req, res) {
  upload.array("attachment")(req, res, async function (err) {
    if (err) {
      return res.status(500).json({ message: "File upload error", error: err });
    }

    const { feedback } = req.body;
    const attachments = req.files; // The uploaded file

    try {
      // Nodemailer transporter
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      // Email Content/ Format
      const mailOptions = {
        from: `"Feedback Form" <${process.env.SMTP_USER}>`,
        to: process.env.FEEDBACK_RECEIVER_EMAIL, // Email to receive feedback
        subject: "New Feedback Submission",
        text: `${feedback}`,
        attachments: attachments.map((file) => ({
          filename: file.originalname,
          path: file.location, // S3 location from multer-s3
        })),
      };

      // Send the email
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: "Feedback sent successfully" });
    } catch (error) {
      console.error("Error sending email: ", error);
      res.status(500).json({ message: "Error sending feedback", error });
    }
  });
}
