import axios, { AxiosError } from 'axios';

const BASE_URL = 'http://localhost:3005';

interface Data {
  email: string;
  password: string;
}

export const sendData = async ({ email, password }: Data): Promise<string> => {
  try {
    const response = await axios.post(`${BASE_URL}/sign-up`, {
      email,
      password,
    });

    return response.statusText;
  } catch (error: AxiosError | any) {
    console.log('Registration failed: ', error);

    return error.message;
  }
};
