import { login } from "@/actions/actions";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { success: false, message: "Method Not Allowed" },
      { status: 405 }
    );
  }

  try {
    const body = await req.json();
    const result = await login(body);

    if (!result.data.success) {
      const res = NextResponse.json(
        {
          success: false,
          message: result.data.message || "Error al iniciar sesión",
        },
        {
          status: result.status || 400,
        }
      );

      if (result.headers && result.headers["set-cookie"]) {
        res.headers.set("Set-Cookie", result.headers["set-cookie"].join(", "));
      }

      return res;
    }

    const res = NextResponse.json({
      success: true,
      data: result.data,
    });

    if (result.headers && result.headers["set-cookie"]) {
      res.headers.set("Set-Cookie", result.headers["set-cookie"].join(", "));
    }

    return res;
  } catch (error) {
    console.error("Error en API de login:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
