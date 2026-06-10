'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggle: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [mounted, setMounted]   = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = (localStorage.getItem('tmv_theme') as Theme) || 'light';
    setThemeState(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem('tmv_theme', t);
    document.documentElement.setAttribute('data-theme', t);
  };

  const toggle = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  if (!mounted) {
    return (
      <ThemeContext.Provider value={{ theme: 'light', toggle, setTheme }}>
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, toggle, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggle } = useContext(ThemeContext);

  return (
    <button
      onClick={toggle}
      className={`w-9 h-9 flex items-center justify-center rounded-sm transition-all
        ${theme === 'dark'
          ? 'text-white/40 hover:text-white hover:bg-white/8'
          : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
        } ${className}`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}

export const useTheme = () => useContext(ThemeContext);