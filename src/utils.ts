import { Alchemy, Network } from "alchemy-sdk";
import { Color } from "./constants";

const config = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(config);

export const resolveEnsName = async (ensName: string) => {
  return await alchemy.core.resolveName(ensName);
};

export const getSillySaying = () => {
  const sayings = [
    "Get More Dopamine",
    "Try it, I dare ya!",
    "Give it another whirl!",
    "One more time, champ!",
    "Let's roll the dice again!",
    "Round two, here we go!",
    "Encore, encore!",
    "Take two, action!",
    "Rewind and press play!",
    "Second verse, same as first!",
    "Once more, with feeling!",
    "Double the fun, retry!",
    "Remix time, hit it!",
    "Bonus round activated!",
    "Retry for extra points!",
    "New attempt, new adventure!",
    "Reload and fire away!",
    "Mulligan granted, tee up!",
    "Respawn in 3... 2... 1...",
    "Plot twist: Try again!",
    "Instant replay, let's go!",
    "Reboot and try again!",
  ];
  return sayings[Math.floor(Math.random() * sayings.length)];
};

export function isHexCode(hex: string): boolean {
  return /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
}

export function getClosest3DigitHex(inputHex: string, colors: Color[]): Color[] {
  // Convert input hex to RGB
  const inputRGB = hexToRgb(inputHex);

  if (!inputRGB) {
    return [];
  }

  let closestHexes = [];

  // Iterate through the provided colors
  for (const color of colors) {
    const rgb = hexToRgb(color.hexCode);
    if (rgb) {
      const difference = colorDifferenceRedmean(inputRGB, rgb);
      closestHexes.push({ hexCode: color.hexCode, name: color.name, difference });
    }
  }

  // Sort the colors by difference and get the top 10
  closestHexes.sort((a, b) => a.difference - b.difference);
  const top10 = closestHexes.slice(0, 10);

  return top10.map(item => ({ hexCode: item.hexCode, name: item.name } as Color));
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}


function colorDifferenceRedmean(color1: { r: number; g: number; b: number }, 
                                color2: { r: number; g: number; b: number }): number {
  const rMean = (color1.r + color2.r) / 2;
  const r = color1.r - color2.r;
  const g = color1.g - color2.g;
  const b = color1.b - color2.b;
  
  return Math.sqrt(
    (2 + rMean / 256) * r * r +
    4 * g * g +
    (2 + (255 - rMean) / 256) * b * b
  );
}
