/**
 * User type.
 */

export interface AuthAccount {
  email?: string
  isVerified: boolean
}

export type AccountProvider = "local" | "google" | "github"

export type IntegrationType =
  | "linear"
  | "googleCalendar"
  | "gmail"
  | "github"
  | "notion"

export interface User {
  fullName: string
  avatar: string
  timezone: string
  userName: string
  accounts: Partial<Record<AccountProvider, AuthAccount>>
  integrations: Partial<Record<IntegrationType, { connected: boolean }>>
}

// this is the type for showing the integration in profile page
export interface Integration {
  key: IntegrationType;
  icon: JSX.Element;
  name: string;
  description: string;
}
