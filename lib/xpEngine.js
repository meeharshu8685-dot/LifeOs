// XP Rewards for different activities
export const XP_REWARDS = {
    HABIT_COMPLETED: 5,
    WORKOUT_LOGGED: 10,
    SKILL_PRACTICE: 8,
    GOOD_SLEEP: 5,
    JOURNAL_ENTRY: 4,
    ACHIEVEMENT_UNLOCKED: 20,
};

// Level thresholds (progressive scaling)
export const LEVEL_THRESHOLDS = [
    0,      // Level 1
    100,    // Level 2
    250,    // Level 3
    500,    // Level 4
    900,    // Level 5
    1500,   // Level 6
    2300,   // Level 7
    3300,   // Level 8
    4500,   // Level 9
    6000,   // Level 10
    8000,   // Level 11
    10500,  // Level 12
    13500,  // Level 13
    17000,  // Level 14
    21000,  // Level 15
    25500,  // Level 16
    30500,  // Level 17
    36000,  // Level 18
    42000,  // Level 19
    48500,  // Level 20
];

/**
 * Calculate user level based on total XP
 * @param {number} xp - Total XP
 * @returns {number} - Current level
 */
export function calculateLevel(xp) {
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
        if (xp >= LEVEL_THRESHOLDS[i]) {
            return i + 1;
        }
    }
    return 1;
}

/**
 * Get XP required for next level
 * @param {number} currentLevel - Current level
 * @returns {number} - XP required for next level
 */
export function getXPForNextLevel(currentLevel) {
    if (currentLevel >= LEVEL_THRESHOLDS.length) {
        // Beyond max level, use exponential scaling
        const lastThreshold = LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
        const increment = 7000;
        return lastThreshold + (increment * (currentLevel - LEVEL_THRESHOLDS.length + 1));
    }
    return LEVEL_THRESHOLDS[currentLevel];
}

/**
 * Get XP for current level
 * @param {number} currentLevel - Current level
 * @returns {number} - XP at start of current level
 */
export function getXPForCurrentLevel(currentLevel) {
    if (currentLevel <= 1) return 0;
    if (currentLevel > LEVEL_THRESHOLDS.length) {
        const lastThreshold = LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
        const increment = 7000;
        return lastThreshold + (increment * (currentLevel - LEVEL_THRESHOLDS.length));
    }
    return LEVEL_THRESHOLDS[currentLevel - 2];
}

/**
 * Calculate progress to next level
 * @param {number} xp - Total XP
 * @param {number} currentLevel - Current level
 * @returns {number} - Progress percentage (0-100)
 */
export function calculateLevelProgress(xp, currentLevel) {
    const currentLevelXP = getXPForCurrentLevel(currentLevel);
    const nextLevelXP = getXPForNextLevel(currentLevel);
    const xpInCurrentLevel = xp - currentLevelXP;
    const xpNeededForLevel = nextLevelXP - currentLevelXP;

    return Math.floor((xpInCurrentLevel / xpNeededForLevel) * 100);
}

/**
 * Check if user leveled up
 * @param {number} oldXP - XP before action
 * @param {number} newXP - XP after action
 * @returns {boolean} - True if leveled up
 */
export function didLevelUp(oldXP, newXP) {
    const oldLevel = calculateLevel(oldXP);
    const newLevel = calculateLevel(newXP);
    return newLevel > oldLevel;
}

/**
 * Calculate XP for skill level
 * @param {number} skillXP - Skill XP
 * @returns {number} - Skill level
 */
export function calculateSkillLevel(skillXP) {
    // Skill levels use similar progression
    const skillLevels = [0, 50, 120, 250, 450, 750, 1200, 1800, 2500, 3500, 5000];
    for (let i = skillLevels.length - 1; i >= 0; i--) {
        if (skillXP >= skillLevels[i]) {
            return i + 1;
        }
    }
    return 1;
}

/**
 * Achievement types and their unlock conditions
 */
export const ACHIEVEMENTS = {
    HABIT_STREAK_7: {
        id: 'habit_streak_7',
        name: '7 Day Warrior',
        description: 'Complete a habit for 7 days in a row',
        icon: '🔥',
        xpReward: 50,
    },
    HABIT_STREAK_30: {
        id: 'habit_streak_30',
        name: 'Monthly Master',
        description: 'Complete a habit for 30 days in a row',
        icon: '🏆',
        xpReward: 200,
    },
    LEVEL_5: {
        id: 'level_5',
        name: 'Rising Star',
        description: 'Reach level 5',
        icon: '⭐',
        xpReward: 100,
    },
    LEVEL_10: {
        id: 'level_10',
        name: 'Dedicated Hero',
        description: 'Reach level 10',
        icon: '🌟',
        xpReward: 250,
    },
    SKILL_LEVEL_5: {
        id: 'skill_level_5',
        name: 'Skill Expert',
        description: 'Reach level 5 in any skill',
        icon: '🎯',
        xpReward: 100,
    },
    JOURNAL_STREAK_20: {
        id: 'journal_streak_20',
        name: 'Reflective Soul',
        description: 'Journal for 20 days in a row',
        icon: '📖',
        xpReward: 150,
    },
    FIRST_HABIT: {
        id: 'first_habit',
        name: 'Getting Started',
        description: 'Create your first habit',
        icon: '🎬',
        xpReward: 10,
    },
    FIRST_SKILL: {
        id: 'first_skill',
        name: 'Lifelong Learner',
        description: 'Start tracking your first skill',
        icon: '📚',
        xpReward: 10,
    },
};

/**
 * Check which achievements should be unlocked
 * @param {object} userStats - User statistics
 * @param {array} unlockedAchievements - Already unlocked achievement IDs
 * @returns {array} - New achievements to unlock
 */
export function checkAchievements(userStats, unlockedAchievements = []) {
    const newAchievements = [];
    const unlocked = new Set(unlockedAchievements);

    // Check level achievements
    if (userStats.level >= 5 && !unlocked.has(ACHIEVEMENTS.LEVEL_5.id)) {
        newAchievements.push(ACHIEVEMENTS.LEVEL_5.id);
    }
    if (userStats.level >= 10 && !unlocked.has(ACHIEVEMENTS.LEVEL_10.id)) {
        newAchievements.push(ACHIEVEMENTS.LEVEL_10.id);
    }

    // Check habit streaks
    if (userStats.maxHabitStreak >= 7 && !unlocked.has(ACHIEVEMENTS.HABIT_STREAK_7.id)) {
        newAchievements.push(ACHIEVEMENTS.HABIT_STREAK_7.id);
    }
    if (userStats.maxHabitStreak >= 30 && !unlocked.has(ACHIEVEMENTS.HABIT_STREAK_30.id)) {
        newAchievements.push(ACHIEVEMENTS.HABIT_STREAK_30.id);
    }

    // Check skill level
    if (userStats.maxSkillLevel >= 5 && !unlocked.has(ACHIEVEMENTS.SKILL_LEVEL_5.id)) {
        newAchievements.push(ACHIEVEMENTS.SKILL_LEVEL_5.id);
    }

    // Check journal streak
    if (userStats.journalStreak >= 20 && !unlocked.has(ACHIEVEMENTS.JOURNAL_STREAK_20.id)) {
        newAchievements.push(ACHIEVEMENTS.JOURNAL_STREAK_20.id);
    }

    return newAchievements;
}
