import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL : "http://avisosbackend.us-3.evennode.com/",
});

console.log(process.env.NEXT_PUBLIC_API_URL);

export default api;