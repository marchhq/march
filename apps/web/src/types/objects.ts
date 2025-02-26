interface Cycle {
  startsAt: Date | null;
  endsAt: Date | null;
}

interface Metadata {
  createdByAI: boolean;
  originalQuery: string;
  createdAt: string;
}

export interface Objects {
  _id: string;
  uuid: string;
  title: string;
  description?: string;
  type: 'todo'; 
  source: string;
  icon: string;
  cover_image: string;
  
  // Date fields
  dueDate?: string; // ISO date string
  completedAt: Date | null;
  createdAt: string;
  updatedAt: string;
  
  // Status fields
  status: string | null;
  isCompleted?: boolean;
  isArchived: boolean;
  isDeleted: boolean;
  isFavorite: boolean;
  
  // Nested objects
  cycle: Cycle;
  metadata: Metadata;
  
  // Arrays
  arrays: any[]; 
  blocks: any[]; 
  labels: string[];
  tags?: string[];
  
  // Reference fields
  user: string; 
}

interface ObjectsResponse {
  response: Objects[]
}

interface TodayObjectResponse {
  response: {
    todayObjects: Objects[],
    overdueObjects: Objects[]
  }
}

interface CreateObject {
  title: string,
  dueDate?: string | null,
}

export type { Objects, Cycle, Metadata, ObjectsResponse, TodayObjectResponse, CreateObject };