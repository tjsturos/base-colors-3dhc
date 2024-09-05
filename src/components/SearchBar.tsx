import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onRandomClick: () => void;
  isRandomMode: boolean;
  onClearRandom: () => void;
  randomCount: number;
  onUpdateQuantity: () => void;
  onClearSearch: () => Promise<void>;
  isLoading: boolean;
  noSearchResults: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  setSearchTerm,
  onRandomClick,
  isRandomMode,
  onClearRandom,
  randomCount,
  onUpdateQuantity,
  onClearSearch,
  isLoading,
  noSearchResults,
}) => {

  const handleClearSearch = async () => {
    await onClearSearch();
  };

  return (
    <div className="w-full max-w-md mb-4">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search colors..."
          className="w-full p-2 pr-24 border rounded-lg"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
          <button
            onClick={isRandomMode ? onClearRandom : onRandomClick}
            className="text-blue-500 hover:text-blue-700 px-2 py-1 text-sm"
          >
            {isRandomMode ? "Clear Random" : "Random"}
          </button>
          <button
            onClick={handleClearSearch}
            disabled={!searchTerm || isLoading} // Use isLoading to disable the button
            className={`px-2 py-1 text-sm ${
              searchTerm && !isLoading // Use isLoading to determine button color
                ? 'text-red-500 hover:text-red-700'
                : 'text-gray-300 cursor-not-allowed'
            }`}
          >
            Clear
          </button>
        </div>
      </div>
      {isRandomMode && (
        <div className="mt-2 flex items-center justify-center space-x-2">
          <p className="text-sm text-gray-600">
            Showing {randomCount} Random Swatches
          </p>
          <button
            onClick={onUpdateQuantity}
            className="text-blue-500 hover:underline text-sm"
          >
            Update Quantity
          </button>
        </div>
      )}
      {isLoading && (
        <div className="mt-4 flex justify-center">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};

export default SearchBar;