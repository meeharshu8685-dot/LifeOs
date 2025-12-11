import {
    differenceInYears,
    differenceInDays,
    startOfYear,
    endOfYear,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    format
} from 'date-fns';

/**
 * Calculate life progress percentage based on birthdate
 * @param {string} birthdate - User's birthdate (YYYY-MM-DD)
 * @param {number} lifeExpectancy - Expected lifespan in years (default: 80)
 * @returns {number} - Life progress percentage (0-100)
 */
export function calculateLifeProgress(birthdate, lifeExpectancy = 80) {
    if (!birthdate) return 0;

    const birth = new Date(birthdate);
    const today = new Date();

    const ageInYears = differenceInYears(today, birth);
    const ageInDays = differenceInDays(today, birth);
    const totalDays = lifeExpectancy * 365.25;

    const progress = (ageInDays / totalDays) * 100;
    return Math.min(Math.max(progress, 0), 100);
}

/**
 * Calculate year progress percentage
 * @returns {number} - Year progress percentage (0-100)
 */
export function calculateYearProgress() {
    const now = new Date();
    const yearStart = startOfYear(now);
    const yearEnd = endOfYear(now);

    const totalDays = differenceInDays(yearEnd, yearStart) + 1;
    const daysPassed = differenceInDays(now, yearStart) + 1;

    return Math.floor((daysPassed / totalDays) * 100);
}

/**
 * Calculate month progress percentage
 * @returns {number} - Month progress percentage (0-100)
 */
export function calculateMonthProgress() {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const totalDays = differenceInDays(monthEnd, monthStart) + 1;
    const daysPassed = differenceInDays(now, monthStart) + 1;

    return Math.floor((daysPassed / totalDays) * 100);
}

/**
 * Calculate week progress percentage
 * @returns {number} - Week progress percentage (0-100)
 */
export function calculateWeekProgress() {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday start
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

    const totalDays = 7;
    const daysPassed = differenceInDays(now, weekStart) + 1;

    return Math.floor((daysPassed / totalDays) * 100);
}

/**
 * Get user's age
 * @param {string} birthdate - User's birthdate (YYYY-MM-DD)
 * @returns {number} - Age in years
 */
export function getAge(birthdate) {
    if (!birthdate) return 0;
    return differenceInYears(new Date(), new Date(birthdate));
}

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @param {string} formatString - Format string (default: 'MMM dd, yyyy')
 * @returns {string} - Formatted date
 */
export function formatDate(date, formatString = 'MMM dd, yyyy') {
    if (!date) return '';
    return format(new Date(date), formatString);
}

/**
 * Get relative time string (e.g., "2 days ago")
 * @param {string|Date} date - Date to compare
 * @returns {string} - Relative time string
 */
export function getRelativeTime(date) {
    if (!date) return '';

    const now = new Date();
    const past = new Date(date);
    const days = differenceInDays(now, past);

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
}

/**
 * Get days remaining in year
 * @returns {number} - Days remaining
 */
export function getDaysRemainingInYear() {
    const now = new Date();
    const yearEnd = endOfYear(now);
    return differenceInDays(yearEnd, now);
}

/**
 * Get days remaining in month
 * @returns {number} - Days remaining
 */
export function getDaysRemainingInMonth() {
    const now = new Date();
    const monthEnd = endOfMonth(now);
    return differenceInDays(monthEnd, now);
}

/**
 * Get current date in YYYY-MM-DD format
 * @returns {string} - Formatted date
 */
export function getTodayString() {
    return format(new Date(), 'yyyy-MM-dd');
}
