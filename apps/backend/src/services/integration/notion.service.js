import axios from 'axios';
import { environment } from '../../loaders/environment.loader.js';

const getNotionAccessToken = async (code, user) => {
    try {
        const encoded = Buffer.from(`${environment.NOTION_CLIENT_ID}:${environment.NOTION_CLIENT_SECRET}`).toString("base64");
        const tokenResponse = await axios.post('https://api.notion.com/v1/oauth/token',
            {
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: environment.NOTION_REDIRECT_URL
            },
            {
                headers: {
                    'Authorization': `Basic ${encoded}`,
                    'Content-Type': 'application/json'
                }
            });
        user.integration.notion.accessToken = tokenResponse.data.access_token;
        user.integration.notion.workspaceId = tokenResponse.data.workspace_id;
        user.integration.notion.userId = tokenResponse.data.owner.user.id;
        user.integration.notion.connected = true;
        user.save();

        return tokenResponse.data.access_token;
    } catch (err) {
        console.error("Error Message:", err.message);
        console.error("Error Response:", err.response?.data);
        console.error("Request Config:", err.config);
        throw err;
    }
}

const syncNotionPages = async (user) => {
    const accessToken = user.integration.notion.accessToken;

    // Fetch all pages the user has access to
    const response = await axios.post(
        'https://api.notion.com/v1/search',
        {},
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Notion-Version': '2022-06-28'
            }
        }
    );

    const pages = response.data.results;

    for (const page of pages) {
        // Extract page details
        const pageId = page.id;
        const pageTitle = page.properties.title?.title?.[0]?.text?.content || 'Untitled';
        console.log("pageTitle: ", pageTitle);
        const pageUrl = `https://www.notion.so/${pageId.replace(/-/g, "")}`;
        console.log("pageUrl: ", pageUrl);

        // Fetch the content of the page
        const pageContentResponse = await axios.get(
            `https://api.notion.com/v1/blocks/${pageId}/children`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Notion-Version': '2022-06-28'
                }
            }
        );
        const blocks = pageContentResponse.data.results;
        let fullContent = ''; // Store all content from the page

        // Loop through the blocks and accumulate the content
        for (const block of blocks) {
            if (block.type === 'paragraph') {
                const blockContent = block.paragraph?.text?.[0]?.text?.content || '';
                fullContent += `${blockContent}\n`; // Append the block content
            } else if (block.type === 'heading_1' || block.type === 'heading_2' || block.type === 'heading_3') {
                const blockContent = block[block.type]?.text?.[0]?.text?.content || '';
                fullContent += `\n${blockContent}\n`; // Add heading content with spacing
            }
            // You can handle other block types similarly
            console.log("blockContent-saju: ", fullContent);
        }
        // const blocks = pageContentResponse.data.results;

        // // Process page content
        // for (const block of blocks) {
        //     const blockContent = block?.paragraph?.text?.[0]?.text?.content || 'No content';
        //     console.log("blockContent: ", blockContent);

        // Check if the item already exists in the database
        // const existingItem = await Item.findOne({ id: block.id, user: user._id });

        // if (existingItem) {
        //     // Update the existing item
        //     existingItem.title = pageTitle;
        //     existingItem.content = blockContent;
        //     existingItem.url = pageUrl;
        //     existingItem.updatedAt = new Date();
        //     await existingItem.save();
        // } else {
        //     // Create a new item in the database
        //     const newItem = new Item({
        //         title: pageTitle,
        //         content: blockContent,
        //         type: 'notionPage',
        //         id: block.id,
        //         url: pageUrl, // Page URL
        //         user: user._id,
        //         createdAt: new Date(),
        //         updatedAt: new Date()
        //     });
        //     await newItem.save();
        // }
        // }
    }
};

export {
    getNotionAccessToken,
    syncNotionPages
}
