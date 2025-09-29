import { HashRouter } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AnimatedRoutes } from './components/AnimatedRoutes';
import { Toaster } from 'sonner';
import { ThemeProvider } from 'next-themes';

function App() {
    return (
        <HashRouter>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <AppProvider>
                    <AnimatedRoutes />
                </AppProvider>
                <Toaster position='top-center' />
            </ThemeProvider>
        </HashRouter>
    );
}

export default App;
