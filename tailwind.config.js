/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#bae6fd',
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: '#0ea5e9',
                    600: '#0284c7',
                    700: '#0369a1',
                    800: '#075985',
                    900: '#0c4a6e',
                },
                success: {
                    400: '#4ade80',
                    500: '#22c55e',
                    600: '#16a34a',
                },
                warning: {
                    400: '#fbbf24',
                    500: '#f59e0b',
                },
                danger: {
                    400: '#f87171',
                    500: '#ef4444',
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'gradient-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                'gradient-success': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                'gradient-warm': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'bounce-slow': 'bounce 2s infinite',
                'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
                'slideIn': 'slideIn 0.3s ease-out',
                'fadeIn': 'fadeIn 0.5s ease-in',
                'levelUp': 'levelUp 0.6s ease-out',
            },
            keyframes: {
                slideIn: {
                    '0%': { transform: 'translateY(100%)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                levelUp: {
                    '0%': { transform: 'scale(0.5)', opacity: '0' },
                    '50%': { transform: 'scale(1.2)', opacity: '1' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
