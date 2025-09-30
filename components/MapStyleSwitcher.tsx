import React, { useState } from 'react';
import { Icon } from './Icon';

// --- THIS IS THE FIX ---
// This object now includes ALL the map styles we have created,
// correctly categorized into 'light' and 'dark' themes.
export const mapThemes = {
    light: [
        { id: 'vintage', name: 'Vintage', icon: 'map' },
        { id: 'peach', name: 'Seoul Peach', icon: 'moon' },
        { id: 'sepia', name: 'Sepia', icon: 'sun' },
        { id: 'blackAndWhiteLight', name: 'Grayscale', icon: 'map' },
    ],
    dark: [
        { id: 'cyberpunk', name: 'Cyberpunk', icon: 'moon' },
        { id: 'blackAndWhiteDark', name: 'Noire', icon: 'map' },
    ],
};

interface MapStyleSwitcherProps {
    currentThemeMode: 'light' | 'dark';
    activeStyleId: string;
    onStyleChange: (styleId: string) => void;
}

export const MapStyleSwitcher: React.FC<MapStyleSwitcherProps> = ({
    currentThemeMode,
    activeStyleId,
    onStyleChange,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const availableThemes = mapThemes[currentThemeMode];
    const activeTheme = availableThemes.find(t => t.id === activeStyleId) || availableThemes[0];

    const handleSelect = (styleId: string) => {
        onStyleChange(styleId);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 bg-gray-200/80 dark:bg-dark-surface/80 backdrop-blur-sm p-2 rounded-full shadow-md"
            >
                <Icon name={activeTheme.icon as any} className="w-5 h-5" />
                <span className="text-sm font-semibold">{activeTheme.name}</span>
                <Icon name="chevron-down" className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 w-48 bg-white dark:bg-dark-surface rounded-lg shadow-xl overflow-hidden">
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {availableThemes.map((theme) => (
                            <li key={theme.id}>
                                <button
                                    onClick={() => handleSelect(theme.id)}
                                    className={`w-full text-left px-4 py-3 flex items-center space-x-3 transition-colors ${activeStyleId === theme.id ? 'bg-brand-purple/10 text-brand-purple dark:bg-brand-teal/10 dark:text-brand-teal' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                                >
                                    <Icon name={theme.icon as any} className="w-5 h-5" />
                                    <span className="font-semibold">{theme.name}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

