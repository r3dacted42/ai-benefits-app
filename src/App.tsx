import { HashRouter } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './components/ThemeProvider';
import { AnimatedRoutes } from './components/AnimatedRoutes';

function App() {
    return (
        <HashRouter>
            <ThemeProvider>
                <AppProvider>
                    <AnimatedRoutes />
                </AppProvider>
            </ThemeProvider>
        </HashRouter>
    );
}

export default App;
