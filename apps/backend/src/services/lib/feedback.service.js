// import nodemailer from "nodemailer";
// import { upload } from "../../loaders/s3.loader.js";
// import { environment } from "../../loaders/environment.loader.js";

// const sendFeedbackEmail = async (req, res) => {
//     try {
//     // Handle file uploads using Multer
//         await handleFileUpload(req, res);

//         const { title, feedback, email } = req.body;
//         const attachments = req.files; // The uploaded files

//         // Create Nodemailer transporter
//         const transporter = nodemailer.createTransport({
//             host: environment.SMTP_HOST,
//             port: environment.SMTP_PORT,
//             secure: false, // true for 465, false for other ports
//             auth: {
//                 user: environment.SMTP_USER,
//                 pass: environment.SMTP_PASS
//             }
//         });

//         // Define email options
//         const mailOptions = {
//             from: `"Feedback Form" <${environment.SMTP_USER}>`,
//             to: environment.FEEDBACK_RECEIVER_EMAIL, // Feedback receiver email
//             cc: email,
//             subject: `Feedback sent to march`,
//             text: `Title: ${title}\n\nFeedback: ${feedback}`,
//             attachments: attachments.map((file) => ({
//                 filename: file.originalname,
//                 path: file.location // File location from S3
//             }))
//         };

//         // Send email
//         await transporter.sendMail(mailOptions);
//         return { status: 200, message: "Feedback sent successfully" };
//     } catch (error) {
//         console.error("Error during email sending:", error);
//         // Throwing an actual Error object instead of a literal
//         throw new Error("Error sending feedback");
//     }
// };

// // Handle file upload function
// const handleFileUpload = (req, res) => {
//     return new Promise((resolve, reject) => {
//         upload.array("attachment")(req, res, (err) => {
//             if (err) {
//                 // Rejecting with an actual Error object
//                 return reject(new Error("File upload error"));
//             }
//             resolve();
//         });
//     });
// };

// export { sendFeedbackEmail };

import axios from 'axios';
import { upload } from "../../loaders/s3.loader.js";
import { environment } from "../../loaders/environment.loader.js";

const sendFeedbackEmail = async (req, res) => {
    try {
        // Handle file uploads using Multer
        await handleFileUpload(req, res);

        // Log the incoming request body for debugging
        console.log("Request body:", req.body);

        const { title, feedback, email } = req.body;

        // Validate that all necessary fields are provided
        if (!email || !title || !feedback) {
            return res.status(400).json({ message: "Email, title, and feedback are required." });
        }

        // Log the files received
        console.log("Uploaded files:", req.files);
        const attachments = req.files || []; // Default to an empty array if no files are uploaded

        // Prepare the request body for Loops API
        const requestBody = {
            transactionalId: "cm34je93z00q011c1ku9u1jb5", // Replace with your actual transactional ID
            email: environment.FEEDBACK_RECEIVER_EMAIL, // Feedback receiver email
            dataVariables: {
                FirstName: email.split('@')[0], // Example: Get first name from email
                body: `${title}\n\nFeedback: ${feedback}`, // Feedback message
                attachment: attachments.length > 0 ? attachments.map(file => file.location) : [], // Handle attachments safely
                useremail: email // The user's email address
            }
        };

        // Send email using Loops API
        const response = await axios.post('https://app.loops.so/api/v1/transactional', requestBody, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${Buffer.from('loops:' + environment.LOOPS_API_KEY).toString('base64')}` // Basic auth with your API key
            }
        });

        // Check for a successful response
        if (response.status === 200) {
            return res.status(200).json({ message: "Feedback sent successfully" });
        } else {
            // Ensure not to send a response again after this
            throw new Error("Failed to send feedback");
        }
    } catch (error) {
        console.error("Error during email sending:", error);
        // Ensure we only send the response once
        if (!res.headersSent) {
            return res.status(500).json({ message: "Error sending feedback" });
        }
    }
};

// Handle file upload function
const handleFileUpload = (req, res) => {
    return new Promise((resolve, reject) => {
        upload.array("attachment")(req, res, (err) => {
            if (err) {
                return reject(new Error("File upload error"));
            }
            resolve();
        });
    });
};

export { sendFeedbackEmail };
