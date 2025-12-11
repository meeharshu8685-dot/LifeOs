# LifeOS - Digital Life Progress Dashboard 🎮

A gamified life management application built with **Next.js 14**, **Tailwind CSS**, **Framer Motion**, **Zustand**, and **Supabase**.

Turn your life into a game! Track habits, master skills, journal daily, and earn XP to level up.

## ✨ Features

- **XP & Leveling System** - Gain experience points and level up
- **Habits Tracking** - Build streaks and earn rewards
- **Skills Progression** - Track and level up your skills
- **Daily Journal** - Reflect with mood tracking
- **Analytics Dashboard** - Visualize your progress with charts
- **Achievements** - Unlock achievements for milestones
- **Life Progress** - See how much of your life you've completed
- **Time Progress** - Track year, month, and week completion
- **PWA Support** - Install as an app on your device
- **Dark Mode Ready** - Beautiful UI in light and dark themes

## 🚀 Tech Stack

- **Next.js 14** (App Router)
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Zustand** - State management
- **Supabase** - Database + Authentication
- **Recharts** - Data visualization
- **Lucide React** - Icons

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd LifeOs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   
   a. Create a new project at [supabase.com](https://supabase.com)
   
   b. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
   
   c. Add your Supabase credentials to `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

4. **Run the database schema**
   
   Open your Supabase SQL Editor and run the contents of `supabase-schema.sql`

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Schema

The app uses 6 Supabase tables:

- `users` - User profiles with XP and level
- `habits` - Habit tracking
- `habit_logs` - Daily habit completion logs
- `skills` - Skill progression
- `journal` - Daily journal entries
- `achievements` - Unlocked achievements

All tables have Row Level Security (RLS) enabled for data protection.

## 🎮 How to Use

1. **Sign Up** - Create an account with your email and birthdate
2. **Create Habits** - Add daily habits you want to build
3. **Track Skills** - Add skills you're learning or mastering
4. **Journal Daily** - Reflect on your day with mood tracking
5. **Complete Tasks** - Mark habits as complete to earn XP
6. **Level Up** - Watch your XP grow and level up!
7. **Unlock Achievements** - Hit milestones to unlock achievements

## 🏆 XP Rewards

- Complete a habit: **+5 XP**
- Practice a skill: **+8 XP**
- Journal entry: **+4 XP**
- Unlock achievement: **+10-200 XP**

## 📱 PWA Installation

The app is installable as a Progressive Web App:

1. Open the app in Chrome/Edge on mobile
2. Tap "Add to Home Screen" when prompted
3. Launch LifeOS from your home screen like a native app!

## 🎨 Features Walkthrough

### Dashboard
- See your current level and XP
- View life progress ring (based on your age)
- Track year/month/week progress
- Quick stats overview
- Today's habits and skills

### Habits Page
- Create and track habits
- Build streaks (🔥 emoji grows with streak length)
- Complete habits daily to earn XP
- Streak visualization

### Skills Page  
- Add skills you're learning
- Practice skills to gain skill XP
- Each skill has its own level
- Visual progress bars

### Journal Page
- Write daily entries
- Track your mood (1-10 slider with emojis)
- Record wins and lessons
- View past entries

### Analytics Page
- Mood trend line chart (30 days)
- Mood distribution bar chart
- Average mood calculation
- Days tracked stats

### Achievements Page
- View all achievements
- See locked/unlocked status
- Track overall completion percentage
- Celebrate milestones

### Profile Page
- View your stats
- See life progress
- Current level progress
- Account details

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## 📝 Project Structure

```
/app
  /auth
    login/page.jsx
    signup/page.jsx
  page.jsx (Dashboard)
  /habits/page.jsx
  /skills/page.jsx
  /journal/page.jsx
  /analytics/page.jsx
  /achievements/page.jsx
  /profile/page.jsx
  layout.js
  globals.css

/components
  SplashScreen.jsx
  Navbar.jsx
  XPBar.jsx
  LifeProgressRing.jsx
  YearProgressRing.jsx
  HabitCard.jsx
  SkillCard.jsx
  JournalEntryCard.jsx
  MoodSlider.jsx
  AchievementCard.jsx
  LevelUpModal.jsx

/lib
  supabaseClient.js
  xpEngine.js
  streakUtils.js
  dateUtils.js
  store.js

/actions
  /habits/completeHabit.js
  /skills/addXP.js
  /journal/addEntry.js
  /dashboard/getStats.js

/public
  manifest.json
```

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Required Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🎯 Future Enhancements

- Weekly/monthly goal setting
- Social features (share achievements)
- Custom themes
- Habit templates
- Skill recommendations
- Export data feature
- Dark mode toggle
- Notifications/reminders
- Habit categories

## 💡 Credits

Built with ❤️ using modern web technologies.

Inspired by productivity apps and gamification principles.

---

**Ready to level up your life? Start playing LifeOS today! 🚀**
