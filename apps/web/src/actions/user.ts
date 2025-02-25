"use server"

import { apiClient } from "@/lib/api"
import { User } from "@/types/user"

export async function getUser(): Promise<User> {
    const user = await apiClient.get<User>('/users/me');
    return user;
}