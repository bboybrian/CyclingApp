import axios from "axios"

const backend = axios.create({
    withCredentials: true,
    baseURL: "http://localhost:8080"
});

export default backend;