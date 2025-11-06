import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/users/";

export const registerUser = async (data: {
  username: string;
  email: string;
  password: string;
}) => {
  const res = await axios.post(`${API_URL}register/`, data, {
                    headers: { "Content-Type": "application/json" }}
                );
  return res.data;
};

export const loginUser = async (data: {
  username: string;
  password: string;
}) => {
  const res = await axios.post(`${API_URL}login/`, data,{
                headers: { "Content-Type": "application/json" }}
            );
  return res.data;
};
