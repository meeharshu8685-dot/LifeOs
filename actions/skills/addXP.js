'use server';

import { supabase } from '@/lib/supabaseClient';
import { XP_REWARDS, calculateSkillLevel, didLevelUp, calculateLevel, checkAchievements, ACHIEVEMENTS } from '@/lib/xpEngine';

export async function addSkillXP(skillId, userId, xpAmount = XP_REWARDS.SKILL_PRACTICE) {
    try {
        // Get skill details
        const { data: skill } = await supabase
            .from('skills')
            .select('*')
            .eq('id', skillId)
            .single();

        if (!skill) {
            return { success: false, error: 'Skill not found' };
        }

        // Calculate new skill XP and level
        const newSkillXP = skill.xp + xpAmount;
        const newSkillLevel = calculateSkillLevel(newSkillXP);

        // Update skill
        await supabase
            .from('skills')
            .update({
                xp: newSkillXP,
                level: newSkillLevel,
            })
            .eq('id', skillId);

        // Get user profile
        const { data: userProfile } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        const oldXP = userProfile.xp;
        const newXP = oldXP + xpAmount;

        // Check for level up
        const leveledUp = didLevelUp(oldXP, newXP);
        const newLevel = calculateLevel(newXP);

        // Update user XP and level
        await supabase
            .from('users')
            .update({
                xp: newXP,
                level: newLevel,
            })
            .eq('id', userId);

        // Check for achievements
        const { data: unlockedAchievements } = await supabase
            .from('achievements')
            .select('type')
            .eq('user_id', userId);

        const { data: allSkills } = await supabase
            .from('skills')
            .select('level')
            .eq('user_id', userId);

        const maxSkillLevel = Math.max(...(allSkills?.map(s => s.level) || [0]));
        const unlockedIds = unlockedAchievements?.map(a => a.type) || [];

        const newAchievements = checkAchievements({
            level: newLevel,
            maxHabitStreak: 0,
            maxSkillLevel: newSkillLevel,
            journalStreak: 0,
        }, unlockedIds);

        // Unlock new achievements
        for (const achievementId of newAchievements) {
            await supabase
                .from('achievements')
                .insert({
                    user_id: userId,
                    type: achievementId,
                });
        }

        return {
            success: true,
            newSkillXP,
            newSkillLevel,
            xpGained: xpAmount,
            newXP,
            newLevel,
            leveledUp,
            achievements: newAchievements,
        };
    } catch (error) {
        console.error('Error adding skill XP:', error);
        return { success: false, error: error.message };
    }
}

export async function createSkill(userId, skillName) {
    try {
        const { data, error } = await supabase
            .from('skills')
            .insert({
                user_id: userId,
                skill_name: skillName,
                xp: 0,
                level: 1,
            })
            .select()
            .single();

        if (error) throw error;

        // Check for first skill achievement
        const { data: achievements } = await supabase
            .from('achievements')
            .select('type')
            .eq('user_id', userId);

        const hasFirstSkillAchievement = achievements?.some(a => a.type === ACHIEVEMENTS.FIRST_SKILL.id);

        if (!hasFirstSkillAchievement) {
            await supabase
                .from('achievements')
                .insert({
                    user_id: userId,
                    type: ACHIEVEMENTS.FIRST_SKILL.id,
                });

            // Award XP for achievement
            const { data: userProfile } = await supabase
                .from('users')
                .select('xp, level')
                .eq('id', userId)
                .single();

            const newXP = userProfile.xp + ACHIEVEMENTS.FIRST_SKILL.xpReward;
            const newLevel = calculateLevel(newXP);

            await supabase
                .from('users')
                .update({ xp: newXP, level: newLevel })
                .eq('id', userId);
        }

        return { success: true, skill: data };
    } catch (error) {
        console.error('Error creating skill:', error);
        return { success: false, error: error.message };
    }
}
