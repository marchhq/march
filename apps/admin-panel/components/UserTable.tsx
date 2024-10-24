"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import axios from 'axios';
import { BACKEND_URL, token } from "@/lib/utils";

interface User {
  id: number;
  name: string;
  email: string;
  isVerified: boolean;
  waitlist: boolean;
  roles: string[];
}

interface UserTableProps {
  users: User[]; 
}

const UserTable: React.FC<UserTableProps> = ({ users }) => {
  const [userList, setUserList] = useState<User[]>(users); 

  const toggleVerification = async (id: number, currentStatus: boolean) => {
    try {
      const newVerificationStatus = !currentStatus; 
      const response = await axios.patch(`${BACKEND_URL}/users/update/${id}`, {
        userVerification: newVerificationStatus,
      },
    {
      headers:{
        Authorization: `Bearer ${token}`
      }
    }
    );

      if (response.status === 200) {
        // Update the local state with the new verification status
        setUserList((prevUsers) =>
          prevUsers.map((user) =>
            user.id === id ? { ...user, isVerified: newVerificationStatus } : user
          )
        );
      }
    } catch (error) {
      console.error("Error updating verification status:", error);
    }
  };

  return (
    // TODO:: can create a general table that can be used across the app
    <div className="overflow-x-auto">
      <Table className="min-w-full divide-y divide-gray-200">
        <TableHeader>
          <TableRow>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Roles
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Verified
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              In Waitlist
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userList?.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="px-6 py-4 whitespace-nowrap">
                {user.name}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap">
                {user.email}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap">
                {user.roles.join(',')}
              </TableCell>
              <TableCell className={`px-6 py-4 whitespace-nowrap ${user.isVerified ? 'text-green-400' : 'text-red-400'}`}>
                {user.isVerified ? "Yes" : "No"}
              </TableCell>
              <TableCell className={`px-6 py-4 whitespace-nowrap ${user.waitlist ? 'text-green-400' : 'text-red-400'}`}>
                {user.waitlist ? "Yes" : "No"}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap">
                <Button onClick={() => toggleVerification(user.id, user.isVerified)}>
                  {user.isVerified ? "Unverify" : "Verify"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;