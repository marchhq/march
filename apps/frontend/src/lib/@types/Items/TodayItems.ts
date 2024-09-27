export interface Item {
  title: string;
  type: string;
  description: string;
  dueDate: string;
  metadata: {
    labels: string;
  };
  isCompleted: boolean;
  uuid: string;
}

export interface Items {
  response: {
    items: Item[]
  }
}
