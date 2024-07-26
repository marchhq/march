import moment from "moment-timezone";
import { Journal } from "../../models/lib/journal.model.js";

const createUpdateJournal = async (journalDate, content, user) => {
    const journal = await Journal.findOneAndUpdate(
        { date: journalDate, user },
        { $set: { content } },
        { new: true, upsert: true }
    );
    return journal;
}

const getUserJournal = async (journalDate, user) => {
    const journal = await Journal.findOne({ date: journalDate, user });
    if (!journal) {
        return null;
    }

    return journal;
}
const getUserAllJournals = async (user) => {
    const journals = await Journal.find({ user });
    if (!journals) {
        return null;
    }

    return journals;
}

const getUserTodayJournal = async (user) => {
    const today = moment().startOf('day');
    const journal = await Journal.findOne({ date: today, user });
    if (!journal) {
        return null;
    }
    return journal;
}

export {
    createUpdateJournal,
    getUserJournal,
    getUserAllJournals,
    getUserTodayJournal
}
