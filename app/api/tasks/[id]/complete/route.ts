export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromToken } from "@/lib/auth";

type Params = {
    params: Promise<{
        id: string;
    }>;
};

export async function PATCH(req: Request, { params }: Params) {
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

    const updated = await prisma.task.update({
        where: { id },
        data: { completed: !task.completed },
    });

    return NextResponse.json(updated);
}
