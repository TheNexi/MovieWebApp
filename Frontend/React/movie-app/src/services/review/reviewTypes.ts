export interface Review {
  id: number;
  content: string;
  createdAt?: string;
  user?: {
    id: number;
    username: string;
  };
}

export interface RatingRequest {
  rating: number;
}

export interface ReviewRequest {
  content: string;
}
