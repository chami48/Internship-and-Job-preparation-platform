import { writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data = await req.formData();
  const file: File | null = data.get("file") as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const fileName = Date.now() + "-" + file.name;

  const uploadPath = path.join(process.cwd(), "public/uploads", fileName);

  await writeFile(uploadPath, buffer);

  return NextResponse.json({
    success: true,
    path: "/uploads/" + fileName,
  });
}