import React, { useState, useEffect } from 'react';
import { ClipboardIcon, ClipboardCheckIcon } from './Icons.js';

export const CommandBuilder = ({ config }) => {
    const initialParams = Object.fromEntries(config.fields.map(field => [field.id, field.defaultValue]));
    
    const [params, setParams] = useState(initialParams);
    const [generatedCommand, setGeneratedCommand] = useState(config.template(params));
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const newCommand = config.template(params);
        setGeneratedCommand(newCommand);
    }, [params, config.template]);

    const handleParamChange = (id, value) => {
        setParams(prev => ({ ...prev, [id]: value }));
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedCommand);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        React.createElement('div', { className: "bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm" },
            React.createElement('h3', { className: "text-lg font-semibold mb-4" }, 'Command Builder'),
            React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-6" },
                config.fields.map(field => (
                    React.createElement('div', { key: field.id },
                        React.createElement('label', { htmlFor: field.id, className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" },
                            field.label
                        ),
                        React.createElement('input', {
                            type: field.type || 'text',
                            id: field.id,
                            value: params[field.id],
                            onChange: (e) => handleParamChange(field.id, e.target.value),
                            placeholder: field.placeholder,
                            className: "w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-sm"
                        })
                    )
                ))
            ),
            React.createElement('div', null,
                React.createElement('label', { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" },
                    'Generated Command'
                ),
                React.createElement('div', { className: "bg-gray-900 rounded-xl overflow-hidden relative" },
                    React.createElement('button', { 
                        onClick: handleCopy, 
                        className: "absolute top-3 right-3 px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-md transition-colors flex items-center gap-1.5",
                        'aria-label': "Copy command"
                    },
                        copied ? React.createElement(ClipboardCheckIcon, { className: "w-4 h-4 text-green-400" }) : React.createElement(ClipboardIcon, { className: "w-4 h-4" }),
                        copied ? 'Copied' : 'Copy'
                    ),
                    React.createElement('pre', { className: "p-4 overflow-x-auto text-sm text-gray-200 font-mono" },
                        React.createElement('code', null, generatedCommand)
                    )
                )
            )
        )
    );
};