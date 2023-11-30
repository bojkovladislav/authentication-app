import { useContext } from 'react';
import { ThemeContext } from '../components/ThemeProvider/ThemeProvider';

export const useThemeStyle = () => {
  const { theme } = useContext(ThemeContext);

  const setThemeStyle = (forLightTheme: string, forDarkTheme: string) => {
    return theme === 'light' ? forLightTheme : forDarkTheme;
  };

  return setThemeStyle;
};