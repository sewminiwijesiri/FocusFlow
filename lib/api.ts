const BASE = ""; // Use relative paths for Next.js

export async function api(path: string, options: RequestInit = {}) {
    let token = null;
    if (typeof window !== "undefined") {
        token = localStorage.getItem("token");
    }

    const res = await fetch(path, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });

    if (!res.ok) {
        let errorMessage = "An error occurred";
        try {
            const errorData = await res.json();
            errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
            // If response is not JSON
        }
        throw new Error(errorMessage);
    }

    // Handle empty responses
    const text = await res.text();
    return text ? JSON.parse(text) : null;
}

