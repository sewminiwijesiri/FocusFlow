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

        // Activity: Last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - today.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        // Today's Tasks: Created today OR completed today (reflects tasks handled today)
        const totalToday = await prisma.task.count({
            where: {
                userId,
                OR: [
                    { createdAt: { gte: today } },
                    { completedAt: { gte: today } }
                ]
            },
        });

        const completedToday = await prisma.task.count({
            where: {
                userId,
                completed: true,
                completedAt: { gte: today },
            },
        });

        // Weekly Tasks: Created this week OR completed this week
        const totalThisWeek = await prisma.task.count({
            where: {
                userId,
                OR: [
                    { createdAt: { gte: startOfWeek } },
                    { completedAt: { gte: startOfWeek } }
                ]
            },
        });

        const completedThisWeek = await prisma.task.count({
            where: {
                userId,
                completed: true,
                completedAt: { gte: startOfWeek },
            },
        });

        const recentEntries = await prisma.timeEntry.findMany({
            where: {
                task: { userId },
                start: { gte: sevenDaysAgo },
                NOT: { duration: null },
            },
            select: {
                start: true,
                duration: true,
            },
        });

        // Group by day for activity map
        const activityData = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            d.setHours(0, 0, 0, 0);
            const dateStr = d.toLocaleDateString('en-US', { weekday: 'short' });

            const daySeconds = recentEntries
                .filter(e => {
                    const entryDate = new Date(e.start);
                    entryDate.setHours(0, 0, 0, 0);
                    return entryDate.getTime() === d.getTime();
                })
                .reduce((sum, e) => sum + (e.duration || 0), 0);

            return { label: dateStr, seconds: daySeconds };
        });

        // Calculate week time from calendar week
        const weekEntries = await prisma.timeEntry.findMany({
            where: {
                task: { userId },
                start: { gte: startOfWeek },
                NOT: { duration: null },
            },
            select: {
                duration: true,
            },
        });
        const weekTimeSeconds = weekEntries.reduce((sum, e) => sum + (e.duration || 0), 0);

        // Focus Patterns: Group by hour of day
        // We'll use all-time data or maybe last 30 days for better patterns
        const allEntries = await prisma.timeEntry.findMany({
            where: {
                task: { userId },
                NOT: { duration: null },
            },
            select: {
                start: true,
                duration: true,
            },
        });

        const hourPatterns = Array.from({ length: 24 }, (_, hour) => {
            const hourSeconds = allEntries
                .filter(e => new Date(e.start).getHours() === hour)
                .reduce((sum, e) => sum + (e.duration || 0), 0);
            return { hour, seconds: hourSeconds };
        });

        return NextResponse.json({
            totalTasks,
            completedTasks,
            totalToday,
            completedToday,
            totalThisWeek,
            completedThisWeek,
            totalTimeSeconds: totalTime._sum.duration || 0,
            todayTimeSeconds: activityData[6]?.seconds || 0,
            weekTimeSeconds,
            activity: activityData,
            patterns: hourPatterns,
        });
    } catch (error) {
        console.error("Dashboard API Error:", error);
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }
}
