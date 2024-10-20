  'use client'
   import React from 'react';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';


   interface User {
     id: number;
     name: string;
     email: string;
     verified: boolean;
   }

   const dummyUsers: User[] = [
     { id: 1, name: "John Doe", email: "john@example.com", verified: true },
     { id: 2, name: "Jane Smith", email: "jane@example.com", verified: false },
     // Add more dummy users as needed
   ];

   const UserTable: React.FC = () => {
     const toggleVerification = (id: number) => {
       // Logic to toggle verification status
       console.log(`Toggled verification for user with id: ${id}`);
     };

     return (
       <div className="overflow-x-auto">
         <Table className="min-w-full divide-y divide-gray-200">
           <TableHeader className="">
             <TableRow>
               <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</TableHead>
               <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</TableHead>
               <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verified</TableHead>
               <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</TableHead>
             </TableRow>
           </TableHeader>
           <TableBody className="0">
             {dummyUsers.map(user => (
               <TableRow key={user.id}>
                 <TableCell className="px-6 py-4 whitespace-nowrap">{user.name}</TableCell>
                 <TableCell className="px-6 py-4 whitespace-nowrap">{user.email}</TableCell>
                 <TableCell className="px-6 py-4 whitespace-nowrap">{user.verified ? "Yes" : "No"}</TableCell>
                 <TableCell className="px-6 py-4 whitespace-nowrap">
                   <Button onClick={() => toggleVerification(user.id)}>
                     {user.verified ? "Unverify" : "Verify"}
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