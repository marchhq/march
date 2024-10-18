import nodemailer from "nodemailer";
import { upload } from "../../loaders/s3.loader.js";
import { environment } from "../../loaders/environment.loader.js";

const sendFeedbackEmail = async (req, res) => {
    try {
    // Handle file uploads using Multer
        await handleFileUpload(req, res);

        const { title, feedback, email } = req.body;
        const attachments = req.files; // The uploaded files

        // Create Nodemailer transporter
        const transporter = nodemailer.createTransport({
            host: environment.SMTP_HOST,
            port: environment.SMTP_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
                user: environment.SMTP_USER,
                pass: environment.SMTP_PASS
            }
        });

        // Define email options
        const mailOptions = {
            from: `"Feedback Form" <${environment.SMTP_USER}>`,
            to: environment.FEEDBACK_RECEIVER_EMAIL, // Feedback receiver email
            cc: email,
            subject: `Feedback sent to march`,
            text: `Title: ${title}\n\nFeedback: ${feedback}`,
            attachments: attachments.map((file) => ({
                filename: file.originalname,
                path: file.location // File location from S3
            }))
        };

        // Send email
        await transporter.sendMail(mailOptions);
        return { status: 200, message: "Feedback sent successfully" };
    } catch (error) {
        console.error("Error during email sending:", error);
        // Throwing an actual Error object instead of a literal
        throw new Error("Error sending feedback");
    }
};

// Handle file upload function
const handleFileUpload = (req, res) => {
    return new Promise((resolve, reject) => {
        upload.array("attachment")(req, res, (err) => {
            if (err) {
                // Rejecting with an actual Error object
                return reject(new Error("File upload error"));
            }
            resolve();
        });
    });
};

export { sendFeedbackEmail };
