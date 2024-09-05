'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { Address } from 'viem';
import { resolveEnsName } from 'src/utils';

interface SettingsProps {
  onClose: () => void;
  randomSwatchCount: number;
  setRandomSwatchCount: (count: number) => void;
}

export default function Settings({ onClose, randomSwatchCount, setRandomSwatchCount }: SettingsProps) {
  const { recipientAddress, setRecipientAddress, clearRecipientAddress } = useSettings();
  const [localSwatchCount, setLocalSwatchCount] = useState(randomSwatchCount);
  const [recipient, setRecipient] = useState<Address | ''>(recipientAddress || '');
  const [error, setError] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const recipientInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setLocalSwatchCount(randomSwatchCount);
  }, [randomSwatchCount]);

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

  useEffect(() => {
    if (recipientInputRef.current) {
      recipientInputRef.current.focus();
    }
  }, []);

  const isValidEthereumAddress = (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const handleSave = async () => {
    if (localSwatchCount === randomSwatchCount && recipient === recipientAddress) {
      // No changes, skip saving
      onClose();
      return;
    }
    setIsSaving(true);
    if (localSwatchCount > 0) {
      setRandomSwatchCount(localSwatchCount);
    }

    if (recipient && !isValidEthereumAddress(recipient) && recipient.endsWith('.eth')) {
      const resolvedAddress = await resolveEnsName(recipient);

      if (isValidEthereumAddress(resolvedAddress as Address)) {
        setRecipientAddress(resolvedAddress as Address);
      } else {
        setError('Please enter a valid Ethereum address or ENS name');
        setIsSaving(false);
        return;
      }
    } else if (recipient && !isValidEthereumAddress(recipient)) {
      setError('Please enter a valid Ethereum address or ENS name');
      setIsSaving(false);
      return;
    }

    setRecipientAddress(recipient || null);
    setIsSaving(false);
    onClose();
  };

  const handleRecipientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecipient(e.target.value as Address);
    setError('');
  };

  const handleClear = () => {
    setRecipient('');
    clearRecipientAddress();
    setError('');
  };

  const handleRandomSwatchCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value, 10);
    if (!isNaN(count) && count > 0) {
      setLocalSwatchCount(count);
    }
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
                ref={recipientInputRef}
                type="text"
                value={recipient}
                onChange={handleRecipientChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSave();
                  }
                }}
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
          <label htmlFor="randomSwatchCount" className="block text-sm font-medium text-gray-700">
            Random Swatch Count
          </label>
          <input
            type="number"
            id="randomSwatchCount"
            value={localSwatchCount}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSave();
              }
            }}
            onChange={handleRandomSwatchCountChange}
            min="1"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-xl"
          >
            Cancel
          </button>
          <button
            disabled={isSaving}
            onClick={handleSave}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}