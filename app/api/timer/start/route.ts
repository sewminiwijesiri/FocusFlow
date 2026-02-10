export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const userId = requireAuth(req);

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
