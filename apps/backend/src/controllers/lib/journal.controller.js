import Joi from "joi";
import { createUpdateJournal, getUserJournal, getUserAllJournals } from "../../services/lib/journal.service.js";
import { CreateUpdateJournalPayload } from "../../payloads/lib/journal.payload.js";
import moment from "moment-timezone";

const { ValidationError } = Joi;

const createUpdateJournalController = async (req, res, next) => {
    try {
        const payload = await CreateUpdateJournalPayload.validateAsync(req.body)

        const { date, content } = payload;
        // const user = req.user._id;
        const user = req.auth.userId;

        const journalDate = moment(date).startOf('day').toDate();
        const journal = await createUpdateJournal(journalDate, content, user)
        res.json({
            status: 200,
            response: journal
        });
    } catch (err) {
        const error = new Error(err)
        error.statusCode = err instanceof ValidationError ? 400 : (err.statusCode || 500)
        next(error);
    }
}

const getUserTodayJournalController = async (req, res, next) => {
    try {
        const { date } = req.params;
        // const user = req.user._id;
        const user = req.auth.userId;
        const journalDate = moment(date).startOf('day').toDate();
        const journal = await getUserJournal(journalDate, user)
        res.json({
            status: 200,
            response: journal
        });
    } catch (err) {
        next(err);
    }
}

const getUserAllJournalsController = async (req, res, next) => {
    try {
        // const user = req.user._id;
        const user = req.auth.userId;
        const journal = await getUserAllJournals(user)
        res.json({
            status: 200,
            response: journal
        });
    } catch (err) {
        next(err);
    }
}

export {
    createUpdateJournalController,
    getUserTodayJournalController,
    getUserAllJournalsController
}
