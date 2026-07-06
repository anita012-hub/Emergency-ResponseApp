// src/services/emergencyService.ts
// Mock service for Emergency Requests — Week 2 & 3 tasks.
// Stores requests in AsyncStorage so they survive app restarts.
// Week 2: submit, getById, getByUser
// Week 3: full history list, confirmation details

import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";

const TOKEN_KEY = "userToken";

export const emergencyService = {
  submitRequest: async (requestData: {
    emergencyType: string;
    notes: string;
    location: {
      label: string;
      latitude: number;
      longitude: number;
    };
  }) => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);

      const response = await api.post(
        "/emergency",
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to submit emergency request."
      );
    }
  },

  getRequestById: async (id: string) => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);

    const response = await api.get(`/emergency/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to load request."
    );
  }
},
};