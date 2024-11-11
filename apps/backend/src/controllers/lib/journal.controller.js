import Joi from "joi";
import { createUpdateJournal, getUserJournal, getUserAllJournals, getUserTodayJournal } from "../../services/lib/journal.service.js";
import { CreateUpdateJournalPayload } from "../../payloads/lib/journal.payload.js";

const { ValidationError } = Joi;

const createUpdateJournalController = async (req, res, next) => {
    try {
        const payload = await CreateUpdateJournalPayload.validateAsync(req.body)

        const { date, content } = payload;
        const user = req.user._id;

        const journal = await createUpdateJournal(date, content, user)
        res.json({
            journal
        });
    } catch (err) {
        const error = new Error(err)
        error.statusCode = err instanceof ValidationError ? 400 : (err.statusCode || 500)
        next(error);
    }
}

const getUserTodayJournalController = async (req, res, next) => {
    try {
        const user = req.user._id;
        const journal = await getUserTodayJournal(user)
        res.json({
            journal
        });
    } catch (err) {
        next(err);
    }
}

const getUserJournalByDateController = async (req, res, next) => {
    try {
        const { date } = req.params;
        const user = req.user._id;
        const journal = await getUserJournal(date, user)
        res.json({
            journal
        });
    } catch (err) {
        next(err);
    }
}

const getUserAllJournalsController = async (req, res, next) => {
    try {
        const user = req.user._id;
        const journals = await getUserAllJournals(user)
        res.json({
            journals
        });
    } catch (err) {
        next(err);
    }
}

export {
    createUpdateJournalController,
    getUserTodayJournalController,
    getUserAllJournalsController,
    getUserJournalByDateController
}
