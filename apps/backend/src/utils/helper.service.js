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
export const extractMetadata = (object) => {
    return {
        objectId: object._id?.toString() || "",
        title: object.title || "",
        description: object.description || "",
        type: object.type || "",
        source: object.source || "",
        status: object.status || "",
        isCompleted: Boolean(object.isCompleted),
        isArchived: Boolean(object.isArchived),
        isFavorite: Boolean(object.isFavorite),
        completedAt: object.completedAt ? new Date(object.completedAt).toISOString() : "",
        dueDate: object.dueDate ? new Date(object.dueDate).toISOString() : "",
        createdAt: object.createdAt ? new Date(object.createdAt).toISOString() : "",
        updatedAt: object.updatedAt ? new Date(object.updatedAt).toISOString() : "",
        cycleStart: object.cycle?.startsAt ? new Date(object.cycle.startsAt).toISOString() : "",
        cycleEnd: object.cycle?.endsAt ? new Date(object.cycle.endsAt).toISOString() : "",
        userId: object.user ? object.user.toString() : "",
        parentId: object.parent ? object.parent.toString() : "",
        labelIds: Array.isArray(object.labels) ? object.labels.map(id => id.toString()) : [],
        arrayIds: Array.isArray(object.arrays) ? object.arrays.map(id => id.toString()) : []
    };
};

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
