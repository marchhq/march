import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants';

export const tokenUtils = {
  // Get access token from client-side cookie
  getAccessToken: () => {
    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${ACCESS_TOKEN}=`));
    console.log("cookie: ", cookie);
    return cookie ? cookie.split('=')[1] : null;
  },

  // Clear tokens
  clearTokens: () => {
    document.cookie = `${ACCESS_TOKEN}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    document.cookie = `${REFRESH_TOKEN}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  },

  // Check if token exists
  hasAccessToken: () => {
    return !!tokenUtils.getAccessToken();
  }
};