import { HashRouter, Route, Routes } from 'react-router-dom';
import { BenefitDetails } from './routes/BenefitDetails';
import { BenefitInput } from './routes/BenefitInput';
import { BenefitList } from './routes/BenefitList';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './components/ThemeProvider';

function App() {
    return (
        <HashRouter>
            <ThemeProvider>
                <AppProvider>
                    <Routes>
                        <Route index element={<BenefitInput />} />
                        <Route path="/benefits" element={<BenefitList />} />
                        <Route path="/benefits/:id" element={<BenefitDetails />} />
                    </Routes>
                </AppProvider>
            </ThemeProvider>
        </HashRouter>
    );
}

export default App;
