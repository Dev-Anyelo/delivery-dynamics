import axios from "axios";
import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/constants/constants";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const userID = params.id;

    if (!userID) {
      return NextResponse.json(
        { error: true, message: "ID del usuario no proporcionado o inválido" },
        { status: 400 }
      );
    }

    await axios.delete(`${BACKEND_URL}/user/${userID}`);

    return NextResponse.json({
      success: true,
      message: "Usuario eliminado correctamente",
    });
  } catch (error) {
    return NextResponse.json(error);
  }
}
