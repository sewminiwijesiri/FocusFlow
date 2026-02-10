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


    const task = await prisma.task.updateMany({
        where: {
            id,
            userId,
        },
        data: {
            title,
            description,
            completed,
        },
    });

    if (task.count === 0) {
        return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Task updated successfully" });
}

// DELETE TASK
export async function DELETE(req: Request, { params }: Params) {
    const { id } = await params;
    const userId = getUserIdFromToken(req);
    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

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
}
