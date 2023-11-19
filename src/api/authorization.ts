import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

interface Data {
  name: string;
  email: string;
  password: string;
}

export const register = (data: Data) => {
  return axios.post(`${BASE_URL}/register`, data);
};

export const activate = (activationToken: string) => {
  return axios.get(`${BASE_URL}/activate/${activationToken}`);
};

export const logout = (userId: number) => {
  return axios.post(`${BASE_URL}/logout/${userId}`);
};

export const getUsers = () => {
  const response = axios.get(`${BASE_URL}/users`);

  return response;
};

export const sendActivationLink = (name: string, email: string) => {
  return axios.post(`${BASE_URL}/sign-up`, { name, email });
};

export const login = (email: string, password: string) => {
  return axios.post(`${BASE_URL}/login`, { email, password });
};

export const googleLogin = () => {
  return axios.get(`${BASE_URL}/auth/google`);
};

export const getLoginGoogleData = () => {
  return axios.get(`${BASE_URL}/auth/google/callback`);
};

export const forgotPassword = (email: string) => {
  return axios.post(`${BASE_URL}/forgot-password`, { email });
};

export const resetPassword = (resetToken: string, newPassword: string) => {
  return axios.post(`${BASE_URL}/reset-password/${resetToken}`, { newPassword })
}
