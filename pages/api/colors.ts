import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Set cache control headers
      res.setHeader('Cache-Control', 'public, s-maxage=180, stale-while-revalidate=30');

      const filePath = path.join(process.cwd(), 'public', 'unminted_colors.csv');
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const stats = fs.statSync(filePath);
      const lastModified = stats.mtime;
      const relativeTime = getRelativeTime(lastModified);

      const records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
      });

      const colors = records.map((record: any) => ({
        name: record['HEX CODE'],
        hexCode: record['Expanded HEX'],
      }));

      res.status(200).json({ colors, lastModified: lastModified.toISOString(), relativeTime });
    } catch (error) {
      res.status(500).json({ error: 'Failed to load color data' });
    }
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}