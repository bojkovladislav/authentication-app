import { FC, createContext, useState, ReactNode } from 'react';

type ThemeColors = 'light' | 'dark';

type Theme = {
  theme: ThemeColors,
  setTheme: (theme: ThemeColors) => void;
}

export const ThemeContext = createContext<Theme>({ theme: 'light', setTheme: () => {}});

export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeColors>('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
