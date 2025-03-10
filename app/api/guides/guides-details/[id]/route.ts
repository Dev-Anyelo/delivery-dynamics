import { NextResponse } from "next/server";
import { fetchGuideById } from "@/actions/actions";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "ID must not be null" }, { status: 400 });
  }

  console.log(id);
  const guide = await fetchGuideById(id);

  if (!guide) {
    return NextResponse.json({ error: "Guide not found" }, { status: 404 });
  }

  return NextResponse.json(guide);
}
