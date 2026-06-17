export interface Review {
  id: number;
  content: string;
  username: string;
  createdAt: string;
}

export interface Movie {
  id: number;
  title: string;
  description: string;

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
  username?: string | null;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
}