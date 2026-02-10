export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromToken } from "@/lib/auth";

// CREATE TASK
export async function POST(req: Request) {
    const userId = getUserIdFromToken(req);
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { title, description } = await req.json();

    const task = await prisma.task.create({
        data: {
            title,
            description,
            userId,
        },
    });

    return NextResponse.json(task);
}

// GET TASKS
export async function GET(req: Request) {
    const userId = getUserIdFromToken(req);
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const tasks = await prisma.task.findMany({
        where: { userId },
        include: {
            timeEntries: true,
        },
    });

    // Calculate total time and active timer for each task
    const tasksWithTimerData = tasks.map(task => {
        const activeTimer = task.timeEntries.find(entry => entry.end === null);
        const totalTime = task.timeEntries
            .filter(entry => entry.duration !== null)
            .reduce((sum, entry) => sum + (entry.duration || 0), 0);

        return {
            id: task.id,
            title: task.title,
            description: task.description,
            completed: task.completed,
            userId: task.userId,
            completedAt: task.completedAt,
            createdAt: task.createdAt,
            activeTimerStart: activeTimer?.start || null,
            totalTimeSpent: totalTime,
        };
    });

    return NextResponse.json(tasksWithTimerData);
}
