import React from 'react';
import { BEST_PRACTICES_DATA } from '../constants.js';
import { LightBulbIcon } from './Icons.js';

const colorClasses = {
    indigo: {
        bg: 'bg-indigo-50 dark:bg-indigo-900/30',
        border: 'border-indigo-200 dark:border-indigo-800',
        text: 'text-indigo-800 dark:text-indigo-200',
        iconContainer: 'bg-indigo-100 dark:bg-indigo-900',
    },
    purple: {
        bg: 'bg-purple-50 dark:bg-purple-900/30',
        border: 'border-purple-200 dark:border-purple-800',
        text: 'text-purple-800 dark:text-purple-200',
        iconContainer: 'bg-purple-100 dark:bg-purple-900',
    },
    pink: {
        bg: 'bg-pink-50 dark:bg-pink-900/30',
        border: 'border-pink-200 dark:border-pink-800',
        text: 'text-pink-800 dark:text-pink-200',
        iconContainer: 'bg-pink-100 dark:bg-pink-900',
    },
    green: {
        bg: 'bg-green-50 dark:bg-green-900/30',
        border: 'border-green-200 dark:border-green-800',
        text: 'text-green-800 dark:text-green-200',
        iconContainer: 'bg-green-100 dark:bg-green-900',
    },
};

const BestPracticeCard = ({ practice }) => {
    const colors = colorClasses[practice.color];

    return (
        React.createElement('div', { className: `rounded-xl p-6 shadow-sm border ${colors.bg} ${colors.border}` },
            React.createElement('div', { className: "flex items-center gap-4 mb-4" },
                 React.createElement('div', { className: `w-12 h-12 rounded-lg flex items-center justify-center ${colors.iconContainer} ${colors.text}` },
                    practice.icon
                ),
                React.createElement('h3', { className: `text-xl font-bold ${colors.text}` }, practice.category)
            ),
            React.createElement('ul', { className: "space-y-3" },
                practice.points.map((point, index) => (
                    React.createElement('li', { key: index, className: "flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300" },
                        React.createElement('span', { className: `flex-shrink-0 mt-1 w-1.5 h-1.5 rounded-full ${colors.text.replace('text-', 'bg-')}` }),
                        React.createElement('span', null, point)
                    )
                ))
            )
        )
    );
};


export const BestPracticesGuide = () => {
    return (
        React.createElement('div', { className: "space-y-8" },
            React.createElement('header', null,
                React.createElement('h1', { className: "text-3xl font-bold flex items-center gap-3" },
                    React.createElement(LightBulbIcon, { className: "w-8 h-8 text-yellow-400" }),
                    'Production Best Practices'
                ),
                React.createElement('p', { className: "mt-2 text-lg text-gray-500 dark:text-gray-400" },
                    'Key recommendations for running a healthy, reliable, and performant Kafka cluster in production.'
                )
            ),

            React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-6" },
                BEST_PRACTICES_DATA.map(practice => (
                    React.createElement(BestPracticeCard, { key: practice.category, practice: practice })
                ))
            )
        )
    );
};