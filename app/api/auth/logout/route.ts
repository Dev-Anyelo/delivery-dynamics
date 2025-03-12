import { BACKEND_URL } from "@/constants/constants";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/auth/logout`,
      {},
      {
        withCredentials: true,
      }
    );

    const res = NextResponse.json(response.data);

    if (response.headers["set-cookie"]) {
      res.headers.set("Set-Cookie", response.headers["set-cookie"].join(", "));
    }

    return res;
  } catch (error) {
    console.error("Error en API de logout:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
