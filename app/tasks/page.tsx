"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import TaskCard from "@/components/TaskCard";
import ProtectedRoute from "@/components/ProtectedRoute";
import { exportTasksToCSV } from "@/lib/csvExport";

interface Task {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
}

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(true);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

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
                body: JSON.stringify({ title, description }),
            });
            setTitle("");
            setDescription("");
            setIsCreateOpen(false);
            load();
        } catch (err) {
            console.error("Failed to create task", err);
        }
    }

    async function updateTask(e: React.FormEvent) {
        e.preventDefault();
        if (!editingTask || !editingTask.title.trim()) return;

        try {
            await api(`/api/tasks/${editingTask.id}`, {
                method: "PUT",
                body: JSON.stringify({
                    title: editingTask.title,
                    description: editingTask.description,
                }),
            });
            setEditingTask(null);
            load();
        } catch (err) {
            console.error("Failed to update task", err);
        }
    }

    function handleExportCSV() {
        if (tasks.length === 0) {
            alert("No tasks to export!");
            return;
        }
        exportTasksToCSV(tasks);
    }

    useEffect(() => {
        load();
    }, []);

    return (
        <ProtectedRoute>
            <main className="max-w-4xl mx-auto p-6 md:p-10 animate-fade-in min-h-screen">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gradient mb-3">My Tasks</h1>
                        <p className="text-muted text-lg">Organize your workflow and maximize focus.</p>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                        <button
                            onClick={handleExportCSV}
                            disabled={tasks.length === 0}
                            className="btn-secondary flex items-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Export tasks to CSV"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span>Export CSV</span>
                        </button>
                        <button
                            onClick={() => setIsCreateOpen(!isCreateOpen)}
                            className={`btn-primary flex items-center gap-2 group ${isCreateOpen ? "bg-accent hover:bg-accent/80" : ""}`}
                        >
                            <svg className={`w-5 h-5 transition-transform duration-300 ${isCreateOpen ? "rotate-45" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span>{isCreateOpen ? "Close Form" : "New Task"}</span>
                        </button>
                    </div>
                </header>

                {/* Create Task Form */}
                {isCreateOpen && (
                    <div className="glass-card p-8 mb-10 animate-fade-in border-t-2 border-t-primary/50 relative">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <span className="w-2 h-6 bg-primary rounded-full" />
                            Create New Task
                        </h2>
                        <form onSubmit={create} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1 ml-1">Task Title</label>
                                <input
                                    className="glass-input w-full"
                                    placeholder="e.g. Design Landing Page"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1 ml-1">Description (Optional)</label>
                                <textarea
                                    className="glass-input w-full min-h-[100px] resize-none"
                                    placeholder="Add details about your task..."
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setIsCreateOpen(false)} className="btn-secondary">Cancel</button>
                                <button type="submit" className="btn-primary">Create Task</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Tasks List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center p-20 gap-4">
                            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-muted animate-pulse">Loading your task flow...</p>
                        </div>
                    ) : tasks.length === 0 ? (
                        <div className="text-center py-24 glass-card border-dashed border-2 border-white/5">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2">No tasks found</h3>
                            <p className="text-muted text-lg mb-8 max-w-xs mx-auto">Your list is clear! Ready to start a new productive session?</p>
                            <button onClick={() => setIsCreateOpen(true)} className="btn-primary">Create Your First Task</button>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {tasks.map((t, i) => (
                                <div key={t.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                                    <TaskCard task={t} refresh={load} onEdit={setEditingTask} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Edit Modal (Simple Overlay) */}
                {editingTask && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-10 backdrop-blur-xl bg-black/60 animate-fade-in">
                        <div className="glass-card w-full max-w-lg p-8 shadow-2xl border-white/10">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">Edit Task</h2>
                                <button onClick={() => setEditingTask(null)} className="text-muted hover:text-white transition-all">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <form onSubmit={updateTask} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1 ml-1">Task Title</label>
                                    <input
                                        className="glass-input w-full"
                                        value={editingTask.title}
                                        onChange={e => setEditingTask({ ...editingTask, title: e.target.value })}
                                        placeholder="Task Title"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1 ml-1">Description</label>
                                    <textarea
                                        className="glass-input w-full min-h-[150px] resize-none"
                                        value={editingTask.description || ""}
                                        onChange={e => setEditingTask({ ...editingTask, description: e.target.value })}
                                        placeholder="Add more details..."
                                    />
                                </div>
                                <div className="flex justify-end gap-3 pt-4">
                                    <button type="button" onClick={() => setEditingTask(null)} className="btn-secondary">Cancel</button>
                                    <button type="submit" className="btn-primary">Save Changes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </ProtectedRoute>
    );
}

