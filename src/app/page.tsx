'use client';
import Footer from 'src/components/Footer';
import { useAccount } from 'wagmi';
import LoginButton from '../components/LoginButton';
import SignupButton from '../components/SignupButton';
import ColorSwatch from '../components/ColorSwatch';
import TransactionWrapper from '../components/TransactionWrapper';
import { useState, useEffect } from 'react';
import WalletWrapper from 'src/components/WalletWrapper';

interface Color {
  hexCode: string;
  expandedHex: string;
}

export default function Page() {
  const { address } = useAccount();
  const [colors, setColors] = useState<Color[]>([]);
  const [filteredColors, setFilteredColors] = useState<Color[]>([]);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    // Fetch colors from API
    const fetchColors = async () => {
      const response = await fetch('/api/colors');
      const data = await response.json();
      setColors(data.colors);
      setFilteredColors(data.colors);
      setLastUpdated(new Date(data.lastModified).toLocaleString());
    };

    fetchColors();
  }, []);

  useEffect(() => {
    const filtered = colors.filter(color => 
      color.hexCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      color.expandedHex.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredColors(filtered);
  }, [searchTerm, colors]);

  const openModal = (color: Color) => {
    setSelectedColor(color);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedColor(null);
    setIsModalOpen(false);
  };

  return (
    <div className="flex h-full w-96 max-w-full flex-col px-1 md:w-[1008px]">
      <section className="mt-6 mb-6 flex w-full flex-col md:flex-row">
        <div className="flex w-full flex-row items-center justify-between gap-2 md:gap-0">
          <div className="flex items-center gap-3">
            <SignupButton />
            {!address && <LoginButton />}
          </div>
        </div>
      </section>
      {lastUpdated && (
        <p className="text-sm text-gray-600 mb-4">Last updated: {lastUpdated}</p>
      )}
      <section className="templateSection flex w-full flex-col items-center justify-center gap-4 px-2  md:grow">
        <input
          type="text"
          placeholder="Search colors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-xl"
        />
        <div className="grid grid-cols-2 w-full sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredColors.map((color) => (
            <div key={color.hexCode} className="bg-gray-100 p-5 rounded-xl">
              <ColorSwatch 
                color={color} 
                address={address!} 
                onView={() => openModal(color)}
              />
            </div>
          ))}
        </div>
      </section>
      <Footer />

      {isModalOpen && selectedColor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div 
              className="w-full aspect-square rounded-xl shadow-lg mb-4" 
              style={{ backgroundColor: selectedColor.hexCode }}
            ></div>
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold">{selectedColor.hexCode}</h2>
              <p className="text-lg mt-2">{selectedColor.expandedHex}</p>
            </div>
            <div className="mb-1">
              {address 
                ? (<TransactionWrapper address={address!} color={selectedColor} className="w-full" />) 
                : (<WalletWrapper className="w-full" text="Mint" />)
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
    </div>
  );
}