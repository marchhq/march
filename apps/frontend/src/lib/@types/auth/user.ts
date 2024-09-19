/**
 * User type.
 */

export interface AuthAccount {
  email?: string
  isVerified: boolean
}

export interface User {
  fullName: string
  avatar: string
  timezone: string
  userName: string
  accounts: {
    local: AuthAccount
    google: AuthAccount
    github: AuthAccount
  }
}
