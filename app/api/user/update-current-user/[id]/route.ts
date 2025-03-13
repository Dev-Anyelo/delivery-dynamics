import axios from "axios";
import { NextResponse } from "next/server";
import { UserSchema } from "@/schemas/schemas";
import { BACKEND_URL } from "@/constants/constants";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookie = request.headers.get("cookie") || "";
    const data = await request.json();
    const updateUser = UserSchema.partial().parse(data);

    if (!updateUser.id) {
      return NextResponse.json(
        { success: false, message: "El ID del usuario es requerido" },
        { status: 400 }
      );
    }

    if (updateUser.password === "") {
      delete updateUser.password;
    }

    const response = await axios.put(
      `${BACKEND_URL}/user/${params.id}`,
      updateUser,
      {
        headers: {
          "Content-Type": "application/json",
          Cookie: cookie,
        },
        withCredentials: true,
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Error en update-current-user:", error);
    return NextResponse.json(
      { success: false, message: "Error al actualizar el usuario" },
      { status: error.response?.status || 500 }
    );
  }
}
