"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface TimerButtonProps {
    taskId: string;
    refresh: () => void;
    elapsedTime?: number; // Time in seconds
}

export default function TimerButton({ taskId, refresh, elapsedTime = 0 }: TimerButtonProps) {
    const [running, setRunning] = useState(false);
    const [loading, setLoading] = useState(false);
    const [displayTime, setDisplayTime] = useState(elapsedTime);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        api(`/api/timer/active?taskId=${taskId}`).then((res) => {
            setRunning(!!res);
        }).catch(() => { });
    }, [taskId]);

    // Update display time from prop
    useEffect(() => {
        setDisplayTime(elapsedTime);
    }, [elapsedTime]);

    // Update display time every second when running
    useEffect(() => {
        if (!running) return;

        const interval = setInterval(() => {
            setDisplayTime(prev => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [running]);

    async function start() {
        setLoading(true);
        try {
            await api("/api/timer/start", {
                method: "POST",
                body: JSON.stringify({ taskId }),
            });
            setRunning(true);
        } catch (err: any) {
            console.error("Failed to start timer", err);
            if (err.message === "Timer already running") {
                setRunning(true);
            }
        } finally {
            setLoading(false);
        }
    }

    async function stop() {
        setLoading(true);
        try {
            await api("/api/timer/stop", {
                method: "PATCH",
                body: JSON.stringify({ taskId }),
            });
            setRunning(false);
            refresh();
        } catch (err: any) {
            console.error("Failed to stop timer", err);
            if (err.message === "No active timer") {
                setRunning(false);
                refresh();
            }
        } finally {
            setLoading(false);
        }
    }

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

    if (running) {
        return (
            <button
                onClick={stop}
                disabled={loading}
                className="bg-red-50 hover:bg-red-100 text-red-600 font-medium px-3 py-1.5 rounded-md border border-red-200 transition-all flex items-center gap-1.5 text-sm active:scale-[0.98] disabled:opacity-50"
            >
                <div className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                <span className="font-mono text-xs">{formatTime(displayTime)}</span>
                <span>Stop</span>
            </button>
        );
    }

    return (
        <button
            onClick={start}
            disabled={loading}
            className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium px-3 py-1.5 rounded-md border border-blue-200 transition-all flex items-center gap-1.5 text-sm active:scale-[0.98] disabled:opacity-50"
        >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
            </svg>
            <span>Start</span>
        </button>
    );
}

