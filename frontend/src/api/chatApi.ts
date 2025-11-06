import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/";
const token = localStorage.getItem("token");


const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  },
});


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
