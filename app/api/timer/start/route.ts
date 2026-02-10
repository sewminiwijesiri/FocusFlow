export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        requireAuth(req);

        const { taskId } = await req.json();

        // Check if timer already running
        const active = await prisma.timeEntry.findFirst({
            where: {
                taskId,
                end: null,
            },
        });

        if (active) {
            return NextResponse.json(
                { message: "Timer already running" },
                { status: 400 }
            );
        }

        const entry = await prisma.timeEntry.create({
            data: {
                taskId,
                start: new Date(),
            },
        });

        return NextResponse.json(entry);
    } catch {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }
}
