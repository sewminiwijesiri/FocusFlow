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
        api(`/api/timer/active?taskId=${taskId}`).then((res) => {
            setRunning(!!res.activeSession);
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
        } catch (err) {
            console.error("Failed to start timer", err);
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
        } catch (err) {
            console.error("Failed to stop timer", err);
        } finally {
            setLoading(false);
        }
    }


    if (running) {
        return (
            <button
                onClick={stop}
                disabled={loading}
                className="bg-accent/10 hover:bg-accent/20 text-accent font-bold px-6 py-2 rounded-xl border border-accent/20 transition-all flex items-center gap-2 group active:scale-95 disabled:opacity-50"
            >
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                Stop
            </button>
        );
    }

    return (
        <button
            onClick={start}
            disabled={loading}
            className="btn-secondary px-6 py-2 rounded-xl flex items-center gap-2 active:scale-95 disabled:opacity-50"
        >
            <span className="opacity-70 group-hover:opacity-100 transition-opacity">▶</span>
            Start
        </button>
    );
}

