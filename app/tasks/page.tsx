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
    const [sortBy, setSortBy] = useState<"createdAt" | "timeSpent" | "status">("createdAt");
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
                case "status":
                    const aStatus = a.completed ? 1 : 0;
                    const bStatus = b.completed ? 1 : 0;
                    comparison = aStatus - bStatus;
                    break;
            }

            return sortOrder === "asc" ? comparison : -comparison;
        });

    return (
        <ProtectedRoute>
            <main className="max-w-4xl mx-auto px-4 py-8 md:py-12 animate-fade-in min-h-screen">
                {/* Header */}
                <header className="mb-12">
                    <div className="flex items-end justify-between mb-8">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">My Tasks</h1>
                            <p className="text-gray-500 text-sm">Stay focused and organized</p>
                        </div>
                        <button
                            onClick={() => setIsCreateOpen(!isCreateOpen)}
                            className="btn-primary flex items-center gap-2 text-sm"
                        >
                            <svg className={`w-4 h-4 transition-transform duration-200 ${isCreateOpen ? "rotate-45" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span>{isCreateOpen ? "Cancel" : "New"}</span>
                        </button>
                    </div>

                    {/* Controls Bar */}
                    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-9 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        {/* Filter & Sort */}
                        <div className="flex gap-2 items-center">
                            {/* Filter Pills */}
                            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setFilterStatus("all")}
                                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${filterStatus === "all"
                                        ? "bg-white text-gray-900 shadow-sm"
                                        : "text-gray-600 hover:text-gray-900"
                                        }`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => setFilterStatus("active")}
                                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${filterStatus === "active"
                                        ? "bg-white text-gray-900 shadow-sm"
                                        : "text-gray-600 hover:text-gray-900"
                                        }`}
                                >
                                    Active
                                </button>
                                <button
                                    onClick={() => setFilterStatus("completed")}
                                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${filterStatus === "completed"
                                        ? "bg-white text-gray-900 shadow-sm"
                                        : "text-gray-600 hover:text-gray-900"
                                        }`}
                                >
                                    Done
                                </button>
                            </div>

                            {/* Sort Dropdown */}
                            <div className="flex gap-1 items-center bg-gray-100 rounded-lg p-1">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as "createdAt" | "timeSpent" | "status")}
                                    className="pl-2 pr-1 py-1 text-xs font-medium bg-transparent border-0 focus:outline-none focus:ring-0 cursor-pointer text-gray-700 hover:text-gray-900"
                                >
                                    <option value="timeSpent">Time</option>
                                    <option value="createdAt">Date</option>
                                    <option value="status">Status</option>
                                </select>
                                <button
                                    onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
                                    className="p-1 rounded-md hover:bg-white hover:shadow-sm text-gray-600 transition-all"
                                    title={sortOrder === "asc" ? "Ascending" : "Descending"}
                                >
                                    {sortOrder === "asc" ? (
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                                        </svg>
                                    ) : (
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h5m1 0v12m0 0l-4-4m4 4l4-4" />
                                        </svg>
                                    )}
                                </button>
                            </div>

                            {/* Export Button */}
                            <button
                                onClick={handleExportCSV}
                                disabled={tasks.length === 0}
                                className="px-3 py-2 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                                title="Export tasks to CSV"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span>Export</span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Create Task Form */}
                {isCreateOpen && (
                    <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 animate-fade-in">
                        <form onSubmit={create} className="space-y-4">
                            <div>
                                <input
                                    className="w-full px-0 py-2 text-lg font-medium border-0 border-b border-gray-200 focus:outline-none focus:border-primary transition-colors placeholder:text-gray-400"
                                    placeholder="Task title"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div>
                                <textarea
                                    className="w-full px-0 py-2 text-sm border-0 resize-none focus:outline-none placeholder:text-gray-400"
                                    placeholder="Add description (optional)"
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    rows={2}
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => setIsCreateOpen(false)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">Cancel</button>
                                <button type="submit" className="btn-primary text-sm">Create</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Tasks List */}
                <div className="space-y-3">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3">
                            <div className="w-8 h-8 border-3 border-gray-200 border-t-primary rounded-full animate-spin"></div>
                            <p className="text-gray-400 text-sm">Loading...</p>
                        </div>
                    ) : filteredAndSortedTasks.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                {searchQuery || filterStatus !== "all" ? (
                                    <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                ) : (
                                    <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                )}
                            </div>
                            {searchQuery || filterStatus !== "all" ? (
                                <>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">No tasks found</h3>
                                    <p className="text-gray-500 text-sm mb-4">Try adjusting your filters</p>
                                    <button
                                        onClick={() => {
                                            setSearchQuery("");
                                            setFilterStatus("all");
                                        }}
                                        className="text-sm text-primary hover:text-primary-hover font-medium"
                                    >
                                        Clear filters
                                    </button>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">No tasks yet</h3>
                                    <p className="text-gray-500 text-sm mb-4">Create your first task to get started</p>
                                    <button onClick={() => setIsCreateOpen(true)} className="btn-primary text-sm">Create Task</button>
                                </>
                            )}
                        </div>
                    ) : (
                        <>
                            {filteredAndSortedTasks.map((t: Task, i: number) => (
                                <div key={t.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.02}s` }}>
                                    <TaskCard task={t} refresh={load} onEdit={setEditingTask} />
                                </div>
                            ))}
                        </>
                    )}
                </div>

                {/* Edit Modal */}
                {editingTask && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
                        <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Edit Task</h2>
                                <button onClick={() => setEditingTask(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <form onSubmit={updateTask} className="space-y-4">
                                <div>
                                    <input
                                        className="w-full px-0 py-2 text-lg font-medium border-0 border-b border-gray-200 focus:outline-none focus:border-primary transition-colors"
                                        value={editingTask.title}
                                        onChange={e => setEditingTask({ ...editingTask, title: e.target.value })}
                                        placeholder="Task title"
                                    />
                                </div>
                                <div>
                                    <textarea
                                        className="w-full px-0 py-2 text-sm border-0 resize-none focus:outline-none placeholder:text-gray-400"
                                        value={editingTask.description || ""}
                                        onChange={e => setEditingTask({ ...editingTask, description: e.target.value })}
                                        placeholder="Description"
                                        rows={3}
                                    />
                                </div>
                                <div className="flex justify-end gap-2 pt-4">
                                    <button type="button" onClick={() => setEditingTask(null)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">Cancel</button>
                                    <button type="submit" className="btn-primary text-sm">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </ProtectedRoute>
    );
}

