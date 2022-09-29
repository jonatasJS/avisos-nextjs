import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL : "https://avisos.herokuapp.com",
});

console.log(process.env.NEXT_PUBLIC_API_URL);

export default api;