import { Metadata } from 'next';
import { NEXT_PUBLIC_URL } from '../config';

export const metadata: Metadata = {
  title: 'Base Color Swatch Minting',
  description: 'Mint Base Colors via Swatch',
  openGraph: {
    title: 'Base Color Swatch Mints',
    description: 'Base Color Swatch Mints',
    images: [`${NEXT_PUBLIC_URL}/vibes/vibes-19.png`],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
};