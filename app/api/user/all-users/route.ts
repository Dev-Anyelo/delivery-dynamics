import axios from "axios";
import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/constants/constants";

export async function GET() {
  try {
    const response = await axios.get(`${BACKEND_URL}/users`);
    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
