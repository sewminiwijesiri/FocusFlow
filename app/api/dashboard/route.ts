import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({ message: "Dashboard not implemented" }, { status: 501 });
}
