import { Note } from "../../models/lib/note.model.js";

const createNote = async (user, noteData) => {
    const newNote = new Note({
        ...noteData,
        user
    });
    if (!newNote) {
        const error = new Error("Failed to create the item")
        error.statusCode = 500
        throw error
    }

    const note = await newNote.save()

    return note;
};

const getNotes = async (user) => {
    const notes = await Note.find({
        user
    })
        .sort({ createdAt: -1 });

    return notes;
};

const getNote = async (user, id) => {
    const note = await Note.find({
        uuid: id,
        user
    })

    if (!note) {
        throw new Error('Note not found');
    }

    return note;
};

const updateNote = async (id, updateData) => {
    const updatedNote = await Note.findOneAndUpdate({
        uuid: id
    },
    { $set: updateData },
    { new: true }
    )

    return updatedNote;
};

const deleteNote = async (noteId) => {
    const note = await Note.findOneAndDelete({ uuid: noteId });

    if (!note) {
        throw new Error('Note not found');
    }
    return '';
};

const getMostRecentUpdatedNote = async (user) => {
    const note = await Note.findOne({
        user
    })
        .sort({ updatedAt: -1 });

    if (!note) {
        // eslint-disable-next-line no-unused-expressions
        null;
    }
    return note;
};

export {
    createNote,
    getNotes,
    getNote,
    updateNote,
    deleteNote,
    getMostRecentUpdatedNote
}
