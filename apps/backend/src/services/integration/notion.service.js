import axios from 'axios';
import { environment } from '../../loaders/environment.loader.js';

// const getNotionAccessToken = async (code, user) => {
//     // const tokenResponse = await axios.post('https://api.notion.com/v1/oauth/token', {
//     //     grant_type: 'authorization_code',
//     //     code: code,
//     //     redirect_uri: environment.NOTION_REDIRECT_URL,
//     //     client_id: environment.NOTION_CLIENT_ID,
//     //     client_secret: environment.NOTION_CLIENT_SECRET
//     // });

//     const tokenResponse = await axios.post('https://api.notion.com/v1/oauth/token', {
//         grant_type: 'authorization_code',
//         code: code,
//         redirect_uri: environment.NOTION_REDIRECT_URL,
//         // client_id: environment.NOTION_CLIENT_ID,
//         // client_secret: environment.NOTION_CLIENT_SECRET
//     }, {
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded'
//         }
//     });
    

//     const accessToken = tokenResponse.data.access_token;
    
//       // Save the user's access token in the database
//     //   const user = new User({ notionAccessToken: accessToken });
//     //   await user.save();
    
//     //   res.send('Notion connected successfully! Now you can select a page.');

//     console.log("f: ", tokenResponse.data);
//     console.log("f2: ", accessToken);
// }


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
            console.log("Access Token:", tokenResponse.data.access_token);
            console.log("sajda: ", tokenResponse.data);
            // return tokenResponse.data.access_token;
    } catch (err) {
        console.error("Error Message:", err.message);
        console.error("Error Response:", err.response?.data);
        console.error("Request Config:", err.config);
        throw err;
    }
}


export {
    getNotionAccessToken
}
