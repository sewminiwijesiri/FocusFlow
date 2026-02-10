"use client";
import React from "react";
import TimerButton from "./TimerButton";

interface Task {
    id: string;
    title: string;
    completed: boolean;
}

interface TaskCardProps {
    task: Task;
    refresh: () => void;
}

export default function TaskCard({ task, refresh }: TaskCardProps) {
    return (
        <div className="glass-card p-5 flex justify-between items-center group hover:bg-white/[0.03] transition-all border-l-4 border-l-transparent hover:border-l-primary/50">
            <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${task.completed ? "bg-secondary shadow-[0_0_10px_rgba(14,165,233,0.5)]" : "bg-primary shadow-[0_0_10px_rgba(99,102,241,0.5)]"}`} />
                <div>
                    <h3 className={`font-bold text-lg leading-tight ${task.completed ? "text-muted line-through" : "text-white"}`}>
                        {task.title}
                    </h3>
                    <p className="text-sm text-muted mt-1 uppercase tracking-wider font-semibold opacity-70">
                        {task.completed ? "Completed" : "Focusing"}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <TimerButton taskId={task.id} refresh={refresh} />
            </div>
        </div>
    );
}

