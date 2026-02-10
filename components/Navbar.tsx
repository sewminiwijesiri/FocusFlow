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
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-6 py-3 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">F</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">FocusFlow</h1>
            </Link>

            <div className="flex items-center gap-6">
                {isLoggedIn ? (
                    <>
                        <div className="flex gap-6 items-center">
                            <Link href="/dashboard" className={`text-sm font-medium transition-colors ${pathname === '/dashboard' ? 'text-primary' : 'text-gray-600 hover:text-gray-900'}`}>
                                Dashboard
                            </Link>
                            <Link href="/tasks" className={`text-sm font-medium transition-colors ${pathname === '/tasks' ? 'text-primary' : 'text-gray-600 hover:text-gray-900'}`}>
                                Tasks
                            </Link>
                        </div>
                        <button
                            onClick={logout}
                            className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-md hover:bg-gray-100 transition-all"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    !isAuthPage && (
                        <div className="flex gap-3">
                            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5">Sign In</Link>
                            <Link href="/register" className="btn-primary text-sm">Get Started</Link>
                        </div>
                    )
                )}
            </div>
        </nav>
    );
}

