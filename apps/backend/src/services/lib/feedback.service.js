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

import axios from "axios";
import { upload } from "../../loaders/s3.loader.js";
import { environment } from "../../loaders/environment.loader.js";

const sendFeedbackEmail = async (req, res) => {
    try {
        // Handle file uploads using Multer
        await handleFileUpload(req, res);

        const { title, feedback, email } = req.body;
        const attachments = req.files || []; // Default to an empty array if no files

        // Prepare the data for Loop's API request
        const emailData = {
            transactionalId: "cm34je93z00q011c1ku9u1jb5", // Replace with your actual transactionalId from Loop
            email: environment.FEEDBACK_RECEIVER_EMAIL, // Feedback receiver email
            dataVariables: {
                FirstName: email.split("@")[0], // Example: extracting the first part of the email
                body: `Title: ${title}\n\nFeedback: ${feedback}`
            },
            attachment: attachments.map((file) => ({
                filename: file.originalname,
                url: file.location // File location from S3
            })),
            useremail: email // This could be the user's email for the reply-to
        };
        console.log("Sending email data to Loop:", emailData);

        // Make the request to Loop's transactional email service
        const response = await axios.post(
            "https://app.loops.so/api/v1/transactional",
            emailData,
            {
                headers: {
                    Authorization: "Bearer 9930375ef8c0c1d13f39d7ef66bef953", // Use your Loop API key
                    "Content-Type": "application/json"
                }
            }
        );

        if (response.status === 200) {
            return { status: 200, message: "Feedback sent successfully via Loop" };
        } else {
            throw new Error("Error sending feedback with Loop");
        }
    } catch (error) {
        console.error("Error during email sending:", error);
        throw new Error("Error sending feedback");
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
