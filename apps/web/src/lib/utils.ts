import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const extractMessageData = (response: any) => {
  if (response?.data?.data) {
    return response.data.data;
  }
  return null;
};
