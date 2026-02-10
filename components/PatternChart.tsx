"use client";

interface PatternChartProps {
    data: { hour: number; seconds: number }[];
}

export default function PatternChart({ data }: PatternChartProps) {
    const maxSeconds = Math.max(...data.map(d => d.seconds), 1);

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        if (hours > 0) return `${hours}h ${mins}m`;
        return `${mins}m`;
    };

    const getIntensityColor = (intensity: number) => {
        if (intensity === 0) return 'bg-gray-100';
        if (intensity < 0.25) return 'bg-blue-100';
        if (intensity < 0.5) return 'bg-blue-200';
        if (intensity < 0.75) return 'bg-blue-400';
        return 'bg-primary';
    };

    return (
        <div className="w-full">
            <div className="grid grid-cols-12 gap-1.5 mb-4">
                {data.map((h) => {
                    const intensity = h.seconds / maxSeconds;
                    const colorClass = getIntensityColor(intensity);

                    return (
                        <div
                            key={h.hour}
                            className={`aspect-square rounded-md relative group cursor-help transition-all hover:scale-110 hover:z-20 ${colorClass}`}
                            title={`${h.hour}:00 - ${formatTime(h.seconds)}`}
                        >
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30">
                                {h.hour}:00 — {formatTime(h.seconds)}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Time labels */}
            <div className="flex justify-between text-xs text-gray-500 font-medium pt-2 border-t border-gray-100">
                <span>00:00</span>
                <span>06:00</span>
                <span>12:00</span>
                <span>18:00</span>
                <span>23:00</span>
            </div>

            {/* Legend */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500">Focus intensity:</span>
                <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-500">Less</span>
                    <div className="w-4 h-4 rounded bg-gray-100"></div>
                    <div className="w-4 h-4 rounded bg-blue-100"></div>
                    <div className="w-4 h-4 rounded bg-blue-200"></div>
                    <div className="w-4 h-4 rounded bg-blue-400"></div>
                    <div className="w-4 h-4 rounded bg-primary"></div>
                    <span className="text-xs text-gray-500">More</span>
                </div>
            </div>
        </div>
    );
}
