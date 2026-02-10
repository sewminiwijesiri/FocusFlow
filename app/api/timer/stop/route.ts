export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
    try {
        requireAuth(req);

        const { taskId } = await req.json();

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
    } catch {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }
}
