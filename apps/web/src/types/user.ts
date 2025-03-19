/**
 * Represents the verification status of an account
 */
interface BaseAccount {
  isVerified: boolean;
}

/**
 * Local account specific properties
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface LocalAccount extends BaseAccount {}

/**
 * Properties specific to OAuth accounts (Google, GitHub)
 */
interface OAuthAccount extends BaseAccount {
  hasAuthorizedEmail: boolean;
}

/**
 * Google account with additional email property
 */
interface GoogleAccount extends OAuthAccount {
  email: string;
}

/**
 * Integration status interface
 */
interface IntegrationStatus {
  connected: boolean;
}

/**
 * All available integrations
 */
interface Integrations {
  linear: IntegrationStatus;
  googleCalendar: IntegrationStatus;
  gmail: IntegrationStatus;
  github: IntegrationStatus;
  notion: IntegrationStatus;
  x: IntegrationStatus
}

/**
 * User accounts interface containing all account types
 */
interface UserAccounts {
  local: LocalAccount;
  google: GoogleAccount;
  github: OAuthAccount;
}

/**
 * Main user interface containing all user information
 */
export interface User {
  uuid: string;
  fullName: string;
  userName: string;
  avatar: string;
  roles: string[];
  timezone: string;
  accounts: UserAccounts;
  integrations: Integrations;
}