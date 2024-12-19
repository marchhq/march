import { v4 as uuid } from "uuid";
import { db } from "../../loaders/db.loader.js";
import { Space } from "./space.model.js";

async function migrateSpaces() {
    try {
        const spaces = await Space.find({ identifier: { $exists: false } });

        for (const space of spaces) {
            let newIdentifier = uuid().toUpperCase();
            let suffix = 1;

            while (await Space.findOne({ identifier: newIdentifier, users: { $in: space.users } })) {
                newIdentifier = `${uuid().toUpperCase()}${suffix}`;
                suffix++;
            }

            space.identifier = newIdentifier;
            await space.save();
        }

        console.log("Migration completed successfully.");
    } catch (error) {
        console.error("Error during migration:", error);
    }
}

migrateSpaces();
