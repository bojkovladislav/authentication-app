import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.tsx';
import '@mantine/core/styles.css';
import {
  ThemeProvider,
} from './components/ThemeProvider/ThemeProvider.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <HashRouter>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </HashRouter>
);
