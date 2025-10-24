import React, { useState, useCallback } from 'react';
import type { Page, AnalysisData, ChatMessage } from './types';
import Sidebar from './components/Sidebar';
import Toolbar from './components/Toolbar';
import HomePage from './components/pages/HomePage';
import ChatPage from './components/pages/ChatPage';
import CalculatorPage from './components/pages/CalculatorPage';
import OptimizePage from './components/pages/OptimizePage';
import VisualizePage from './components/pages/VisualizePage';
import ReportPage from './components/pages/ReportPage';

const App: React.FC = () => {
    const [activePage, setActivePage] = useState<Page>('home');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

    const handleNavigate = useCallback((page: Page) => {
        setActivePage(page);
    }, []);

    const toggleSidebar = useCallback(() => {
        setIsSidebarOpen(prev => !prev);
    }, []);
    
    const handleAnalysisComplete = useCallback((data: AnalysisData) => {
        setAnalysisData(data);
    }, []);

    const handleClearChat = useCallback(() => {
        setChatMessages([]);
    }, []);

    const renderPage = () => {
        switch (activePage) {
            case 'home':
                return <HomePage onNavigate={handleNavigate} />;
            case 'chat':
                return <ChatPage 
                    onAnalysisComplete={handleAnalysisComplete}
                    messages={chatMessages}
                    setMessages={setChatMessages}
                />;
            case 'calculator':
                return <CalculatorPage />;
            case 'optimize':
                return <OptimizePage initialData={analysisData} />;
            case 'visualize':
                return <VisualizePage initialData={analysisData} />;
            case 'report':
                return <ReportPage hasData={!!analysisData} initialData={analysisData} />;
            default:
                return <HomePage onNavigate={handleNavigate} />;
        }
    };

    return (
        <div className="flex h-screen w-full text-gray-300">
            <Sidebar activePage={activePage} onNavigate={handleNavigate} isOpen={isSidebarOpen} />
            <div className="flex-1 flex flex-col relative">
                <Toolbar onToggleSidebar={toggleSidebar} onClearChat={handleClearChat} />
                <main className="flex-1 overflow-y-auto overflow-x-hidden">
                    {renderPage()}
                </main>
            </div>
        </div>
    );
};

export default App;