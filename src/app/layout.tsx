'use client';

import { useState, useEffect } from 'react';
import './global.css';
import '@coinbase/onchainkit/styles.css';
import '@rainbow-me/rainbowkit/styles.css';
import dynamic from 'next/dynamic';
import Header from 'src/components/Header';

import { SettingsProvider } from 'src/contexts/SettingsContext';
import { CartProvider } from 'src/contexts/CartContext';
import { ColorsProvider } from 'src/contexts/ColorsContext';
import MintCart from 'src/components/MintCart';
import Image from 'next/image';
import threedhcLogo from 'src/app/threedhc-logo.png';

const OnchainProviders = dynamic(
  () => import('src/components/OnchainProviders'),
  {
    ssr: false,
  },
);

// Combine all preset palettes into one large palette
const COMBINED_PALETTE = [
  '#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6',
  '#1abc9c', '#3498db', '#34495e', '#f1c40f', '#e74c3c',
  '#2c3e50', '#e67e22', '#ecf0f1', '#3498db', '#2980b9',
  '#16a085', '#27ae60', '#2980b9', '#8e44ad', '#f39c12',
  '#d35400', '#c0392b', '#bdc3c7', '#7f8c8d', '#2c3e50'
];

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  const [currentColor, setCurrentColor] = useState(COMBINED_PALETTE[0]);
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [opacity3DHC, setOpacity3DHC] = useState(0);

  useEffect(() => {
    setIsClient(true);
    const randomIndex = Math.floor(Math.random() * COMBINED_PALETTE.length);
    setCurrentColor(COMBINED_PALETTE[randomIndex]);

    let intervalId: NodeJS.Timeout | null = null;
    let fadeIntervalId: NodeJS.Timeout | null = null;

    if (!isLoadingComplete) {
      intervalId = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * COMBINED_PALETTE.length);
        setCurrentColor(COMBINED_PALETTE[randomIndex]);
      }, 1500); // Change color every 1.5 seconds

      // Add fade effect for 3DHC logo
      fadeIntervalId = setInterval(() => {
        setOpacity3DHC((prevOpacity) => (prevOpacity === 0.75 ? 1 : 0.75));
      }, 500); // Fade in/out every 2 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (fadeIntervalId) clearInterval(fadeIntervalId);
    };
  }, [isLoadingComplete]);

  useEffect(() => {
    const checkLoadingComplete = () => {
      const pageElement = document.querySelector('[data-loading-complete="true"]');
      if (pageElement) {
        setIsLoadingComplete(true);
      }
    };

    const observer = new MutationObserver(checkLoadingComplete);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return (
    <html lang="en">
      <head>
        <title>Base Colors - 3DHC</title>
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />
      </head>
      <body className="flex flex-col min-h-screen bg-[#fafafa]">
        <ColorsProvider>
          <SettingsProvider>
            <CartProvider>
              <OnchainProviders>
                <Header />
                <main className="flex-grow flex items-center justify-center">
                  {children}
                </main>
                <MintCart />
              </OnchainProviders>
              {/* Loading overlay */}
              {!isLoadingComplete && isClient && (
                <div
                  className="fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-500"
                  style={{
                    backgroundColor: 'white',
                    opacity: 1,
                    transition: 'opacity 0.5s ease-in-out'
                  }}
                >
                  <div
                    className="loading-swatch rounded-xl shadow-lg w-32 h-32 mb-5"
                    style={{ backgroundColor: currentColor }}
                  ></div>
                  <div className="flex flex-col items-center">
                    <Image src="/base-colors.avif" alt="Base Colors Logo" width={300} height={100} />
                    <Image 
                      src={threedhcLogo} 
                      alt="3DHC Logo" 
                      width={200} 
                      height={67} 
                      className="mt-4 transition-opacity duration-1000"
                      style={{ opacity: opacity3DHC }}
                    />
                  </div>
                </div>
              )}
            </CartProvider>
          </SettingsProvider>
        </ColorsProvider>
      </body>
    </html>
  );
}