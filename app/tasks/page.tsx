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
    createdAt: string;
    completedAt?: string | null;
    totalTimeSpent?: number;
    activeTimerStart?: string | null;
}

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(true);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | "active" | "completed">("all");
    const [sortBy, setSortBy] = useState<"createdAt" | "timeSpent" | "title">("createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

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

    // Filter and sort tasks
    const filteredAndSortedTasks = tasks
        .filter(task => {
            // Search filter
            const matchesSearch = searchQuery.trim() === "" ||
                task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

            // Status filter
            const matchesStatus =
                filterStatus === "all" ||
                (filterStatus === "active" && !task.completed) ||
                (filterStatus === "completed" && task.completed);

            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            let comparison = 0;

            switch (sortBy) {
                case "createdAt":
                    comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                    break;
                case "timeSpent":
                    const aTime = a.totalTimeSpent || 0;
                    const bTime = b.totalTimeSpent || 0;
                    comparison = aTime - bTime;
                    break;
                case "title":
                    comparison = a.title.localeCompare(b.title);
                    break;
            }

            return sortOrder === "asc" ? comparison : -comparison;
        });

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

                {/* Search and Filter Section */}
                <div className="glass-card p-6 mb-8 space-y-4">
                    {/* Search Bar */}
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search tasks by title or description..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="glass-input w-full pl-12 pr-12"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-all"
                                title="Clear search"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted mr-2">Filter:</span>
                        <button
                            onClick={() => setFilterStatus("all")}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filterStatus === "all"
                                ? "bg-primary text-white shadow-lg shadow-primary/30"
                                : "bg-white/5 text-muted hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            All Tasks
                            <span className="ml-2 text-xs opacity-70">({tasks.length})</span>
                        </button>
                        <button
                            onClick={() => setFilterStatus("active")}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filterStatus === "active"
                                ? "bg-primary text-white shadow-lg shadow-primary/30"
                                : "bg-white/5 text-muted hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            Active
                            <span className="ml-2 text-xs opacity-70">({tasks.filter(t => !t.completed).length})</span>
                        </button>
                        <button
                            onClick={() => setFilterStatus("completed")}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filterStatus === "completed"
                                ? "bg-secondary text-white shadow-lg shadow-secondary/30"
                                : "bg-white/5 text-muted hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            Completed
                            <span className="ml-2 text-xs opacity-70">({tasks.filter(t => t.completed).length})</span>
                        </button>
                    </div>

                    {/* Sort Controls */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted mr-2">Sort By:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as "createdAt" | "timeSpent" | "title")}
                            className="glass-input px-4 py-2 text-sm font-semibold cursor-pointer hover:bg-white/10 transition-all"
                        >
                            <option value="createdAt">📅 Date Created</option>
                            <option value="timeSpent">⏱️ Time Spent</option>
                            <option value="title">🔤 Title</option>
                        </select>
                        <button
                            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                            className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-muted hover:text-white transition-all flex items-center gap-2"
                            title={`Sort ${sortOrder === "asc" ? "ascending" : "descending"}`}
                        >
                            {sortOrder === "desc" ? (
                                <>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                    <span className="text-xs font-semibold">Desc</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                    </svg>
                                    <span className="text-xs font-semibold">Asc</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Search Results Info */}
                    {(searchQuery || filterStatus !== "all") && (
                        <div className="flex items-center justify-between pt-2 border-t border-white/5">
                            <p className="text-sm text-muted">
                                Showing <span className="text-white font-bold">{filteredAndSortedTasks.length}</span> of <span className="text-white font-bold">{tasks.length}</span> tasks
                            </p>
                            {(searchQuery || filterStatus !== "all") && (
                                <button
                                    onClick={() => {
                                        setSearchQuery("");
                                        setFilterStatus("all");
                                    }}
                                    className="text-xs text-accent hover:text-accent/80 font-semibold transition-all"
                                >
                                    Clear all filters
                                </button>
                            )}
                        </div>
                    )}
                </div>

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
                    ) : filteredAndSortedTasks.length === 0 ? (
                        <div className="text-center py-24 glass-card border-dashed border-2 border-white/5">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                {searchQuery || filterStatus !== "all" ? (
                                    <svg className="w-8 h-8 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                ) : (
                                    <svg className="w-8 h-8 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                )}
                            </div>
                            {searchQuery || filterStatus !== "all" ? (
                                <>
                                    <h3 className="text-xl font-bold mb-2">No tasks found</h3>
                                    <p className="text-muted text-lg mb-8 max-w-xs mx-auto">
                                        No tasks match your current filters. Try adjusting your search or filters.
                                    </p>
                                    <button
                                        onClick={() => {
                                            setSearchQuery("");
                                            setFilterStatus("all");
                                        }}
                                        className="btn-secondary"
                                    >
                                        Clear Filters
                                    </button>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-xl font-bold mb-2">No tasks found</h3>
                                    <p className="text-muted text-lg mb-8 max-w-xs mx-auto">Your list is clear! Ready to start a new productive session?</p>
                                    <button onClick={() => setIsCreateOpen(true)} className="btn-primary">Create Your First Task</button>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {filteredAndSortedTasks.map((t: Task, i: number) => (
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

