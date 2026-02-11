"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import StatCard from "@/components/StatCard";
import ActivityChart from "@/components/ActivityChart";
import PatternChart from "@/components/PatternChart";
import TaskDistributionChart from "@/components/TaskDistributionChart";

export default function DashboardPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        api("/api/dashboard/summary")
            .then(setData)
            .catch(err => console.error("Dashboard error:", err))
            .finally(() => setLoading(false));
    }, []);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        if (h > 0) return `${h}h ${m}m`;
        return `${m}m`;
    };

    return (
        <ProtectedRoute>
            <main className="max-w-6xl mx-auto p-6 md:p-10 animate-fade-in">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">Dashboard</h1>
                    <p className="text-gray-600">Track your productivity and focus patterns</p>
                </header>

                {loading ? (
                    <div className="flex justify-center p-20">
                        <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            <StatCard
                                title="Today's Tasks"
                                value={`${data?.completedToday || 0} / ${data?.totalToday || 0}`}
                                icon="🎯"
                                color="primary"
                            />
                            <StatCard
                                title="Weekly Tasks"
                                value={`${data?.completedThisWeek || 0} / ${data?.totalThisWeek || 0}`}
                                icon="✅"
                                color="secondary"
                            />
                            <StatCard
                                title="Today Focus"
                                value={formatTime(data?.todayTimeSeconds || 0)}
                                icon="🔥"
                                color="accent"
                            />
                            <StatCard
                                title="Weekly Focus"
                                value={formatTime(data?.weekTimeSeconds || 0)}
                                icon="⏱️"
                                color="primary"
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <div className="glass-card p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                    <span className="text-lg">📊</span>
                                    <span>Task Distribution</span>
                                </h2>
                                <TaskDistributionChart
                                    completedTasks={data?.completedTasks || 0}
                                    activeTasks={(data?.totalTasks || 0) - (data?.completedTasks || 0)}
                                />
                            </div>

                            <div className="glass-card p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                    <span className="text-lg">📅</span>
                                    <span>Weekly Activity</span>
                                </h2>
                                <ActivityChart data={data?.activity || []} />
                            </div>

                            <div className="glass-card p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                    <span className="text-lg">🕐</span>
                                    <span>Focus Patterns</span>
                                </h2>
                                <PatternChart data={data?.patterns || []} />
                            </div>
                        </div>
                    </>
                )}
            </main>
        </ProtectedRoute>
    );
}

