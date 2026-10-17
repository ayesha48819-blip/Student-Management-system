import axios from "axios";

// Same address works locally (Vite proxy) and on Vercel
const api = axios.create({ baseURL: "/api" });

// Turn server errors into a readable message
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      (error.response
        ? `Request failed with status ${error.response.status}.`
        : "Can't reach the server. Make sure the backend is running.");
    return Promise.reject(new Error(message));
  }
);

export const getStudents = () => api.get("/students").then((res) => res.data);
export const createStudent = (data) => api.post("/students", data).then((res) => res.data);
export const updateStudent = (id, data) => api.put(`/students/${id}`, data).then((res) => res.data);
export const deleteStudent = (id) => api.delete(`/students/${id}`).then((res) => res.data);
