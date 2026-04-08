export interface Movie {
  id: number;
  title: string;
  description: string;
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