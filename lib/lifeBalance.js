import { differenceInDays, subDays } from 'date-fns';

export const LIFE_AREAS = [
    'Health',
    'Career',
    'Learning',
    'Relationships',
    'Personal Growth',
    'Mental Health'
];

export function calculateLifeBalanceScore(stats) {
    if (!stats) return { score: 0, status: 'No Data', breakdown: {} };

    // 1. Habits Score (40% weight)
    // Percentage of habits completed today + trend from last 7 days
    const habitData = stats.habitData || []; // Last 7 days completion rates
    const avgHabitCompletion = habitData.length > 0
        ? habitData.reduce((acc, day) => acc + day.completionRate, 0) / habitData.length
        : 0;
    const habitScore = Math.min(avgHabitCompletion, 100) * 0.4;

    // 2. Mood Score (30% weight)
    // Avg mood last 7 days (1-10 scale -> 0-100)
    const moodData = stats.moodData || [];
    const avgMood = moodData.length > 0
        ? moodData.reduce((acc, day) => acc + day.mood, 0) / moodData.length
        : 0;
    const moodScore = (avgMood * 10) * 0.3;

    // 3. Skills/Growth Score (30% weight)
    // XP gained recently checks (mocked for now as total skills level)
    // In real app, we'd check recent XP transactions
    const totalLevels = stats.skills ? stats.skills.reduce((acc, skill) => acc + skill.level, 0) : 0;
    const skillScore = Math.min(totalLevels * 5, 100) * 0.3; // 20 levels = 100%

    // Total Score
    const totalScore = Math.round(habitScore + moodScore + skillScore);

    // Status Message
    let status = 'Balanced';
    if (totalScore >= 85) status = 'Thriving';
    else if (totalScore >= 70) status = 'Doing Well';
    else if (totalScore >= 50) status = 'Balanced';
    else if (totalScore >= 30) status = 'Needs Attention';
    else status = 'Critical';

    return {
        score: totalScore,
        status,
        components: {
            habits: Math.round(habitScore),
            mood: Math.round(moodScore),
            growth: Math.round(skillScore)
        }
    };
}

export function getLifeAreasBreakdown(stats) {
    const areas = {};

    LIFE_AREAS.forEach(area => {
        areas[area] = {
            name: area,
            score: 0,
            items: 0,
            trend: 'neutral' // 'up', 'down', 'neutral'
        };
    });

    if (!stats) return Object.values(areas);

    // Process Habits
    if (stats.habits) {
        stats.habits.forEach(habit => {
            const category = habit.category || 'Personal Growth';
            if (areas[category]) {
                areas[category].items++;
                // Add to score based on streak
                const streakBonus = Math.min(habit.streak * 5, 50);
                areas[category].score += streakBonus;
            }
        });
    }

    // Process Skills
    if (stats.skills) {
        stats.skills.forEach(skill => {
            const category = skill.category || 'Learning'; // Default fallback
            // Try to match specific categories if not categorized in DB yet
            const targetCat = LIFE_AREAS.includes(category) ? category : 'Learning';

            if (areas[targetCat]) {
                areas[targetCat].items++;
                const levelBonus = Math.min(skill.level * 10, 50);
                areas[targetCat].score += levelBonus;
            }
        });
    }

    // Normalize Scores (0-100)
    Object.values(areas).forEach(area => {
        if (area.items > 0) {
            area.score = Math.min(Math.round(area.score / area.items) + 50, 100); // Base 50 + bonus
            if (area.score > 80) area.trend = 'up';
            else if (area.score < 40) area.trend = 'down';
        } else {
            area.score = 0; // No data
        }
    });

    return Object.values(areas);
}
