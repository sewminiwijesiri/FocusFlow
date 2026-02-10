export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
    try {
        requireAuth(req);

        let body;
        try {
            body = await req.json();
        } catch {
            return NextResponse.json(
                { message: "Invalid request body" },
                { status: 400 }
            );
        }

        const { taskId } = body;
        if (!taskId) {
            return NextResponse.json(
                { message: "taskId is required" },
                { status: 400 }
            );
        }

        const entry = await prisma.timeEntry.findFirst({
            where: {
                taskId,
                end: null,
            },
        });

        if (!entry) {
            return NextResponse.json(
                { message: "No active timer" },
                { status: 400 }
            );
        }

        const endTime = new Date();
        const duration = Math.floor(
            (endTime.getTime() - entry.start.getTime()) / 1000
        );

        const updated = await prisma.timeEntry.update({
            where: { id: entry.id },
            data: {
                end: endTime,
                duration,
            },
        });

        return NextResponse.json(updated);
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
