interface StatCardProps {
    title: string;
    value: string | number;
    icon: string;
    color: "primary" | "secondary" | "accent";
}

export default function StatCard({ title, value, icon, color }: StatCardProps) {
    const colorClasses = {
        primary: "text-primary bg-primary/10",
        secondary: "text-secondary bg-secondary/10",
        accent: "text-accent bg-accent/10",
    };

    return (
        <div className="glass-card p-6 flex items-center gap-5 group hover:border-primary/20 transition-all duration-300">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm ${colorClasses[color]}`}>
                {icon}
            </div>
            <div>
                <p className="text-muted text-sm font-medium mb-1">{title}</p>
                <h2 className="text-3xl font-bold tracking-tight">{value}</h2>
            </div>
        </div>
    );
}

