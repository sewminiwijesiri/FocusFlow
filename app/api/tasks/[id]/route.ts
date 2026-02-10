export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromToken } from "@/lib/auth";

type Params = {
    params: Promise<{
        id: string;
    }>;
};

// GET SINGLE TASK (optional but useful)
export async function GET(req: Request, { params }: Params) {
    const { id } = await params;
    const userId = getUserIdFromToken(req);
    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const task = await prisma.task.findFirst({
        where: {
            id,
            userId,
        },
    });

    if (!task) {
        return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(task);
}

// UPDATE TASK
export async function PUT(req: Request, { params }: Params) {
    const { id } = await params;
    const userId = getUserIdFromToken(req);
    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { title, description, completed } = await req.json();

    // Fetch current state to determine if completedAt should be updated
    const currentTask = await prisma.task.findFirst({
        where: { id, userId }
    });

    if (!currentTask) {
        return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    let completedAt = currentTask.completedAt;
    if (completed === true && !currentTask.completed) {
        completedAt = new Date();
    } else if (completed === false) {
        completedAt = null;
    }

    await prisma.task.update({
        where: { id },
        data: {
            title,
            description,
            completed,
            completedAt,
        },
    });

    return NextResponse.json({ message: "Task updated successfully" });
}

// DELETE TASK
export async function DELETE(req: Request, { params }: Params) {
    const { id } = await params;
    const userId = getUserIdFromToken(req);
    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const task = await prisma.task.deleteMany({
            where: {
                id,
                userId,
            },
        });

        if (task.count === 0) {
            return NextResponse.json({ message: "Task not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error("Error deleting task:", error);
        return NextResponse.json(
            { message: "Failed to delete task" },
            { status: 500 }
        );
    }
}
