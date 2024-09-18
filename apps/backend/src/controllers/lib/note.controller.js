import { createNote, getNotes, getNote, updateNote, deleteNote, getMostRecentUpdatedNote } from "../../services/lib/note.service.js";

const createNoteController = async (req, res, next) => {
    try {
        const user = req.user._id;

        const requestedData = req.body;
        const note = await createNote(user, requestedData);

        res.status(200).json({
            note
        });
    } catch (err) {
        next(err);
    }
};

const getNotesController = async (req, res, next) => {
    try {
        const user = req.user._id;

        const notes = await getNotes(user);

        res.status(200).json({
            notes
        });
    } catch (err) {
        next(err);
    }
};

const getNoteController = async (req, res, next) => {
    try {
        const user = req.user._id;
        const { note: id } = req.params;

        const note = await getNote(user, id);

        res.status(200).json({
            note
        });
    } catch (err) {
        next(err);
    }
};

const updateNoteController = async (req, res, next) => {
    try {
        const { note: id } = req.params;
        const updateData = req.body;
        const note = await updateNote(id, updateData);

        res.status(200).json({
            note
        });
    } catch (err) {
        next(err);
    }
};

const deleteNoteController = async (req, res, next) => {
    try {
        const { note: id } = req.params;
        await deleteNote(id);

        res.status(200).json({
            ok: "ok"
        });
    } catch (err) {
        next(err);
    }
};

const getMostRecentUpdatedNoteController = async (req, res, next) => {
    try {
        const user = req.user._id;
        const note = await getMostRecentUpdatedNote(user);

        res.status(200).json({
            note
        });
    } catch (err) {
        next(err);
    }
};

export {
    createNoteController,
    getNotesController,
    getNoteController,
    updateNoteController,
    deleteNoteController,
    getMostRecentUpdatedNoteController
}
