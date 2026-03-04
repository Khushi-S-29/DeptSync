import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = token;
  return req;
});

export const login = (formData) => API.post("/auth/login", formData);
export const fetchRooms = () => API.get("/rooms");
export const fetchRoomSlots = (roomId) => API.get(`/timetable/room/${roomId}`);
export const updateSlot = (data) => API.put("/timetable/update", data);
export const createUser = (data) => API.post("/auth/create_user", data);
