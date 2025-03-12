"use server";

import { z } from "zod";
import axios from "axios";
import { LoginFormValues, Plans } from "@/types/types";
import { PlansSchema } from "@/schemas/schemas";
import { BACKEND_URL, PLANS_API_URL } from "@/constants/constants";

// --------- GUIDES (PLANS) --------- //

// Fetch a guide by ID
export const fetchGuideById = async (guideId: string) => {
  try {
    const { data } = await axios.get(`${PLANS_API_URL}/${guideId}`);

    if (data?.data) {
      return {
        success: true,
        message: data.message || "Guía encontrada.",
        data: data.data,
      };
    }

    return {
      success: false,
      message: "No se encontró la guía.",
    };
  } catch (error) {
    const errorMessage = axios.isAxiosError(error)
      ? error.response?.data?.message || "Error al buscar la guía."
      : "Error inesperado al buscar la guía.";

    return {
      success: false,
      message: errorMessage,
    };
  }
};

// Fetch all guides by date and assigned user ID
export const fetchAllGuides = async (
  date: string,
  assignedUserId: string
): Promise<{ data?: any; message: string; success: boolean }> => {
  try {
    const response = await axios.get(
      `${PLANS_API_URL}?date=${date}&assignedUserId=${assignedUserId}`
    );

    return {
      success: response.data.success,
      message: response.data.message,
      data: response.data.data,
    };
  } catch (error: any) {
    console.error("Error al cargar las guías:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Error desconocido",
      data: null,
    };
  }
};

// Save a guide into the database
export const saveGuide = async (guide: Plans) => {
  try {
    const validatedGuide = PlansSchema.parse(guide);

    const response = await axios.post(PLANS_API_URL, {
      plans: validatedGuide,
    });

    return response.data;
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Datos inválidos",
        errors: error.errors,
      };
    }

    return {
      success: false,
      message: error.response?.data?.message || "Error en el servidor",
    };
  }
};

// --------- AUTHENTICATION --------- //

// Login
export async function login(values: LoginFormValues) {
  try {
    const response = await axios.post(`${BACKEND_URL}/auth/login`, values, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    return {
      data: response.data,
      headers: response.headers,
      status: response.status,
    };
  } catch (error: any) {
    console.error("Error en loginAction:", error);

    if (error.response && error.response.data) {
      return {
        data: error.response.data,
        headers: error.response.headers,
        status: error.response.status,
      };
    }

    throw error;
  }
}
