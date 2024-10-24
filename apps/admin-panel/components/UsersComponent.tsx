import React from 'react'
import UserTable from './UserTable'
import { fetchAllUsers } from '@/lib/api'

interface User {
    _id: number;
    fullName: string;
    email: string;
    userVerification: boolean;
    waitlist: boolean;
    roles: string[];
    accounts: {
        google: {
            email: string;
        };
    };
}

const UsersComponent = async() => {
    const users = await fetchAllUsers()
    const extractedUserDetails = users.map((user: User)=>({
        id: user._id,
        name: user.fullName,
        email: user.accounts.google.email,
        isVerified: user.userVerification,
        waitlist: user.waitlist,
        roles: user.roles
    }))
  return (
    <div>
        <UserTable users={extractedUserDetails}/>
    </div>
  )
}

export default UsersComponent