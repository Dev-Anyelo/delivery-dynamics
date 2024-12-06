"use server";

import * as z from "zod";
import axios from "axios";
import { RouteSchema } from "@/schemas/schemas";
import { DRIVER_API_URL, ROUTE_API_URL } from "@/constants/constants";
import { DriverResponse, RouteResponse } from "@/interfaces/interfaces";

// Buscar una ruta por ID
export const findRoute = async (routeId: number) => {
  try {
    const { data } = await axios.get(`${ROUTE_API_URL}/${routeId}`);

    if (data?.data) {
      return {
        success: true,
        message: data.message || "Ruta encontrada.",
        data: data.data,
      };
    }

    return {
      success: false,
      message: "No se encontró la ruta.",
    };
  } catch (error) {
    const errorMessage = axios.isAxiosError(error)
      ? error.response?.data?.message || "Error al buscar la ruta."
      : "Error inesperado al buscar la ruta.";

    return {
      success: false,
      message: errorMessage,
    };
  }
};

// Obtener todas las rutas
export const fetchRoutes = async (): Promise<RouteResponse> => {
  try {
    const { data } = await axios.get(ROUTE_API_URL);
    console.log("Datos recibidos:", data);

    if (!data || !data.data) {
      throw new Error("No se encontraron rutas");
    }

    return {
      routes: data.data,
      message: "Rutas cargadas con éxito",
    };
  } catch (error: any) {
    console.error("Error al cargar las rutas:", error);
    throw new Error(error.response?.data?.message || "Error desconocido");
  }
};

// Crear una nueva ruta
export const createRoute = async (data: z.infer<typeof RouteSchema>) => {
  const validation = RouteSchema.safeParse(data);

  if (!validation.success) {
    return {
      success: false,
      error: validation.error.errors.map((e) => e.message).join(", "),
    };
  }

  try {
    const { data: responseData } = await axios.post(
      ROUTE_API_URL,
      validation.data
    );

    return {
      success: true,
      message: responseData.message || "Ruta creada exitosamente.",
      data: responseData.data,
    };
  } catch (error: any) {
    const errorMessage = axios.isAxiosError(error)
      ? error.response?.data?.message ||
        "Ocurrió un error al intentar crear la ruta."
      : "Error inesperado al crear la ruta.";

    return {
      success: false,
      error: errorMessage,
    };
  }
};

// Actualizar una ruta
export const updateRoute = async (
  routeId: number,
  data: z.infer<typeof RouteSchema>
) => {
  const validation = RouteSchema.safeParse(data);

  if (!validation.success) {
    return {
      success: false,
      error: validation.error.errors.map((e) => e.message).join(", "),
    };
  }

  try {
    const { data: responseData } = await axios.put(
      `${ROUTE_API_URL}/${routeId}`,
      validation.data
    );

    return {
      success: true,
      message: responseData.message || "Ruta actualizada exitosamente.",
      data: responseData.data,
    };
  } catch (error: any) {
    const errorMessage = axios.isAxiosError(error)
      ? error.response?.data?.message ||
        "Ocurrió un error al intentar actualizar la ruta."
      : "Error inesperado al actualizar la ruta.";

    return {
      success: false,
      error: errorMessage,
    };
  }
};

// Eliminar una ruta por ID
export const deleteRoute = async (routeId: number) => {
  try {
    const { data: responseData } = await axios.delete(
      `${ROUTE_API_URL}/${routeId}`
    );
    return {
      success: true,
      message: responseData.message || "Ruta eliminada exitosamente.",
    };
  } catch (error: any) {
    const errorMessage = axios.isAxiosError(error)
      ? error.response?.data?.message || "Error al eliminar la ruta."
      : "Error inesperado al eliminar la ruta.";

    return {
      success: false,
      message: errorMessage,
    };
  }
};

// Obtener Conductores
export const getDrivers = async () => {
  try {
    const response = await axios.get(DRIVER_API_URL);
    return response.data;
  } catch (error: any) {
    const errorMessage = axios.isAxiosError(error)
      ? error.response?.data?.message || "Error al cargar los conductores."
      : "Error inesperado al cargar los conductores.";
    throw new Error(errorMessage);
  }
};
