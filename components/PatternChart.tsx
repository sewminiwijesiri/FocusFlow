"use client";

interface PatternChartProps {
    data: { hour: number; seconds: number }[];
}

export default function PatternChart({ data }: PatternChartProps) {
    const maxSeconds = Math.max(...data.map(d => d.seconds), 1);

    return (
        <div className="w-full">
            <div className="grid grid-cols-12 gap-1.5 mb-4">
                {data.map((h) => {
                    const intensity = h.seconds / maxSeconds;
                    // Use scale for intensity instead of opacity if hex variables are tricky,
                    // or just use inline opacity.
                    const opacity = 0.1 + intensity * 0.9;

                    return (
                        <div
                            key={h.hour}
                            className="aspect-square rounded-md relative group cursor-help transition-all hover:scale-125 hover:z-20 shadow-sm"
                            style={{
                                backgroundColor: 'var(--color-secondary)',
                                opacity: opacity
                            }}
                        >
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-card border border-white/10 text-white text-[10px] px-2 py-1 rounded shadow-premium opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-30">
                                {h.hour}:00 — {Math.floor(h.seconds / 60)}m
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="flex justify-between text-[10px] text-muted font-bold uppercase tracking-widest pt-2 border-t border-white/5">
                <span>00:00</span>
                <span>12:00</span>
                <span>23:59</span>
            </div>
        </div>
    );
}
