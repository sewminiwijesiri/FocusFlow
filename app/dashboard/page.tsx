"use client";

import { useEffect, useState } from "react";

type Task = {
    id: string;
    title: string;
    description: string;
    completed: boolean;
};

export default function Dashboard() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

    const fetchTasks = async () => {
        const res = await fetch("/api/tasks", {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) setTasks(await res.json());
    };

    const addTask = async () => {
        const res = await fetch("/api/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ title, description }),
        });
        if (res.ok) {
            setTitle("");
            setDescription("");
            fetchTasks();
        }
    };

    const toggleComplete = async (id: string) => {
        await fetch(`/api/tasks/${id}/complete`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token}` },
        });
        fetchTasks();
    };

    const deleteTask = async (id: string) => {
        await fetch(`/api/tasks/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
        fetchTasks();
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <div className="mb-6 flex gap-2">
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border p-2 rounded"
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border p-2 rounded"
                />
                <button onClick={addTask} className="bg-blue-500 text-white p-2 rounded">
                    Add Task
                </button>
            </div>

            <ul className="space-y-3">
                {tasks.map((task) => (
                    <li key={task.id} className="flex justify-between items-center p-3 border rounded">
                        <div>
                            <h2 className={`font-bold ${task.completed ? "line-through text-gray-400" : ""}`}>
                                {task.title}
                            </h2>
                            <p>{task.description}</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => toggleComplete(task.id)}
                                className={`p-2 rounded ${task.completed ? "bg-yellow-400" : "bg-green-500"} text-white`}
                            >
                                {task.completed ? "Undo" : "Complete"}
                            </button>
                            <button onClick={() => deleteTask(task.id)} className="bg-red-500 p-2 rounded text-white">
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
