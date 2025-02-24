export interface GoogleAuthResponse {
  accessToken: string;
  refreshToken: string;
  isNewUser: boolean;
}

export interface GitHubAuthResponse {
  accessToken: string;
  refreshToken: string;
  isNewUser: boolean;
}

export interface TokenVerificationResponse {
  isValidUser: boolean;
}
