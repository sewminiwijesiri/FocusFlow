export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const userId = requireAuth(req);

        // Total tasks
        const totalTasks = await prisma.task.count({
            where: { userId },
        });

        // Completed tasks
        const completedTasks = await prisma.task.count({
            where: {
                userId,
                completed: true,
            },
        });

        // Total tracked time
        const totalTime = await prisma.timeEntry.aggregate({
            _sum: { duration: true },
            where: {
                task: { userId },
                NOT: { duration: null },
            },
        });

        // Today's time
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayTime = await prisma.timeEntry.aggregate({
            _sum: { duration: true },
            where: {
                task: { userId },
                start: {
                    gte: todayStart,
                },
                NOT: { duration: null },
            },
        });

        return NextResponse.json({
            totalTasks,
            completedTasks,
            totalTimeSeconds: totalTime._sum.duration || 0,
            todayTimeSeconds: todayTime._sum.duration || 0,
        });
    } catch {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }
}
