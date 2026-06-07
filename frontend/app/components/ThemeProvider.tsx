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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Read saved preference — default to 'light' if nothing saved
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

  // Prevent flash of wrong theme on first render
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
      className={`w-9 h-9 flex items-center justify-center border transition-all
        ${theme === 'dark'
          ? 'border-white/10 text-white/50 hover:text-white hover:border-white/25 bg-transparent'
          : 'border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-300 bg-white'
        } ${className}`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  );
}

export const useTheme = () => useContext(ThemeContext);