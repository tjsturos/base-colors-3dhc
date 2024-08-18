import React from 'react';
import { useSettings } from 'src/contexts/SettingsContext';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onRandomClick: () => void;
  isRandomMode: boolean;
  onClearRandom: () => void;
  randomCount: number;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  setSearchTerm,
  onRandomClick,
  isRandomMode,
  onClearRandom,
  randomCount
}) => {
  const { randomSwatchCount } = useSettings();

  return (
    <div className="w-full max-w-md mb-4">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search colors..."
          className="w-full p-2 pr-20 border rounded-lg"
        />
        <button
          onClick={onRandomClick}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-700 px-4 py-1 text-lg"
        >
          Random
        </button>
      </div>
      {isRandomMode && (
        <div className="mt-2 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {randomCount} Random Swatches
          </p>
          <button
            onClick={onClearRandom}
            className="text-red-500 hover:text-red-700"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;