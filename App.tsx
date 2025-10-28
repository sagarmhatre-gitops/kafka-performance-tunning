import React, { useState, useEffect, useCallback } from 'react';
import { TUNING_STEPS_DATA, COMMON_OPERATIONS_DATA } from './constants.js';
import { Sidebar } from './components/Sidebar.js';
import { ContentPanel } from './components/ContentPanel.js';
import { BestPracticesGuide } from './components/BestPracticesGuide.js';
import { ArrowUpIcon } from './components/Icons.js';

const App = () => {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined' && window.localStorage) {
            const storedTheme = window.localStorage.getItem('theme');
            if (storedTheme) return storedTheme;
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return 'light';
    });
    
    const [activeViewId, setActiveViewId] = useState(TUNING_STEPS_DATA[0].id);
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const handleScroll = useCallback(() => {
        const mainPanel = document.getElementById('main-content-panel');
        if (mainPanel) {
            setShowScrollTop(mainPanel.scrollTop > 300);
        }
    }, []);
    
    const scrollToTop = () => {
        document.getElementById('main-content-panel')?.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const allViews = [...TUNING_STEPS_DATA, ...COMMON_OPERATIONS_DATA];
    const activeViewData = allViews.find(view => view.id === activeViewId);

    const renderContent = () => {
        if (activeViewId === 'best-practices') {
            return React.createElement(BestPracticesGuide);
        }
        if (activeViewData) {
            return React.createElement(ContentPanel, { key: activeViewId, view: activeViewData });
        }
        return (
             React.createElement('div', { className: "text-center p-8" },
                React.createElement('h1', { className: "text-2xl font-bold" }, 'Welcome'),
                React.createElement('p', { className: "mt-2 text-gray-500" }, 'Select a topic from the sidebar to begin.')
            )
        );
    };

    return (
        React.createElement('div', { className: "flex h-screen w-full bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100" },
            React.createElement(Sidebar, {
                activeViewId: activeViewId,
                onSelectView: setActiveViewId,
                theme: theme,
                toggleTheme: toggleTheme
            }),
            React.createElement('main', { 
                id: "main-content-panel",
                className: "flex-1 overflow-y-auto relative",
                onScroll: handleScroll
            },
                React.createElement('div', { className: "container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8" },
                   renderContent()
                ),
                 React.createElement('button', {
                    onClick: scrollToTop,
                    'aria-label': "Scroll to top",
                    className: `fixed bottom-6 right-6 w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center ${showScrollTop ? 'opacity-100 pointer-events-auto scale-100' : 'opacity-0 pointer-events-none scale-90'}`
                },
                    React.createElement(ArrowUpIcon, { className: "w-6 h-6" })
                )
            )
        )
    );
};

export default App;