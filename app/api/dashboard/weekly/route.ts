export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const userId = requireAuth(req);

        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const entries = await prisma.timeEntry.findMany({
            where: {
                task: { userId },
                start: {
                    gte: startOfWeek,
                },
                NOT: { duration: null },
            },
        });

        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        const result = days.map((day) => ({
            day,
            seconds: 0,
        }));

        entries.forEach((e) => {
            const dayIndex = new Date(e.start).getDay();
            result[dayIndex].seconds += e.duration || 0;
        });

        return NextResponse.json(result);
    } catch {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }
}
