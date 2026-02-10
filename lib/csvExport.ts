interface TaskForExport {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    activeTimerStart?: string | null;
    totalTimeSpent?: number;
    createdAt?: string;
    completedAt?: string | null;
}

/**
 * Format time in seconds to HH:MM:SS format
 */
function formatTimeForCSV(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Escape CSV field values to handle commas, quotes, and newlines
 */
function escapeCSVField(field: string | undefined | null): string {
    if (!field) return '';

    // Convert to string and escape quotes by doubling them
    const stringField = String(field).replace(/"/g, '""');

    // Wrap in quotes if contains comma, quote, or newline
    if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
        return `"${stringField}"`;
    }

    return stringField;
}

/**
 * Convert tasks array to CSV string
 */
export function tasksToCSV(tasks: TaskForExport[]): string {
    // Define CSV headers
    const headers = [
        'Task ID',
        'Title',
        'Description',
        'Status',
        'Total Time Spent',
        'Currently Running',
        'Created At',
        'Completed At'
    ];

    // Create CSV rows
    const rows = tasks.map(task => {
        const isRunning = task.activeTimerStart ? 'Yes' : 'No';
        const status = task.completed ? 'Completed' : 'In Progress';
        const timeSpent = task.totalTimeSpent ? formatTimeForCSV(task.totalTimeSpent) : '00:00:00';
        const createdAt = task.createdAt ? new Date(task.createdAt).toLocaleString() : '';
        const completedAt = task.completedAt ? new Date(task.completedAt).toLocaleString() : '';

        return [
            escapeCSVField(task.id),
            escapeCSVField(task.title),
            escapeCSVField(task.description),
            escapeCSVField(status),
            escapeCSVField(timeSpent),
            escapeCSVField(isRunning),
            escapeCSVField(createdAt),
            escapeCSVField(completedAt)
        ].join(',');
    });

    // Combine headers and rows
    return [headers.join(','), ...rows].join('\n');
}

/**
 * Download CSV file
 */
export function downloadCSV(csvContent: string, filename: string = 'tasks.csv'): void {
    // Create blob with UTF-8 BOM for Excel compatibility
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

    // Create download link
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    URL.revokeObjectURL(url);
}

/**
 * Export tasks to CSV file
 */
export function exportTasksToCSV(tasks: TaskForExport[], filename?: string): void {
    const csvContent = tasksToCSV(tasks);
    const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const defaultFilename = `focusflow-tasks-${timestamp}.csv`;
    downloadCSV(csvContent, filename || defaultFilename);
}
