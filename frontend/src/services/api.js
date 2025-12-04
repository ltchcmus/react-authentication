import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:9999",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // required to send and receive cookies
});

// Reference to get/set access token from AuthContext
let getAccessTokenFn = null;
let setAccessTokenFn = null;

export const setTokenHandlers = (getToken, setToken) => {
  getAccessTokenFn = getToken;
  setAccessTokenFn = setToken;
};

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    if (getAccessTokenFn) {
      const token = getAccessTokenFn();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors and unwrap HttpResponse
api.interceptors.response.use(
  (response) => {
    // Backend returns HttpResponse with { code, message, data } structure
    // Extract the actual data for easier consumption
    if (
      response.data &&
      typeof response.data === "object" &&
      "data" in response.data
    ) {
      // Check if response contains a new accessToken (from token refresh)
      if (
        response.data.data &&
        response.data.data.accessToken &&
        setAccessTokenFn
      ) {
        setAccessTokenFn(response.data.data.accessToken);
      }

      return {
        ...response,
        data: response.data.data,
        message: response.data.message,
        code: response.data.code,
      };
    }
    return response;
  },
  (error) => {
    // Handle 401 errors - trigger logout ONLY for protected endpoints
    // Don't logout if it's login/register endpoint failing
    const isAuthEndpoint =
      error.config?.url?.includes("/login") ||
      error.config?.url?.includes("/register");

    if (error.response?.status === 401 && !isAuthEndpoint) {
      // Clear tokens and trigger logout
      if (setAccessTokenFn) {
        setAccessTokenFn(null);
      }
      window.dispatchEvent(new Event("logout"));
      return Promise.reject(error);
    }

    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      // Use the message from backend directly
      const backendMessage = error.response.data?.message;

      if (backendMessage) {
        error.message = backendMessage;
      }

      // Handle validation errors if they exist
      if (
        error.response.data?.data &&
        Array.isArray(error.response.data.data)
      ) {
        const validationErrors = error.response.data.data
          .map((err) =>
            err.constraints ? Object.values(err.constraints).join(", ") : ""
          )
          .filter(Boolean)
          .join("; ");
        if (validationErrors) {
          error.validationErrors = validationErrors;
        }
      }
    } else if (error.request) {
      // Request made but no response received
      error.message = "Network error. Please check your connection.";
    }
    return Promise.reject(error);
  }
);

// API functions
export const registerUser = async (userData) => {
  const response = await api.post("/api/v1/users/register", userData, {
    headers: {
      "x-api-key": import.meta.env.VITE_X_API_KEY,
    },
  });
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post("/api/v1/users/login", credentials, {
    headers: {
      "x-api-key": import.meta.env.VITE_X_API_KEY,
    },
  });
  // Access token is already in response.data.accessToken
  // Will be stored by caller (Login component)
  return response.data;
};

export const logoutUser = async () => {
  try {
    await api.post(
      "/api/v1/users/logout",
      {},
      {
        headers: {
          "x-api-key": import.meta.env.VITE_X_API_KEY,
        },
      }
    );
  } catch (err) {
    console.error("Logout error:", err);
  } finally {
    if (setAccessTokenFn) {
      setAccessTokenFn(null);
    }
  }
};

export const getMe = async () => {
  const response = await api.get("/api/v1/users/me", {
    headers: {
      "x-api-key": import.meta.env.VITE_X_API_KEY,
    },
  });
  return response.data;
};

export const updateProfile = async (updates) => {
  const response = await api.patch("/api/v1/users/me", updates, {
    headers: {
      "x-api-key": import.meta.env.VITE_X_API_KEY,
    },
  });
  return response.data;
};

export default api;
