import type { User } from "./user";

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  alias: string;
  email: string;
  password: string;
}

export interface GoogleAuthPayload {
  credential: string;
}
