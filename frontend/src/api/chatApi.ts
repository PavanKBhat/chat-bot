import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

export default axiosInstance;



export const createConversation = async (title = "New Chat") => {
  const res = await axiosInstance.post("conversations/", { title });
  return res.data;
};


export const getConversations = async () => {
  const res = await axiosInstance.get("conversations/");
  return res.data;
};


export const getConversation = async (id: number) => {
  const res = await axiosInstance.get(`conversations/${id}/`);
  return res.data;
};


export const addMessage = async (
  id: number,
  message: { sender: string; content: string }
) => {
  const res = await axiosInstance.post(`conversations/${id}/messages/`, message);
  return res.data;
};


export const renameConversation = async (id: number, newTitle: string) => {
  const res = await axiosInstance.patch(`conversations/${id}/rename/`, {
    title: newTitle,
  });
  return res.data;
};

export const deleteConversation = async (id: number) => {
  const res = await axiosInstance.delete(`conversations/${id}/delete/`);
  return res.data;
};