import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const filePath = path.join(process.cwd(), 'public', 'unminted_colors.csv');
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const stats = fs.statSync(filePath);
      const lastModified = stats.mtime.toISOString();

      const records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
      });

      const colors = records.map((record: any) => ({
        hexCode: record['HEX CODE'],
        expandedHex: record['Expanded HEX'],
      }));

      res.status(200).json({ colors, lastModified });
    } catch (error) {
      res.status(500).json({ error: 'Failed to load color data' });
    }
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}