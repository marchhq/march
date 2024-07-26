import Joi from "joi";

const CreateUpdateJournalPayload = Joi.object({
    content: Joi.string().optional(),
    date: Joi.date().optional()
});

export {
    CreateUpdateJournalPayload
}
