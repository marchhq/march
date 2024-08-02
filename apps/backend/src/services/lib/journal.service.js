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
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const journal = await Journal.findOne({
        date: { $gte: startOfDay, $lte: endOfDay },
        user
    });
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
