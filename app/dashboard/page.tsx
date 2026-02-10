"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import StatCard from "@/components/StatCard";
import ActivityChart from "@/components/ActivityChart";
import PatternChart from "@/components/PatternChart";

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
                <header className="mb-12">
                    <h1 className="text-4xl font-extrabold text-gradient mb-2 tracking-tight">Focus Dashboard</h1>
                    <p className="text-muted text-lg">Your productivity, visualized.</p>
                </header>

                {loading ? (
                    <div className="flex justify-center p-20">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="glass-card p-8 group transition-all hover:bg-card/60">
                                <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
                                    <span className="p-2 bg-primary/10 rounded-lg text-primary text-sm">📅</span>
                                    <span>Recent Activity</span>
                                </h2>
                                <ActivityChart data={data?.activity || []} />
                            </div>

                            <div className="glass-card p-8 group transition-all hover:bg-card/60">
                                <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
                                    <span className="p-2 bg-secondary/10 rounded-lg text-secondary text-sm">📈</span>
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

