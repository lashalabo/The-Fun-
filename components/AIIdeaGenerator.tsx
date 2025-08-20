
import React, { useState, useCallback } from 'react';
import { generateEventIdeas } from '../services/geminiService';
import { Icon } from './Icon';

interface AIIdeaGeneratorProps {
  onSelectIdea: (idea: { title: string; description: string; category: string }) => void;
}

export const AIIdeaGenerator: React.FC<AIIdeaGeneratorProps> = ({ onSelectIdea }) => {
  const [prompt, setPrompt] = useState('');
  const [ideas, setIdeas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setError(null);
    setIdeas([]);
    try {
      const result = await generateEventIdeas(prompt);
      setIdeas(result);
    } catch (err) {
      setError('Failed to generate ideas. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [prompt]);

  return (
    <div className="p-4 bg-gray-100 dark:bg-dark-surface rounded-lg my-4 border border-brand-purple/20 dark:border-brand-teal/20">
      <div className="flex items-center space-x-2 mb-2">
        <Icon name="sparkles" className="w-6 h-6 text-brand-purple dark:text-brand-teal" />
        <h3 className="text-lg font-bold">Need inspiration?</h3>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Describe the vibe, and our AI will suggest some ideas!</p>
      
      <div className="flex space-x-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., chill Friday night"
          className="flex-grow w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-purple"
          disabled={isLoading}
        />
        <button
          onClick={handleGenerate}
          disabled={isLoading || !prompt.trim()}
          className="px-4 py-2 bg-brand-purple text-white rounded-md font-semibold hover:bg-brand-purple-light disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center dark:bg-brand-teal dark:hover:bg-brand-teal-light"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
          ) : (
            'Generate'
          )}
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      {ideas.length > 0 && (
        <div className="mt-4 space-y-2">
          {ideas.map((idea, index) => (
            <div key={index} className="p-3 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold">{idea.title}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">{idea.description}</p>
              <button
                onClick={() => onSelectIdea(idea)}
                className="text-sm font-bold text-brand-purple dark:text-brand-teal-light mt-2 hover:underline"
              >
                Use this idea
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
