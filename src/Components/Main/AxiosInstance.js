import axios from "axios";
const AxiosInstance = axios.create({
   //baseURL: "http://localhost:5000/api/v1", // Change to your API base URL for localhost
   baseURL: "https://tpp-backend-9xoz.onrender.com/api/v1", // Change to your API base URL
   headers: {
      "Content-Type": "application/json",
   },
});

// Optional: Add a request interceptor for auth token
AxiosInstance.interceptors.request.use(
   (config) => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.token) {
         config.headers.authorization = user.token;
      }
      return config;
   },
   (error) => Promise.reject(error)
);

export default AxiosInstance;
