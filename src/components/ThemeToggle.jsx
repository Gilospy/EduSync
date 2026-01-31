import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, EyeOff } from 'lucide-react';

export const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', background: 'var(--color-bg-secondary)', padding: '4px', borderRadius: 'var(--radius-md)' }}>
            <button
                className="btn-ghost"
                style={{ padding: '8px', background: theme === 'light' ? 'var(--color-surface)' : 'transparent', boxShadow: theme === 'light' ? 'var(--shadow-sm)' : 'none' }}
                onClick={() => toggleTheme('light')}
                title="Light Mode"
            >
                <Sun size={18} />
            </button>
            <button
                className="btn-ghost"
                style={{ padding: '8px', background: theme === 'dark' ? 'var(--color-surface)' : 'transparent', boxShadow: theme === 'dark' ? 'var(--shadow-sm)' : 'none' }}
                onClick={() => toggleTheme('dark')}
                title="Dark Mode"
            >
                <Moon size={18} />
            </button>
            <button
                className="btn-ghost"
                style={{ padding: '8px', background: theme === 'low-stim' ? 'var(--color-surface)' : 'transparent', boxShadow: theme === 'low-stim' ? 'var(--shadow-sm)' : 'none' }}
                onClick={() => toggleTheme('low-stim')}
                title="Low Stimulation Mode"
            >
                <EyeOff size={18} />
            </button>
        </div>
    );
};
