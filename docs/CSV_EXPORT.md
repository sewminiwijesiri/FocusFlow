# CSV Export Feature Documentation

## Overview
The CSV export feature allows users to download all their tasks as a CSV (Comma-Separated Values) file that can be opened in Excel, Google Sheets, or any spreadsheet application.

## How to Use
1. Navigate to the **Tasks** page (`/tasks`)
2. Click the **Export CSV** button in the header (next to the "New Task" button)
3. A CSV file will automatically download with the filename format: `focusflow-tasks-YYYY-MM-DD.csv`

## CSV File Structure

The exported CSV file contains the following columns:

| Column Name | Description | Example |
|------------|-------------|---------|
| **Task ID** | Unique identifier for the task | `cm5abc123def456` |
| **Title** | Task title | `Design Landing Page` |
| **Description** | Task description (if provided) | `Create a modern landing page with hero section` |
| **Status** | Current task status | `Completed` or `In Progress` |
| **Total Time Spent** | Total time tracked on the task | `02:45:30` (HH:MM:SS) |
| **Currently Running** | Whether a timer is currently active | `Yes` or `No` |
| **Created At** | When the task was created | `2/10/2026, 10:30:00 AM` |
| **Completed At** | When the task was completed (if applicable) | `2/10/2026, 1:15:30 PM` |

## Example CSV Output

```csv
Task ID,Title,Description,Status,Total Time Spent,Currently Running,Created At,Completed At
cm5abc123,Design Landing Page,"Create a modern landing page with hero section",Completed,02:45:30,No,"2/10/2026, 10:30:00 AM","2/10/2026, 1:15:30 PM"
cm5def456,Write Documentation,,In Progress,01:20:15,Yes,"2/10/2026, 2:00:00 PM",
cm5ghi789,Fix Bug #123,"Resolve issue with timer not stopping properly",In Progress,00:30:45,No,"2/10/2026, 3:15:00 PM",
```

## Features

### ✅ Excel Compatibility
- UTF-8 BOM encoding ensures proper character display in Excel
- Proper escaping of special characters (commas, quotes, newlines)

### ✅ Smart Field Handling
- Empty fields are handled gracefully
- Descriptions with commas or quotes are properly escaped
- Multi-line descriptions are wrapped in quotes

### ✅ Time Formatting
- Time is displayed in HH:MM:SS format for easy reading
- Hours are included even if zero (e.g., `00:30:15`)

### ✅ Date Formatting
- Dates use locale-specific formatting
- Includes both date and time information

## Technical Implementation

### Files Created
1. **`lib/csvExport.ts`** - Core CSV export utility functions
   - `tasksToCSV()` - Converts task array to CSV string
   - `escapeCSVField()` - Handles special character escaping
   - `formatTimeForCSV()` - Formats seconds to HH:MM:SS
   - `downloadCSV()` - Triggers browser download
   - `exportTasksToCSV()` - Main export function

2. **`app/tasks/page.tsx`** - Updated tasks page
   - Added "Export CSV" button in header
   - Added `handleExportCSV()` function
   - Button is disabled when no tasks exist

### Button States
- **Enabled**: When tasks exist, button is clickable with full opacity
- **Disabled**: When no tasks exist, button is grayed out with reduced opacity and shows "No tasks to export!" alert if clicked

## Use Cases

1. **Backup**: Keep a backup of all your tasks
2. **Reporting**: Generate reports for time tracking
3. **Analysis**: Analyze productivity patterns in Excel/Google Sheets
4. **Sharing**: Share task lists with team members
5. **Migration**: Export data for migration to other tools

## Browser Compatibility
Works in all modern browsers that support:
- Blob API
- URL.createObjectURL()
- Download attribute on anchor tags

Tested on: Chrome, Firefox, Edge, Safari
