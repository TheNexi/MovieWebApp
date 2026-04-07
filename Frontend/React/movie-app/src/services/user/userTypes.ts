export interface User {
  id: number;
  username: string;
  email?: string;
  favourites?: number[];
}