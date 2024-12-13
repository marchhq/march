import { v4 as uuid } from "uuid";
import { Space } from "../models/lib/space.model.js";

async function migrateSpaces () {
    try {
        const spaces = await Space.find({ identifier: { $exists: false } });
        console.log("spaces: ", spaces);

        for (const space of spaces) {
            let newIdentifier = space.name.toUpperCase();
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

export default migrateSpaces;
