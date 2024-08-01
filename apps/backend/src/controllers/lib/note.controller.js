import { createNote, getNotes, getNote, updateNote, deleteNote } from "../../services/lib/note.service.js";

const createNoteController = async (req, res, next) => {
    try {
        // const user = req.user._id;
        const user = req.auth.userId;

        const requestedData = req.body;
        const item = await createNote(user, requestedData);

        res.status(200).json({
            status: 200,
            response: item
        });
    } catch (err) {
        next(err);
    }
};

const getNotesController = async (req, res, next) => {
    try {
        // const user = req.user._id;
        const user = req.auth.userId;

        const notes = await getNotes(user);

        res.status(200).json({
            status: 200,
            response: notes
        });
    } catch (err) {
        next(err);
    }
};

const getNoteController = async (req, res, next) => {
    try {
        // const user = req.user._id;
        const user = req.auth.userId;
        const { note: id } = req.params;

        const note = await getNote(user, id);

        res.status(200).json({
            status: 200,
            response: note
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
            status: 200,
            response: note
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
            status: 200,
            message: 'note deleted successfully'
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
    deleteNoteController
}
