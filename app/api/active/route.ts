import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({ message: "Active tasks not implemented" }, { status: 501 });
}
