import axios from "axios";
import { BACKEND_URL, token } from "./utils";

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

export const fetchAllUsers = async (): Promise<User[]> => {
  try {
    const response = await axios.get(`${BACKEND_URL}/users/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    return response.data; // Return the fetched user data
  } catch (error) {
    console.error("Error while fetching all users:", error);
    return []; // Return an empty array on error
  }
};