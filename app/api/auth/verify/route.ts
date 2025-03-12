import axios from "axios";
import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/constants/constants";

// Verify if the user is authenticated and return the user data
export async function GET(req: Request) {
  try {
    const cookie = req.headers.get("cookie") || "";
    const response = await axios.get(`${BACKEND_URL}/auth/verify`, {
      headers: { Cookie: cookie },
      withCredentials: true,
    });

    console.log("Response from verify:", response.data);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error en API de verify:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
