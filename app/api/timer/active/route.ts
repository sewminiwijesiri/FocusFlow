export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        requireAuth(req);

        const { searchParams } = new URL(req.url);
        const taskId = searchParams.get("taskId");

        const entry = await prisma.timeEntry.findFirst({
            where: {
                taskId: taskId!,
                end: null,
            },
        });

        return NextResponse.json(entry);
    } catch {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }
}
