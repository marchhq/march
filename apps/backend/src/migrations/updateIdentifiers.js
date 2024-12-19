import { Space } from "../models/lib/space.model.js";

async function updateIdentifiers () {
    try {
        const spaces = await Space.find({ identifier: /READING LIST/i });

        for (const space of spaces) {
            space.identifier = space.identifier.replace(/LIST/i, '').trim();
            await space.save();
        }

        console.log("Identifiers updated successfully.");
    } catch (error) {
        console.error("Error updating identifiers:", error);
    }
}

export default updateIdentifiers;
