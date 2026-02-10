export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        requireAuth(req);

        const { searchParams } = new URL(req.url);
        const taskId = searchParams.get("taskId");

        const entries = await prisma.timeEntry.findMany({
            where: {
                taskId: taskId!,
                NOT: { duration: null },
            },
        });

        const totalSeconds = entries.reduce(
            (sum, e) => sum + (e.duration || 0),
            0
        );

        return NextResponse.json({
            taskId,
            totalSeconds,
            totalMinutes: Math.floor(totalSeconds / 60),
            totalHours: (totalSeconds / 3600).toFixed(2),
        });
    } catch {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }
}
