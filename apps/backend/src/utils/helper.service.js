import fs from "fs";
import path from "path";
import handlebars from "handlebars";

export const readTemplateFile = async (name, data) => {
    const content = fs
        .readFileSync(path.resolve("src", "templates", `${name}.hbs`))
        .toString("utf8");
    const template = handlebars.compile(content, {
        noEscape: true
    });
    return template(data);
};

// metadata extraction for vector storage
export const extractEnhancedMetadata = (object) => {
    return {
        objectId: object._id.toString(),
        title: object.title,
        type: object.type,
        source: object.source,
        status: object.status,
        taskState: {
            isCompleted: object.isCompleted,
            isArchived: object.isArchived,
            isFavorite: object.isFavorite,
            completedAt: object.completedAt
        },
        dates: {
            dueDate: object.dueDate,
            createdAt: object.createdAt,
            updatedAt: object.updatedAt,
            cycleStart: object.cycle?.startsAt,
            cycleEnd: object.cycle?.endsAt
        },
        relationships: {
            userId: object.user.toString(),
            parentId: object.parent?.toString(),
            labelIds: object.labels.map(id => id.toString()),
            arrayIds: object.arrays.map(id => id.toString())
        }
    };
}

// Function to clean metadata before saving
export function cleanMetadata (object) {
    if (!object?.user) {
        throw new Error("Invalid object: missing user reference");
    }

    return {
        title: object.title?.trim() || "",
        description: object.description?.trim() || "",
        type: object.type?.toLowerCase() || "",
        source: object.source?.toLowerCase() || "",
        status: object.status?.toLowerCase() || "",
        dueDate: object.dueDate ? new Date(object.dueDate).toISOString() : "",
        isCompleted: Boolean(object.isCompleted),
        userId: object.user.toString()
    };
}
