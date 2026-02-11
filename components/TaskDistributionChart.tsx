"use client";

interface TaskDistributionChartProps {
    completedTasks: number;
    activeTasks: number;
}

export default function TaskDistributionChart({ completedTasks, activeTasks }: TaskDistributionChartProps) {
    const total = completedTasks + activeTasks;
    const completedPercent = total > 0 ? (completedTasks / total) * 100 : 0;
    const activePercent = total > 0 ? (activeTasks / total) * 100 : 0;

    return (
        <div className="w-full">
            {/* Progress bar */}
            <div className="h-8 bg-gray-100 rounded-lg overflow-hidden flex mb-4">
                {completedPercent > 0 && (
                    <div
                        className="bg-secondary flex items-center justify-center text-white text-xs font-semibold transition-all duration-500"
                        style={{ width: `${completedPercent}%` }}
                    >
                        {completedPercent > 15 && `${Math.round(completedPercent)}%`}
                    </div>
                )}
                {activePercent > 0 && (
                    <div
                        className="bg-blue-200 flex items-center justify-center text-gray-700 text-xs font-semibold transition-all duration-500"
                        style={{ width: `${activePercent}%` }}
                    >
                        {activePercent > 15 && `${Math.round(activePercent)}%`}
                    </div>
                )}
            </div>

            {/* Legend */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-secondary"></div>
                        <span className="text-sm text-gray-600">Completed</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{completedTasks}</span>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-blue-200"></div>
                        <span className="text-sm text-gray-600">Active</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{activeTasks}</span>
                </div>
            </div>

            {/* Total */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500">Total tasks:</span>
                <span className="text-sm font-bold text-gray-900">{total}</span>
            </div>
        </div>
    );
}
