import { data } from 'react-router-dom';
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
};

export const sendForgotPasswordCode = async (data) => {
  return await API.post('/auth/send-forgot-password-code', data);
};

export const setNewPassword = async (data) => {
  return await API.post('/auth/set-new-password', data);
};

export const checkAuth = async (token) => {
  try {
    const res = await API.get('/auth/check', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.user;
  } catch (error) {
    return null;
  }
};

export const logoutUser = async () => {
  return await API.post('/auth/logout');
}

export const getProfile = async () => {
  return await API.get('/auth/profile');
}

export const editProfile = async (data) => {
  return await API.put('/auth/edit-profile', data);
}
