'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useSettings } from 'src/contexts/SettingsContext';

interface SettingsProps {
  onClose: () => void;
}

export default function Settings({ onClose }: SettingsProps) {
  const { recipientAddress, setRecipientAddress, clearRecipientAddress } = useSettings();
  const { randomSwatchCount, setRandomSwatchCount } = useSettings();
  const [recipient, setRecipient] = useState(recipientAddress || '');
  const [error, setError] = useState('');
  const [swatchCount, setSwatchCount] = useState(randomSwatchCount);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const isValidEthereumAddress = (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const handleSave = () => {
    if (recipient && !isValidEthereumAddress(recipient)) {
      setError('Please enter a valid Ethereum address');
      return;
    }

    setRecipientAddress(recipient || null);
    setRandomSwatchCount(swatchCount);
    onClose();
  };

  const handleRecipientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecipient(e.target.value);
    setError('');
  };

  const handleClear = () => {
    setRecipient('');
    clearRecipientAddress();
    setError('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-white p-6 rounded-xl max-w-md w-full">
        <h2 className="text-2xl font-bold font-sans mb-4">Settings</h2>
        <div className="mb-4">
          <label className="block mb-2">
            Recipient Address:
            <div className="flex items-center">
              <input
                type="text"
                value={recipient}
                onChange={handleRecipientChange}
                className={`flex-grow p-2 border rounded mt-1 ${error ? 'border-red-500' : ''}`}
                placeholder="Enter Ethereum address"
              />
              {recipient && (
                <button
                  onClick={handleClear}
                  className="ml-2 text-red-500 hover:text-red-700"
                  aria-label="Clear recipient address"
                >
                  ✕
                </button>
              )}
            </div>
          </label>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
        <div className="mb-4">
          <label className="block mb-2">
            Random Swatch Count:
            <input
              type="number"
              value={swatchCount}
              onChange={(e) => setSwatchCount(Number(e.target.value))}
              className="w-full p-2 border rounded mt-1"
              min="1"
              max="100"
            />
          </label>
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-xl mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-xl"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}