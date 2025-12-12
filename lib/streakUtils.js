import { differenceInDays, parseISO, format, isToday } from 'date-fns';

/**
 * Calculate habit streak
 * @param {array} habitLogs - Array of habit completion logs (sorted by date desc)
 * @param {string} lastCompleted - Last completed date
 * @returns {number} - Current streak
 */
export function calculateStreak(habitLogs, lastCompleted) {
    if (!habitLogs || habitLogs.length === 0) return 0;
    if (!lastCompleted) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastDate = new Date(lastCompleted);
    lastDate.setHours(0, 0, 0, 0);

    // If last completed was more than 1 day ago, streak is broken
    const daysSinceLastCompletion = differenceInDays(today, lastDate);
    if (daysSinceLastCompletion > 1) return 0;

    // Count consecutive days backwards from last completion
    let streak = 0;
    let currentDate = lastDate;

    for (const log of habitLogs) {
        const logDate = new Date(log.date);
        logDate.setHours(0, 0, 0, 0);

        const dayDiff = differenceInDays(currentDate, logDate);

        if (dayDiff === 0 && log.completed) {
            streak++;
            currentDate = new Date(currentDate);
            currentDate.setDate(currentDate.getDate() - 1);
        } else if (dayDiff === 1 && log.completed) {
            streak++;
            currentDate = logDate;
        } else if (log.completed === false) {
            // Skip non-completed days
            continue;
        } else {
            // Streak broken
            break;
        }
    }

    return streak;
}

/**
 * Calculate journal streak
 * @param {array} journalEntries - Array of journal entries (sorted by date desc)
 * @returns {number} - Current streak
 */
export function calculateJournalStreak(journalEntries) {
    if (!journalEntries || journalEntries.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if last entry was today or yesterday
    const lastEntry = new Date(journalEntries[0].date);
    lastEntry.setHours(0, 0, 0, 0);

    const daysSinceLastEntry = differenceInDays(today, lastEntry);
    if (daysSinceLastEntry > 1) return 0;

    // Count consecutive days
    let streak = 0;
    let expectedDate = lastEntry;

    for (const entry of journalEntries) {
        const entryDate = new Date(entry.date);
        entryDate.setHours(0, 0, 0, 0);

        if (differenceInDays(expectedDate, entryDate) === 0) {
            streak++;
            expectedDate = new Date(expectedDate);
            expectedDate.setDate(expectedDate.getDate() - 1);
        } else {
            break;
        }
    }

    return streak;
}

/**
 * Check if habit was completed today
 * @param {string} lastCompleted - Last completed date
 * @returns {boolean} - True if completed today
 */
export function isCompletedToday(lastCompleted) {
    if (!lastCompleted) return false;

    const lastDate = new Date(lastCompleted);
    return isToday(lastDate);
}

/**
 * Format streak for display
 * @param {number} streak - Streak count
 * @returns {string} - Formatted string
 */
export function formatStreak(streak) {
    if (streak === 0) return 'No streak';
    if (streak === 1) return '1 day';
    return `${streak} days`;
}

/**
 * Get streak emoji based on count
 * @param {number} streak - Streak count
 * @returns {string} - Emoji
 */
export function getStreakEmoji(streak) {
    if (streak === 0) return 'ZapOff';
    if (streak < 3) return 'Sprout';
    if (streak < 7) return 'Flame';
    if (streak < 30) return 'Star';
    if (streak < 100) return 'Trophy';
    return 'Crown';
}
