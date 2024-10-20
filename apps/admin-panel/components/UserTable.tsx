"use client";
import React from "react";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";



interface User {
  id: number;
  name: string;
  email: string;
  isVerified: boolean;
  waitlist: boolean;
  roles: string[];
}

interface User {
  id: number;
  name: string;
  email: string;
  isVerified: boolean;
  waitlist: boolean;
  roles: string[];
}

interface UserTableProps {
  users: User[]; // Define the users prop as an array of User
}

const UserTable: React.FC <UserTableProps>= ({users}) => {
  const toggleVerification = (id: number) => {
    // Logic to toggle verification status
    console.log(`Toggled verification for user with id: ${id}`);
  };


  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full divide-y divide-gray-200">
        <TableHeader className="">
          <TableRow>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Verified
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="0">
          {users?.map((user) => (
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
              <TableCell className={`px-6 py-4 whitespace-nowrap ${user.isVerified ? 'text-green-400' : 'text-red-400'} `}>
                {user.isVerified ? "Yes" : "No"}
              </TableCell>
              <TableCell className={`px-6 py-4 whitespace-nowrap ${user.waitlist ? 'text-green-400' : 'text-red-400'} `}>
                {user.waitlist ? "Yes" : "No"}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap">
                <Button onClick={() => toggleVerification(user.id)}>
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
