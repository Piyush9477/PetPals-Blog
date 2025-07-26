import API from './axios';

export const loginUser = async (data) => {
  return await API.post('/auth/login', data);
};

export const registerUser = async (data) => {
  return await API.post('/auth/register', data);
};

export const sendVerificationEmail = async (data) => {
  return await API.post('/auth/send-verification-email', data);
};

export const verifyUser = async (data) => {
  return await API.post('/auth/verify-user', data);
}
