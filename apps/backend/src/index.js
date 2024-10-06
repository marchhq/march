import express from "express";
import cors from "cors";
import Joi from "joi";
import { environment } from "./loaders/environment.loader.js";
import { initRoutes } from "./routers/index.js";
import { handlePushNotification } from "./controllers/integration/email.controller.js";
import { handleWebhook } from "./controllers/integration/linear.controller.js";
import { handleCalendarWebhook } from "./controllers/integration/calendar.controller.js";
import { handleGithubWebhook } from "./controllers/integration/github.controller.js";
import { handleSmsItemCreation } from "./controllers/integration/message.controller.js";
import bodyParser from "body-parser";
import * as cheerio from 'cheerio';
import axios from "axios";
import { linearWorker } from "./jobs/linear.job.js";
import { calendaWorker } from "./jobs/calendar.job.js";
import { spaceWorker } from "./jobs/space.job.js";

const { ValidationError } = Joi;
const app = express();
app.use(cors());

app.use('/linear/webhook', bodyParser.raw({ type: 'application/json' }));

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true
    })
);

app.post("/linear/webhook", handleWebhook);
app.post("/calendar/webhook", handleCalendarWebhook);
app.post("/gmail/webhook", handlePushNotification);
app.post("/github/webhook", handleGithubWebhook);

app.post("/sms", handleSmsItemCreation);

const linkPreviewGenerator = async (url) => {
    try {
        const { data: html } = await axios.get(url);

        // Load the HTML content into Cheerio for parsing
        const $ = cheerio.load(html);

        // Extract metadata from the HTML
        const title = $('meta[property="og:title"]').attr('content') || $('title').text();
        const description = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content');
        const image = $('meta[property="og:image"]').attr('content');
        const favicon = $('link[rel="icon"]').attr('href');
        const domain = new URL(url).hostname;

        // Return the extracted metadata as an object
        return {
            title: title || '',
            description: description || '',
            domain: domain || '',
            img: image || '',
            favicon: favicon || ''
        };
    } catch (error) {
        console.error('Error fetching metadata:', error);
        throw new Error('Failed to fetch metadata');
    }
};

app.post('/api/get-link-preview', async (req, res) => {
    const url = req.body.url;
    try {
        const previewData = await linkPreviewGenerator(url);
        res.json(previewData);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch preview data' });
    }
});

initRoutes(app);
// Express error handler
app.use((err, req, res, next) => {
    console.log(err);
    if (environment.SHOW_ADMIN) {
        console.log(err);
    }
    if (err) {
        if (err.statusCode === 500) {
            // sentry.captureException(err)
        }
        res
            .status(err instanceof ValidationError ? 400 : err.statusCode || 500)
            .send({
                statusCode:
          err instanceof ValidationError ? 400 : err.statusCode || 500,
                message:
          process.env.NODE_ENV === "development"
              ? err.message
              : "Something went wrong. Please contact the administrator"
            });
    } else {
        next();
    }
});

export { app, express };
