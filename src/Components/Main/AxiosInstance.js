import axios from "axios";

// // Determine which API to use - try localhost first, fallback to backend
// const getBaseURL = () => {
//    // Try localhost first for local development
//    return "http://localhost:5000/api/v1";
// };

const AxiosInstance = axios.create({
    baseURL: process.env?.REACT_APP_API_BASE_URL,
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
   (error) => Promise.reject(error),
);

// // Response interceptor to handle errors and fallback to backend
// AxiosInstance.interceptors.response.use(
//    (response) => response,
//    async (error) => {
//       const originalRequest = error.config;

//       // If localhost fails (connection refused, network error, 503), try backend API
//       if (
//          !originalRequest._retry &&
//          (error.code === "ERR_NETWORK" ||
//             error.code === "ECONNREFUSED" ||
//             error.message?.includes("ECONNREFUSED") ||
//             error.response?.status === 503)
//       ) {
//          originalRequest._retry = true;
//          originalRequest.baseURL =
//             "https://tpp-backend-9xoz.onrender.com/api/v1";
//          return AxiosInstance(originalRequest);
//       }

//       return Promise.reject(error);
//    },
// );

export default AxiosInstance;
