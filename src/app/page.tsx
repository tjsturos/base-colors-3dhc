'use client';
import Footer from 'src/components/Footer';
import { useAccount } from 'wagmi';
import ColorSwatch from '../components/ColorSwatch';
import TransactionWrapper from '../components/TransactionWrapper';
import { useState, useEffect, useCallback, useMemo } from 'react';
import WalletWrapper from 'src/components/WalletWrapper';
import SearchBar from 'src/components/SearchBar';
import Settings from '../components/Settings';
import { useSettings } from '../contexts/SettingsContext';
import LoadingSpinner from 'src/components/LoadingSpinner'; 
import { Press_Start_2P } from 'next/font/google';
import SettingsIcon from 'src/components/SettingsIcon';

const pressStart2P = Press_Start_2P({ 
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

interface Color {
  hexCode: string;
  expandedHex: string;
}

export default function Page() {
  const { address } = useAccount();
  const { recipientAddress, clearRecipientAddress, randomSwatchCount, setRandomSwatchCount } = useSettings();
  const [colors, setColors] = useState<Color[]>([]);
  const [filteredColors, setFilteredColors] = useState<Color[]>([]);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [relativeTime, setRelativeTime] = useState<string | null>(null);
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);
  const [isRandomMode, setIsRandomMode] = useState(false);
  const [isLoadingRandom, setIsLoadingRandom] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [noSearchResults, setNoSearchResults] = useState(false);
  const [randomColor, setRandomColor] = useState<Color | null>(null);

  useEffect(() => {
    // Fetch colors from API
    const fetchColors = async () => {
      try {
        const response = await fetch('/api/colors');
        const data = await response.json();
        setColors(data.colors);
        setFilteredColors(data.colors);
        setLastUpdated(new Date(data.lastModified).toLocaleString());
        setRelativeTime(data.relativeTime);
      } catch (error) {
        console.error('Error fetching colors:', error);
      } finally {
        setIsLoadingComplete(true);
      }
    };

    fetchColors();
  }, []);

  useEffect(() => {
    if (!isRandomMode) {
      const filtered = colors.filter(color => 
        color.hexCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        color.expandedHex.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredColors(filtered);
      setNoSearchResults(filtered.length === 0);
      
      // If no results, set a random color
      if (filtered.length === 0 && colors.length > 0) {
        setRandomColor(colors[Math.floor(Math.random() * colors.length)]);
      } else {
        setRandomColor(null);
      }
    }
  }, [searchTerm, colors, isRandomMode]);

  useEffect(() => {
    if (isLoadingRandom && colors.length > 0) {
      const timer = setTimeout(() => {
        const randomIndexes = new Set<number>();
        while (randomIndexes.size < randomSwatchCount) {
          randomIndexes.add(Math.floor(Math.random() * colors.length));
        }
        const randomColors = Array.from(randomIndexes).map(index => colors[index]);
        setFilteredColors(randomColors);
        setIsRandomMode(true);
        setIsLoadingRandom(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isLoadingRandom, colors, randomSwatchCount]);

  const openModal = (color: Color) => {
    setSelectedColor(color);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedColor(null);
    setIsModalOpen(false);
  };

  const handleRandomColor = useCallback(() => {
    setIsLoadingRandom(true);
    setFilteredColors([]);
    setSearchTerm('');
  }, []);

  const handleClearRandom = () => {
    setFilteredColors(colors);
    setIsRandomMode(false);
    setSearchTerm('');
  };

  const openSettings = () => {
    setIsSettingsOpen(true);
  };

  const closeSettings = () => {
    setIsSettingsOpen(false);
    if (isRandomMode) {
      handleRandomColor();
    }
  };

  const handleUpdateQuantity = () => {
    setIsSettingsOpen(true);
  };

  const handleClearSearch = async () => {
    setIsLoading(true);
    setSearchTerm('');
    // Perform your clear search logic here
    // If you need to fetch new data or update the filteredColors, do it here
    setIsLoading(false);
  };

  return (
    <div 
      className="flex h-full w-96 max-w-full flex-col px-1 md:w-[1008px] relative"
      style={{
        backgroundColor: 'transparent',
      }}
      data-loading-complete={isLoadingComplete.toString()}
    >
      <section className="templateSection flex w-full flex-col items-center justify-center gap-4 px-2  md:grow">
        {relativeTime && (
          <div className="flex items-center justify-between w-full">
            <p className="text-sm text-gray-600 my-4">List last updated: {relativeTime}</p>
            <button
              onClick={openSettings}
              className="flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              <SettingsIcon className="w-4 h-4 mr-1" />
              Settings
            </button>
          </div>
        )}
        {recipientAddress && (
          <div className="flex items-center mb-4">
            <p 
              className="text-sm text-blue-600 cursor-pointer hover:underline mr-2"
              onClick={openSettings}
            >
              Sending Mint(s) to: {recipientAddress}
            </p>
            <button
              onClick={clearRecipientAddress}
              className="text-red-500 hover:text-red-700"
              aria-label="Clear recipient address"
            >
              ✕
            </button>
          </div>
        )}
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onRandomClick={handleRandomColor}
          isRandomMode={isRandomMode}
          onClearRandom={handleClearRandom}
          randomCount={filteredColors.length}
          onUpdateQuantity={handleUpdateQuantity}
          onClearSearch={handleClearSearch}
          isLoading={isLoading}
          noSearchResults={noSearchResults}
        />
        
        {isLoading || !isLoadingComplete ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {noSearchResults && randomColor && (
              <p className="text-gray-600 mb-4 text-center">
                No search results found. But here's a random color:
              </p>
            )}
            <div className={`w-full ${(noSearchResults && randomColor) || filteredColors.length === 1 ? 'flex justify-center' : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6'}`}>
              {(noSearchResults && randomColor ? [randomColor] : filteredColors).map((color) => (
                <div key={color.hexCode} className="bg-gray-100 p-5 rounded-xl">
                  <ColorSwatch 
                    color={color} 
                    address={address!} 
                    onView={() => openModal(color)}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </section>
      <Footer />

      {isModalOpen && selectedColor && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          onClick={closeModal} // Close modal when clicking on the overlay
        >
          <div 
            className="bg-white p-6 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            <div 
              className="w-full aspect-square rounded-xl shadow-lg mb-4" 
              style={{ backgroundColor: selectedColor.hexCode }}
            ></div>
            <div className="text-center mb-4">
              <h2 className={`text-2xl font-bold ${pressStart2P.className}`}>{selectedColor.hexCode.replace('#', '')}</h2>
              <p className="text-lg mt-2">{selectedColor.expandedHex}</p>
            </div>
            <div className="mb-1 w-full modal-button-override">
              {address 
                ? (<TransactionWrapper address={address!} color={selectedColor} className="w-full" />) 
                : (<WalletWrapper 
                    className="w-full" 
                    text="Log in"
                  />)
              }
            </div>
            <button 
              onClick={closeModal}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {isSettingsOpen && (
        <Settings
          onClose={closeSettings}
          randomSwatchCount={randomSwatchCount}
          setRandomSwatchCount={setRandomSwatchCount}
        />
      )}
    </div>
  );
}