interface StatCardProps {
    title: string;
    value: string | number;
    icon: string;
    color: "primary" | "secondary" | "accent";
}

export default function StatCard({ title, value, icon, color }: StatCardProps) {
    const colorClasses = {
        primary: "text-blue-600 bg-blue-50",
        secondary: "text-green-600 bg-green-50",
        accent: "text-red-600 bg-red-50",
    };

    return (
        <div className="glass-card p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl ${colorClasses[color]}`}>
                {icon}
            </div>
            <div>
                <p className="text-gray-600 text-xs font-medium mb-0.5 uppercase tracking-wide">{title}</p>
                <h2 className="text-2xl font-bold text-gray-900">{value}</h2>
            </div>
        </div>
    );
}

