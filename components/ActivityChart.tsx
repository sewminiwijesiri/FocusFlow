"use client";

interface ActivityChartProps {
    data: { label: string; seconds: number }[];
}

export default function ActivityChart({ data }: ActivityChartProps) {
    const maxSeconds = Math.max(...data.map(d => d.seconds), 60);

    return (
        <div className="w-full">
            <div className="flex items-end justify-between gap-2 h-32 mb-4">
                {data.map((day, i) => {
                    const heightPercent = (day.seconds / maxSeconds) * 100;
                    return (
                        <div key={i} className="flex-1 flex flex-col items-center group h-full justify-end">
                            <div
                                className={`w-full rounded-t-lg transition-all duration-700 ease-out relative ${i === 6 ? 'bg-primary shadow-glow' : 'bg-primary/20 group-hover:bg-primary/50'}`}
                                style={{ height: `${heightPercent}%` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/5 rounded-t-lg" />
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-card border border-white/10 text-white text-[10px] px-2 py-1 rounded shadow-premium opacity-0 group-hover:opacity-100 transition-all group-hover:-top-11 whitespace-nowrap z-10 pointer-events-none">
                                    {Math.floor(day.seconds / 60)}m
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="flex justify-between gap-2">
                {data.map((day, i) => (
                    <div key={i} className="flex-1 text-center text-[10px] text-muted font-bold uppercase tracking-tighter">
                        {day.label}
                    </div>
                ))}
            </div>
        </div>
    );
}
