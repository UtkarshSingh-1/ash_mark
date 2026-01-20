import { NextResponse } from "next/server"

// This route previously existed as an empty file, which breaks Next/TS validation
// ("not a module"). Keep a minimal handler so builds and typechecks succeed.
export async function POST() {
  return NextResponse.json(
    { error: "Not implemented" },
    { status: 501 }
  )
}
