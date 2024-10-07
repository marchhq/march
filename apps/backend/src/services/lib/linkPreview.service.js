import * as cheerio from 'cheerio';
import axios from "axios";

const linkPreviewGenerator = async (url) => {
    try {
        const { data: html } = await axios.get(url);

        const $ = cheerio.load(html);

        const title = $('meta[property="og:title"]').attr('content') || $('title').text();
        const favicon = $('link[rel="icon"]').attr('href');
        return {
            title: title || '',
            favicon: favicon || ''
        };
    } catch (error) {
        console.error('Error fetching metadata:', error);
        throw new Error('Failed to fetch metadata');
    }
};

export {
    linkPreviewGenerator
}
