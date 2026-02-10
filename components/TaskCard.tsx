"use client";
import React, { useState } from "react";
import TimerButton from "./TimerButton";
import { api } from "@/lib/api";

interface Task {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    activeTimerStart?: string | null;
    totalTimeSpent?: number;
    createdAt: string;
    completedAt?: string | null;
}

interface TaskCardProps {
    task: Task;
    refresh: () => void;
    onEdit: (task: Task) => void;
}

export default function TaskCard({ task, refresh, onEdit }: TaskCardProps) {
    const [loading, setLoading] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);

    // Update elapsed time for running timer
    React.useEffect(() => {
        if (task.activeTimerStart) {
            const interval = setInterval(() => {
                const start = new Date(task.activeTimerStart!).getTime();
                const now = Date.now();
                const elapsed = Math.floor((now - start) / 1000);
                setElapsedTime(elapsed);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [task.activeTimerStart]);

    // Format time in HH:MM:SS or MM:SS
    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        if (hrs > 0) {
            return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    async function toggleComplete() {
        setLoading(true);
        try {
            await api(`/api/tasks/${task.id}`, {
                method: "PUT",
                body: JSON.stringify({ completed: !task.completed }),
            });
            refresh();
        } catch (err) {
            console.error("Failed to toggle task completion", err);
        } finally {
            setLoading(false);
        }
    }

    async function deleteTask() {
        if (!confirm("Are you sure you want to delete this task?")) return;
        setLoading(true);
        try {
            await api(`/api/tasks/${task.id}`, {
                method: "DELETE",
            });
            refresh();
        } catch (err) {
            console.error("Failed to delete task", err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={`bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-start gap-4 transition-all duration-200 hover:border-gray-300 hover:shadow-sm group ${task.completed ? "opacity-60" : ""}`}>
            <div className="flex items-start gap-3 flex-1 min-w-0">
                <button
                    onClick={toggleComplete}
                    disabled={loading}
                    className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 mt-0.5 ${task.completed
                        ? "bg-primary border-primary"
                        : "border-gray-300 hover:border-primary"
                        }`}
                >
                    {task.completed && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </button>

                <div className="flex-1 min-w-0">
                    <h3 className={`font-medium text-sm leading-snug transition-all ${task.completed ? "text-gray-500 line-through" : "text-gray-900"
                        }`}>
                        {task.title}
                    </h3>
                    {task.description && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {task.description}
                        </p>
                    )}

                    <div className="flex items-center gap-2 mt-2">
                        {/* Show running timer */}
                        {task.activeTimerStart && (
                            <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 border border-blue-200">
                                <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z" />
                                </svg>
                                <span className="font-mono font-medium text-blue-600 text-xs">{formatTime(elapsedTime)}</span>
                            </div>
                        )}

                        {/* Show total time spent */}
                        {!task.activeTimerStart && task.totalTimeSpent && task.totalTimeSpent > 0 && (
                            <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100">
                                <svg className="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z" />
                                </svg>
                                <span className="font-mono text-gray-600 text-xs">{formatTime(task.totalTimeSpent)}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
                <TimerButton taskId={task.id} refresh={refresh} elapsedTime={elapsedTime} />

                <button
                    onClick={() => onEdit(task)}
                    className="p-2 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all"
                    title="Edit Task"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </button>
                <button
                    onClick={deleteTask}
                    disabled={loading}
                    className="p-2 rounded hover:bg-red-50 text-gray-400 hover:text-red-600 transition-all"
                    title="Delete Task"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

