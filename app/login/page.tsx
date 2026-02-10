"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const data = await api("/api/auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
            });

            localStorage.setItem("token", data.token);
            router.push("/dashboard");
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-[calc(100vh-64px)] flex flex-col justify-center items-center px-4">
            <div className="glass-card w-full max-w-md p-8 animate-fade-in">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-gradient mb-2">Welcome Back</h1>
                    <p className="text-muted">Enter your details to access your focus flow.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-accent/10 border border-accent/20 text-accent text-sm p-4 rounded-xl">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted ml-1">Email Address</label>
                        <input
                            className="glass-input w-full"
                            type="email"
                            placeholder="name@example.com"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted ml-1">Password</label>
                        <input
                            className="glass-input w-full"
                            type="password"
                            placeholder="••••••••"
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <p className="text-center mt-8 text-muted">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="text-primary hover:text-primary-hover font-semibold transition-colors">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}

