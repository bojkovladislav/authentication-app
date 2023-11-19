export interface User {
  id: number;
  name: string,
  email: string;
  password: string;
  activationToken: null | string;
  createdAt: string;
  updatedAt: string;
}

export interface NormalizedUser {
  name: string | null,
  email: string | null,
}