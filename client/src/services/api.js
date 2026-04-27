import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const createSession = async () => {
  const response = await axios.post(`${API_URL}/session`);
  return response.data.sessionId;
};

export const getChatHistory = async (sessionId) => {
  const response = await axios.get(`${API_URL}/chat/${sessionId}`);
  return response.data;
};

export const sendMessage = async (sessionId, message) => {
  const response = await axios.post(`${API_URL}/chat`, { sessionId, message });
  return response.data.reply;
};
