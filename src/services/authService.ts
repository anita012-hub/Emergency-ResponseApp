import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";

const TOKEN_KEY = "userToken";
const USER_KEY = "user";

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

export const authService = {
  // Register
  register: async (userData: RegisterData): Promise<LoginResponse> => {
  try {
    console.log("Sending data:", userData);
    console.log("Base URL:", api.defaults.baseURL);

    const response = await api.post("/auth/register", userData);

    console.log("SUCCESS:", response.data);

    const { token, user } = response.data;

    await AsyncStorage.setItem(TOKEN_KEY, token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));

    return response.data;
  } catch (error: any) {
    console.log("========== AXIOS ERROR ==========");
    console.log("message:", error.message);
    console.log("code:", error.code);
    console.log("response:", error.response?.data);
    console.log("config:", error.config);
    console.log("================================");

    throw new Error(error.response?.data?.message || error.message);
  }
},

  // Login
  login: async (
    email: string,
    password: string
  ): Promise<LoginResponse> => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      await AsyncStorage.setItem(TOKEN_KEY, token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  },

  // Logout
  logout: async (): Promise<void> => {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
  },

  // Get Logged-in User
  getCurrentUser: async () => {
    const user = await AsyncStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  // Get JWT Token
  getToken: async (): Promise<string | null> => {
    return await AsyncStorage.getItem(TOKEN_KEY);
  },
};