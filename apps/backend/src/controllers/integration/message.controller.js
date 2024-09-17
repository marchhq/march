import twilio from 'twilio';
import { environment } from '../../loaders/environment.loader.js';

twilio(environment.TWILIO_ACCOUNT_SID, environment.TWILIO_AUTH_TOKEN);

const handleSmsItemCreation = async (req, res, next) => {
    try {
        console.log("Received request body:", req.body)
        const messageBody = req.body.Body;
        const fromNumber = req.body.From;

        // issue creation
        console.log(`Received message: ${messageBody} from ${fromNumber}`);

        // confirmation SMS
        const twiml = new twilio.twiml.MessagingResponse();
        twiml.message('Your issue has been logged successfully!');

        res.writeHead(200, { 'Content-Type': 'text/xml' });
        res.end(twiml.toString());
    } catch (err) {
        next(err);
    }
}

export {
    handleSmsItemCreation
}
