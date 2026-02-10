"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import TaskCard from "@/components/TaskCard";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function TasksPage() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(true);

    async function load() {
        try {
            const data = await api("/api/tasks");
            setTasks(data);
        } catch (err) {
            console.error("Failed to load tasks", err);
        } finally {
            setLoading(false);
        }
    }

    async function create(e: React.FormEvent) {
        e.preventDefault();
        if (!title.trim()) return;

        try {
            await api("/api/tasks", {
                method: "POST",
                body: JSON.stringify({ title }),
            });
            setTitle("");
            load();
        } catch (err) {
            console.error("Failed to create task", err);
        }
    }

    useEffect(() => { load(); }, []);

    return (
        <ProtectedRoute>
            <main className="max-w-4xl mx-auto p-6 md:p-10 animate-fade-in">
                <header className="flex justify-between items-end mb-12">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gradient mb-2">My Tasks</h1>
                        <p className="text-muted">Stay focused and track your progress.</p>
                    </div>
                </header>

                <div className="glass-card p-6 mb-10 overflow-hidden relative">
                    <form onSubmit={create} className="flex gap-4">
                        <input
                            className="glass-input flex-1"
                            placeholder="What are you working on today?"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />
                        <button type="submit" className="btn-primary flex items-center gap-2">
                            <span>Add Task</span>
                        </button>
                    </form>
                </div>

                <div className="space-y-4">
                    {loading ? (
                        <div className="flex justify-center p-12">
                            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : tasks.length === 0 ? (
                        <div className="text-center py-20 glass-card">
                            <p className="text-muted text-lg mb-4">No tasks yet. Ready to start something new?</p>
                        </div>
                    ) : (
                        tasks.map((t, i) => (
                            <div key={t.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                                <TaskCard task={t} refresh={load} />
                            </div>
                        ))
                    )}
                </div>
            </main>
        </ProtectedRoute>
    );
}

