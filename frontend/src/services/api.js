import axios from "axios";

const api = axios.create({
  baseURL: "https://domora-cbpe.onrender.com",
  withCredentials: true, // without this cookie will never be stored.
});

export default api;
