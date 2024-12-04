"use server";

import * as z from "zod";
import axios from "axios";
import { RouteSchema } from "@/schemas/schemas";
import { RouteData } from "@/interfaces/interfaces";
import { DRIVER_API_URL, ROUTE_API_URL } from "@/constants/constants";

// Buscar una ruta por ID
export const findRoute = async (routeId: number) => {
  try {
    const response = await axios.get(`${ROUTE_API_URL}/${routeId}`);
    
    if (response.data && response.data.data) {
      return {
        success: true,
        message: response.data.message,
        data: response.data.data,
      };
    } else {
      return {
        success: false,
        message: "Error al buscar la ruta",
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Error al buscar la ruta",
    };
  }
};

// Crear una nueva ruta
export const createRoute = async (data: z.infer<typeof RouteSchema>) => {
  const validateFields = RouteSchema.safeParse(data);

  if (!validateFields.success) {
    return {
      success: false,
      error: "Los campos del formulario no son válidos.",
    };
  }

  try {
    const response = await axios.post(ROUTE_API_URL, validateFields.data);

    return {
      success: true,
      message: response.data.message,
      data: response.data.data,
    };
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      "Ocurrió un error al intentar crear la ruta.";
    return { success: false, error: errorMessage };
  }
};

// Actualizar una ruta
export const updateRoute = async (
  routeId: number,
  data: z.infer<typeof RouteSchema>
) => {
  const validateFields = RouteSchema.safeParse(data);

  if (!validateFields.success) {
    return { error: "Los campos del formulario no son válidos." };
  }

  try {
    const response = await axios.put(
      `${ROUTE_API_URL}/${routeId}`,
      validateFields.data
    );

    return {
      success: true,
      message: response.data.message,
      data: response.data.data,
    };
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      "Ocurrió un error al intentar actualizar la ruta.";
    return { error: errorMessage };
  }
};

// Eliminar una ruta por ID
export const deleteRoute = async (routeId: number) => {
  try {
    const response = await axios.delete(`${ROUTE_API_URL}/${routeId}`);
    return {
      success: true,
      message: response.data.message,
    };
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Error al eliminar la ruta";
    return { success: false, message: errorMessage };
  }
};

// Obtener todas las rutas
export const fetchRoutes = async (): Promise<{
  data: RouteData[];
  message: string;
}> => {
  try {
    const response = await axios.get(ROUTE_API_URL);
    return {
      data: response.data,
      message: "Rutas cargadas con éxito",
    };
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Error al cargar las rutas";
    throw new Error(errorMessage);
  }
};

//Obtener Conductores
export const getDrivers = async () => {
  try {
    const response = await axios.get(DRIVER_API_URL);
    return response.data;
  } catch (err) {
    throw new Error("Error al cargar los conductores." + err);
  }
};
