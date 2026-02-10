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
    });

    return NextResponse.json(tasks);
}
