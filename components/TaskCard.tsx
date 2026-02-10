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
        <div className={`glass-card p-5 flex justify-between items-center group transition-all border-l-4 ${task.completed ? "border-l-secondary/50 opacity-80" : "border-l-primary/50"} hover:bg-white/[0.04] relative overflow-hidden`}>
            <div className="flex items-center gap-4 z-10">
                <button
                    onClick={toggleComplete}
                    disabled={loading}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${task.completed ? "bg-secondary border-secondary" : "border-muted/50 hover:border-primary"
                        }`}
                >
                    {task.completed && (
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </button>
                <div className="flex-1">
                    <h3 className={`font-bold text-lg leading-tight transition-all ${task.completed ? "text-muted line-through" : "text-white"}`}>
                        {task.title}
                    </h3>
                    {task.description && (
                        <p className={`text-sm mt-1 line-clamp-1 ${task.completed ? "text-muted/60" : "text-muted"}`}>
                            {task.description}
                        </p>
                    )}
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest font-bold ${task.completed ? "bg-secondary/20 text-secondary" : "bg-primary/20 text-primary"}`}>
                            {task.completed ? "Done" : "Focusing"}
                        </span>

                        {/* Show running timer */}
                        {task.activeTimerStart && (
                            <div className="flex items-center gap-1.5 text-accent">
                                <svg className="w-3.5 h-3.5 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z" />
                                </svg>
                                <span className="text-xs font-mono font-bold">{formatTime(elapsedTime)}</span>
                            </div>
                        )}

                        {/* Show total time spent */}
                        {!task.activeTimerStart && task.totalTimeSpent && task.totalTimeSpent > 0 && (
                            <div className="flex items-center gap-1.5 text-muted">
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z" />
                                </svg>
                                <span className="text-xs font-mono">{formatTime(task.totalTimeSpent)}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 z-10">
                <TimerButton taskId={task.id} refresh={refresh} />

                <div className="flex items-center border-l border-white/10 ml-2 pl-3 gap-2">
                    <button
                        onClick={() => onEdit(task)}
                        className="p-2 rounded-lg hover:bg-white/5 text-muted hover:text-white transition-all"
                        title="Edit Task"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button
                        onClick={deleteTask}
                        disabled={loading}
                        className="p-2 rounded-lg hover:bg-accent/10 text-muted hover:text-accent transition-all"
                        title="Delete Task"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Subtle background glow when focusing */}
            {!task.completed && (
                <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            )}
        </div>
    );
}

