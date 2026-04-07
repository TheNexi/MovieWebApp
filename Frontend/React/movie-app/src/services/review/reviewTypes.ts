export interface Review {
  id: number;
  content: string;
  createdAt?: string;
  user?: {
    id: number;
    username: string;
  };
}