import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import { TaskResultPage } from './components/TaskResultPage';
import { Web3Provider } from '@ethersproject/providers';
import { Web3ReactProvider } from '@web3-react/core';
import { Homepage } from './components/Homepage';
import { AnalysisPage, EngineGamePage } from './components/AnalysisPage';
import DealResultPage from './components/TaskResultPage/DealResultPage';
import { AccountPage } from './components/AccountPage';

const tTheme = createTheme({
    palette: {
        primary: {
            main: '#14191c'
        }
    }
});

function getLibrary(provider: any): Web3Provider {
    const library = new Web3Provider(provider);
    library.pollingInterval = 120000;
    return library;
}

const App: React.FC = () => (
    <Web3ReactProvider getLibrary={getLibrary}>
        <ThemeProvider theme={tTheme}>
            <Router>
                <Routes>
                    <Route path="/" element={<Homepage />} />
                    <Route path="/evaluate" element={<AnalysisPage />} />
                    <Route path="/evaluate/:task" element={<TaskResultPage type="evaluation" />} />
                    <Route path="/engine-game" element={<EngineGamePage />} />
                    <Route path="/engine-game/:task" element={<TaskResultPage type="engine-game" />} />
                    <Route path="/deal/:deal" element={<DealResultPage />} />
                    <Route path="/account" element={<AccountPage />} />
                </Routes>
            </Router>
        </ThemeProvider>
    </Web3ReactProvider>
);
export default App;
