import { HashRouter } from 'react-router-dom';
import { AppProvider } from '@/context/AppContext';
import { AnimatedRoutes } from '@/components/AnimatedRoutes';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';

function App() {
    return (
        <HashRouter>
            <ThemeProvider>
                <AppProvider>
                    <AnimatedRoutes />
                </AppProvider>
                <Toaster position='top-center' />
            </ThemeProvider>
        </HashRouter>
    );
}

export default App;
