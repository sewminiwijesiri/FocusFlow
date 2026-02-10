"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import StatCard from "@/components/StatCard";

export default function DashboardPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api("/api/dashboard/summary")
            .then(setData)
            .finally(() => setLoading(false));
    }, []);

    return (
        <ProtectedRoute>
            <main className="max-w-6xl mx-auto p-6 md:p-10 animate-fade-in">
                <header className="mb-12">
                    <h1 className="text-4xl font-extrabold text-gradient mb-2">Dashboard</h1>
                    <p className="text-muted">Welcome back! Here&apos;s an overview of your productivity.</p>
                </header>

                {loading ? (
                    <div className="flex justify-center p-20">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            title="Total Tasks"
                            value={data?.totalTasks || 0}
                            icon="📋"
                            color="primary"
                        />
                        <StatCard
                            title="Completed"
                            value={data?.completedTasks || 0}
                            icon="✅"
                            color="secondary"
                        />
                        <StatCard
                            title="Focus Time"
                            value={`${Math.floor((data?.totalTimeSeconds || 0) / 60)}m`}
                            icon="⏱️"
                            color="accent"
                        />
                        <StatCard
                            title="Today Focus"
                            value={`${Math.floor((data?.todayTimeSeconds || 0) / 60)}m`}
                            icon="🔥"
                            color="primary"
                        />
                    </div>
                )}

                <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="glass-card p-8 group">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span>Recent Activity</span>
                        </h2>
                        <div className="h-40 flex items-center justify-center text-muted border border-dashed border-white/10 rounded-xl group-hover:border-primary/30 transition-colors">
                            Activity visualization coming soon...
                        </div>
                    </div>

                    <div className="glass-card p-8 group">
                        <h2 className="text-xl font-bold mb-4">Focus Patterns</h2>
                        <div className="h-40 flex items-center justify-center text-muted border border-dashed border-white/10 rounded-xl group-hover:border-secondary/30 transition-colors">
                            Pattern analysis coming soon...
                        </div>
                    </div>
                </div>
            </main>
        </ProtectedRoute>
    );
}

