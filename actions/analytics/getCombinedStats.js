'use server';

import { supabase } from '@/lib/supabaseClient';
import { getTodayString } from '@/lib/dateUtils';

export async function getCombinedStats(userId, days = 30) {
    try {
        const today = new Date();
        const pastDate = new Date();
        pastDate.setDate(today.getDate() - days);
        const pastDateString = pastDate.toISOString().split('T')[0];

        // 1. Fetch Habit Logs (for completion consistency)
        const { data: habitLogs, error: habitError } = await supabase
            .from('habit_logs')
            .select('date, habit_id')
            .eq('user_id', userId)
            .gte('date', pastDateString)
            .eq('completed', true);

        if (habitError) throw habitError;

        // 2. Fetch Skills (for radar/bar chart)
        const { data: skills, error: skillsError } = await supabase
            .from('skills')
            .select('name, level, xp')
            .eq('user_id', userId)
            .order('level', { ascending: false })
            .limit(6); // Top 6 skills for neat chart

        if (skillsError) throw skillsError;

        // Process Habit Data: Group by date
        const habitMap = {};
        // Initialize last 30 days with 0
        for (let i = 0; i < days; i++) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            const dString = d.toISOString().split('T')[0];
            habitMap[dString] = 0;
        }

        habitLogs.forEach(log => {
            // Ensure date string format matches
            const dateKey = log.date;
            if (habitMap[dateKey] !== undefined) {
                habitMap[dateKey]++;
            }
        });

        const habitData = Object.keys(habitMap).map(date => ({
            date,
            count: habitMap[date]
        })).sort((a, b) => new Date(a.date) - new Date(b.date));


        // Process Skill Data
        const skillData = skills.map(skill => ({
            subject: skill.name,
            A: skill.level,
            fullMark: 100, // Assuming max logical level for viz, though unlimited
        }));

        return {
            success: true,
            habitData,
            skillData,
        };

    } catch (error) {
        console.error('Error fetching combined stats:', error);
        return { success: false, error: error.message };
    }
}
