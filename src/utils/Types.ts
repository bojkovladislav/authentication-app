export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  activationToken: null | string;
  createdAt: string;
  updatedAt: string;
}

export interface NormalizedUser {
  name: string | null;
  email: string | null;
}

export interface NotificationType {
  message: string;
  error?: boolean;
}

export interface AuthorizedUserData {
  name: string | null;
  email: string | null;
  accessToken: string | null;
}

export type Token = {
  id: number;
  email: string;
  name: string;
  iat: number;
  exp: number;
};
