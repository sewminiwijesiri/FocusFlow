"use client";

interface ActivityChartProps {
    data: { label: string; seconds: number }[];
}

export default function ActivityChart({ data }: ActivityChartProps) {
    const maxSeconds = Math.max(...data.map(d => d.seconds), 60);

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        if (hours > 0) return `${hours}h ${mins}m`;
        return `${mins}m`;
    };

    return (
        <div className="w-full">
            <div className="flex items-end justify-between gap-2 h-40 mb-3">
                {data.map((day, i) => {
                    const heightPercent = Math.max((day.seconds / maxSeconds) * 100, 2);
                    const isToday = i === 6;

                    return (
                        <div key={i} className="flex-1 flex flex-col items-center group h-full justify-end">
                            <div
                                className={`w-full rounded-t-md transition-all duration-500 ease-out relative ${isToday
                                        ? 'bg-primary'
                                        : day.seconds > 0
                                            ? 'bg-blue-200 group-hover:bg-blue-300'
                                            : 'bg-gray-100'
                                    }`}
                                style={{ height: `${heightPercent}%` }}
                            >
                                {/* Tooltip */}
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                    {formatTime(day.seconds)}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="flex justify-between gap-2">
                {data.map((day, i) => (
                    <div key={i} className={`flex-1 text-center text-xs font-medium ${i === 6 ? 'text-primary' : 'text-gray-500'
                        }`}>
                        {day.label}
                    </div>
                ))}
            </div>

            {/* Time scale indicator */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span>Total this week: <span className="font-semibold text-gray-900">{formatTime(data.reduce((sum, d) => sum + d.seconds, 0))}</span></span>
            </div>
        </div>
    );
}
