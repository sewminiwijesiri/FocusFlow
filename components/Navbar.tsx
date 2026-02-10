"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem("token"));
    }, [pathname]);

    function logout() {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        router.push("/login");
    }

    // Hide navbar on login/register pages if desired, or keep it consistent
    const isAuthPage = pathname === "/login" || pathname === "/register";

    return (
        <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex justify-between items-center transition-all">
            <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg shadow-glow flex items-center justify-center">
                    <span className="text-white font-bold text-lg">F</span>
                </div>
                <h1 className="text-xl font-extrabold tracking-tight text-gradient">FocusFlow</h1>
            </Link>

            <div className="flex items-center gap-8">
                {isLoggedIn ? (
                    <>
                        <div className="flex gap-6 items-center">
                            <Link href="/dashboard" className={`text-sm font-medium transition-colors ${pathname === '/dashboard' ? 'text-primary' : 'text-muted hover:text-white'}`}>
                                Dashboard
                            </Link>
                            <Link href="/tasks" className={`text-sm font-medium transition-colors ${pathname === '/tasks' ? 'text-primary' : 'text-muted hover:text-white'}`}>
                                Tasks
                            </Link>
                        </div>
                        <button
                            onClick={logout}
                            className="bg-accent/10 hover:bg-accent/20 text-accent text-sm font-semibold px-4 py-2 rounded-lg transition-all"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    !isAuthPage && (
                        <div className="flex gap-4">
                            <Link href="/login" className="text-sm font-medium text-muted hover:text-white py-2">Sign In</Link>
                            <Link href="/register" className="btn-primary py-2 px-4 text-sm rounded-lg">Get Started</Link>
                        </div>
                    )
                )}
            </div>
        </nav>
    );
}

