import { NextResponse } from "next/server";

// Force static export for Tauri/Capacitor builds
export const dynamic = 'force-static'

export async function GET() {
  return NextResponse.json({ message: "Hello, world!" });
}