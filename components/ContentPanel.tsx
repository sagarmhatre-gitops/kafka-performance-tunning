import React, { useState } from 'react';
import { CommandBuilder } from './CommandBuilder.js';
import { BookOpenIcon, BugAntIcon } from './Icons.js';

const TabButton = ({ label, icon, isActive, onClick }) => (
    React.createElement('button', {
        onClick: onClick,
        className: `flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
            isActive
                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50'
        }`
    },
        icon,
        label
    )
);

export const ContentPanel = ({ view }) => {
    const [activeTab, setActiveTab] = useState('guide');
    
    return (
        React.createElement('div', { className: "space-y-8" },
            React.createElement('header', null,
                React.createElement('h1', { className: "text-3xl font-bold flex items-center gap-3" },
                    React.createElement('span', { className: "text-4xl" }, view.emoji),
                    view.title
                ),
                React.createElement('p', { className: "mt-2 text-lg text-gray-500 dark:text-gray-400" }, view.description)
            ),
            
            React.createElement('div', { className: "border-b border-gray-200 dark:border-gray-700" },
                React.createElement('div', { className: "flex items-center gap-2" },
                    React.createElement(TabButton, { label: "Guide", icon: React.createElement(BookOpenIcon, { className: "w-5 h-5" }), isActive: activeTab === 'guide', onClick: () => setActiveTab('guide') }),
                    React.createElement(TabButton, { label: "Failure Cases", icon: React.createElement(BugAntIcon, { className: "w-5 h-5" }), isActive: activeTab === 'failure', onClick: () => setActiveTab('failure') })
                )
            ),

            React.createElement('div', null,
                activeTab === 'guide' && (
                    React.createElement(CommandBuilder, { 
                        config: view.content.commandBuilder,
                    })
                ),

                activeTab === 'failure' && (
                    React.createElement('div', { className: "space-y-6" },
                        view.content.failureCases.map((fc, index) => (
                            React.createElement('div', { key: index, className: "bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm" },
                                React.createElement('h3', { className: "font-semibold text-red-600 dark:text-red-400 font-mono text-sm" }, fc.error),
                                React.createElement('div', { className: "mt-3 text-sm space-y-3" },
                                    React.createElement('p', null, React.createElement('strong', { className: "text-gray-700 dark:text-gray-300" }, 'Cause:'), ' ', fc.cause),
                                    React.createElement('p', null, React.createElement('strong', { className: "text-gray-700 dark:text-gray-300" }, 'Resolution:'), ' ', fc.resolution)
                                )
                            )
                        ))
                    )
                )
            )
        )
    );
};