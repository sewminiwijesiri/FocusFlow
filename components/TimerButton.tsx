"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface TimerButtonProps {
    taskId: string;
    refresh: () => void;
}

export default function TimerButton({ taskId, refresh }: TimerButtonProps) {
    const [running, setRunning] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        api(`/api/timer/active?taskId=${taskId}`).then((res) => {
            setRunning(!!res);
        }).catch(() => { });
    }, [taskId]);

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


    if (running) {
        return (
            <button
                onClick={stop}
                disabled={loading}
                className="bg-accent/20 hover:bg-accent/30 text-accent font-bold px-5 py-2 rounded-xl border border-accent/30 transition-all flex items-center gap-2 group active:scale-95 disabled:opacity-50 shadow-[0_0_15px_rgba(244,63,94,0.2)]"
            >
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
                <span className="text-sm tracking-wide">Stop</span>
            </button>
        );
    }

    return (
        <button
            onClick={start}
            disabled={loading}
            className="bg-white/5 hover:bg-primary/10 hover:text-primary text-white/70 font-bold px-5 py-2 rounded-xl border border-white/10 hover:border-primary/30 transition-all flex items-center gap-2 group active:scale-95 disabled:opacity-50"
        >
            <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
            </svg>
            <span className="text-sm tracking-wide">Start</span>
        </button>
    );
}

