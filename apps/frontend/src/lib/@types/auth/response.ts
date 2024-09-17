/**
 * Google Auth Response
 */
export interface GoogleAuthResponse {
  accessToken: string
  refreshToken: string
  isNewUser: boolean
}

/**
    Github Auth Response
*/
export interface GitHubAuthResponse {
  accessToken: string
  refreshToken: string
  isNewUser: boolean
}
