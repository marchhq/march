import { TwitterApi } from "twitter-api-v2";
import { Object } from "../../models/object.model";

export const convertBookmarkToObject = (bookmark, userId) => {
    const author = bookmark.author;

    return {
        title: bookmark.text.substring(0, 200),
        type: "bookmark",
        source: "x",
        description: bookmark.text,
        metadata: {
            tweet_id: bookmark.id,
            author: {
                id: author.id,
                name: author.name,
                username: author.username,
                profile_image_url: author.profile_image_url
            },
            metrics: bookmark.metrics,
            entities: bookmark.entities,
            created_at: bookmark.created_at,
            media: bookmark.media
        },
        user: userId,
        createdAt: new Date(bookmark.created_at),
        updatedAt: new Date()
    };
};

export const syncXBookmarks = async (accessToken, userId) => {
    try {
        const userClient = new TwitterApi(accessToken);

        const bookmarks = await userClient.v2.bookmarks({
            "tweet.fields": [
                "created_at",
                "author_id",
                "conversation_id",
                "public_metrics",
                "entities",
                "context_annotations"
            ],
            "user.fields": [
                "name",
                "username",
                "profile_image_url"
            ],
            "media.fields": [
                "url",
                "preview_image_url",
                "type"
            ],
            expansions: [
                "author_id",
                "attachments.media_keys"
            ],
            max_results: 100
        });

        const processedBookmarks = bookmarks.data.map(tweet => {
            const author = bookmarks.includes.users.find(user => user.id === tweet.author_id);

            return {
                id: tweet.id,
                text: tweet.text,
                created_at: tweet.created_at,
                author: {
                    id: author.id,
                    name: author.name,
                    username: author.username,
                    profile_image_url: author.profile_image_url
                },
                metrics: tweet.public_metrics,
                entities: tweet.entities,
                media: tweet.attachments?.media_keys?.map(key =>
                    bookmarks.includes.media.find(media => media.media_key === key)
                ).filter(Boolean)
            };
        });

        const savePromises = processedBookmarks.map(async (bookmark) => {
            const existingBookmark = await Object.findOne({
                'metadata.tweet_id': bookmark.id,
                user: userId
            });

            if (!existingBookmark) {
                const objectData = convertBookmarkToObject(bookmark, userId);
                const newObject = new Object(objectData);
                return newObject.save();
            }
            return null;
        });

        const savedObjects = await Promise.all(savePromises);
        const newBookmarks = savedObjects.filter(Boolean);

        return {
            success: true,
            totalBookmarks: processedBookmarks.length,
            newBookmarks: newBookmarks
        };
    } catch (error) {
        console.error("Error syncing X bookmarks:", error);
        throw new Error(`Failed to sync X bookmarks: ${error.message}`);
    }
};
