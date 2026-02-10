export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        requireAuth(req);

        const { searchParams } = new URL(req.url);
        const taskId = searchParams.get("taskId");

        if (!taskId) {
            return NextResponse.json(
                { message: "taskId is required" },
                { status: 400 }
            );
        }

        const entry = await prisma.timeEntry.findFirst({
            where: {
                taskId: taskId,
                end: null,
            },
        });

        return NextResponse.json(entry);
    } catch (err: any) {
        if (err.message === "Unauthorized") {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
