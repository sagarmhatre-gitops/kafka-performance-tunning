import React from 'react';
import { TUNING_STEPS_DATA, COMMON_OPERATIONS_DATA } from '../constants.js';
import { SunIcon, MoonIcon, CommandLineIcon, LightBulbIcon } from './Icons.js';

const NavLink = ({ id, icon, title, isActive, onClick }) => (
    React.createElement('a', {
        href: `#${id}`,
        onClick: (e) => { e.preventDefault(); onClick(id); },
        className: `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
            isActive
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`
    },
        React.createElement('span', { className: "w-6 h-6 flex items-center justify-center text-sm" }, icon),
        React.createElement('span', null, title)
    )
);

export const Sidebar = ({ activeViewId, onSelectView, theme, toggleTheme }) => {
    return (
        React.createElement('aside', { className: "w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-screen" },
            React.createElement('div', { className: "px-4 py-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center" },
                React.createElement('div', { className: "flex items-center gap-2" },
                    React.createElement(CommandLineIcon, { className: "w-7 h-7 text-purple-600 dark:text-purple-400" }),
                    React.createElement('div', null,
                        React.createElement('h1', { className: "text-lg font-bold" }, 'Kafka Guide'),
                        React.createElement('p', { className: "text-xs text-gray-500 dark:text-gray-400" }, 'Interactive CLI Assistant')
                    )
                ),
                 React.createElement('button', { onClick: toggleTheme, 'aria-label': "Toggle theme", className: "p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" },
                    theme === 'light' ? React.createElement(MoonIcon, { className: "w-5 h-5" }) : React.createElement(SunIcon, { className: "w-5 h-5" })
                )
            ),
            
            React.createElement('nav', { className: "flex-1 p-4 space-y-6 overflow-y-auto" },
                React.createElement('div', null,
                    React.createElement('h2', { className: "text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3" }, 'Tuning Guide'),
                    React.createElement('div', { className: "space-y-1" },
                        TUNING_STEPS_DATA.map(step => (
                            React.createElement(NavLink, {
                                key: step.id,
                                id: step.id,
                                icon: step.emoji,
                                title: step.title,
                                isActive: activeViewId === step.id,
                                onClick: onSelectView
                            })
                        ))
                    )
                ),
                 React.createElement('div', null,
                    React.createElement('h2', { className: "text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3" }, 'Common Operations'),
                    React.createElement('div', { className: "space-y-1" },
                        COMMON_OPERATIONS_DATA.map(op => (
                            React.createElement(NavLink, {
                                key: op.id,
                                id: op.id,
                                icon: op.emoji,
                                title: op.title,
                                isActive: activeViewId === op.id,
                                onClick: onSelectView
                            })
                        ))
                    )
                ),
                React.createElement('div', null,
                    React.createElement('h2', { className: "text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3" }, 'Resources'),
                     React.createElement('div', { className: "space-y-1" },
                         React.createElement(NavLink, {
                            id: "best-practices",
                            icon: React.createElement(LightBulbIcon, { className: "w-4 h-4 text-yellow-500" }),
                            title: "Best Practices",
                            isActive: activeViewId === 'best-practices',
                            onClick: onSelectView
                        })
                    )
                )
            ),

            React.createElement('div', { className: "px-4 py-4 border-t border-gray-200 dark:border-gray-700" },
                React.createElement('p', { className: "text-xs text-gray-500 dark:text-gray-400 text-center" },
                    'Created by: Sagar V Mhatre'
                )
            )
        )
    );
};