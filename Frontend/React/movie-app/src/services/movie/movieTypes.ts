export interface Review {
  id: number;
  content: string;
  createdAt?: string;
  user?: {
    id: number;
    username: string;
  };
}

export interface Movie {
  id: number;
  title: string;
  description?: string;
  releaseDate?: string;
  durationMinutes?: number;
  posterUrl?: string;
  averageRating?: number;
  genres?: string[];
  actors?: string[];
  directors?: string[];
  reviews?: Review[];
}
export interface RatingRequest {
  rating: number;
}

export interface ReviewRequest {
  content: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
}