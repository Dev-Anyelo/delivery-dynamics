import { BACKEND_URL } from "@/constants/constants";
import { UserSchema } from "@/schemas/schemas";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const validateData = UserSchema.parse(data);

    if (!validateData) {
      return NextResponse.json(
        { success: false, message: "Datos de usuario inválidos" },
        { status: 400 }
      );
    }

    const response = await axios.post(`${BACKEND_URL}/user`, validateData);

    if (response.status === 201) {
      return NextResponse.json({
        success: true,
        user: response.data.user,
        message: response.data.message || "Usuario creado correctamente",
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: response.data.message || "Error al crear el usuario",
      },
      { status: 500 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.response?.data?.message || "Error interno del servidor",
      },
      { status: 500 }
    );
  }
}
