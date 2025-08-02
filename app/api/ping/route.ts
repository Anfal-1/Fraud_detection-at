import { NextResponse } from "next/server"

export async function GET() {
  const timestamp = Date.now()

  return NextResponse.json(
    {
      message: "pong",
      timestamp,
      server: "vercel",
    },
    {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    },
  )
}

export async function POST() {
  const timestamp = Date.now()

  return NextResponse.json(
    {
      message: "pong",
      timestamp,
      server: "vercel",
    },
    {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    },
  )
}
