interface Cycle {
  startsAt: Date | null;
  endsAt: Date | null;
}

interface Metadata {
  createdByAI: boolean;
  originalQuery: string;
  createdAt: string;
}

interface Objects {
  _id: string;
  uuid: string;
  title: string;
  description: string;
  order: number,
  type: 'todo'; 
  source: string;
  icon: string;
  cover_image: string;
  
  // Date fields
  dueDate: Date | null;
  completedAt: Date | null;
  createdAt: string;
  updatedAt: string;
  
  // Status fields
  status: string | null;
  isCompleted: boolean;
  isArchived: boolean;
  isDeleted: boolean;
  isFavorite: boolean;
  
  // Nested objects
  cycle: Cycle;
  metadata: Metadata;
  
  // Arrays
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  arrays: any[]; 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  blocks: any[]; 
  labels: string[];
  
  // Reference fields
  user: string; 
}

interface ObjectsResponse {
  response: Objects[]
}

interface TodayObjectResponse {
  response: {
    todayObjects: Objects[],
    overdueObjects?: Objects[]
  }
}

interface CreateObject {
  title: string,
  dueDate?: string | null,
  isCompleted?: boolean,
}

interface OrderObject {
  orderedItems: {
    id: string,
    order: number
  }[]
}

interface OrderObjectRequest {
  orderedItems: OrderObject[]
}

interface SortableObject {
  type: string;
  text: string;
  checked: boolean;
}

interface OrderResponse {
    success: boolean;
    message: string;
}

export type { Objects, OrderObject, OrderObjectRequest, OrderResponse, ObjectsResponse, TodayObjectResponse, CreateObject, SortableObject };