import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getBooks = () => API.get("/books");
export const searchBooks = (query) => API.get(`/books/search?q=${query}`);
