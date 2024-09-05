import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { Color } from 'src/constants';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { colors }: { colors: Color[] } = req.body;

  if (!colors) {
    return res.status(400).json({ message: 'Color is required' });
  }

  const csvFilePath = path.join(process.cwd(), 'public', 'unminted_colors.csv');

  try {
    // Read the CSV file
    let csvContent = await fs.promises.readFile(csvFilePath, 'utf-8');

    // Remove the color from the CSV content
    const lines = csvContent.split('\n');
    const updatedLines = lines.filter(line => !colors.some(color => line.includes(color.hexCode)));
    
    if (updatedLines.length < lines.length) {
      const updatedContent = updatedLines.join('\n');
      await fs.promises.writeFile(csvFilePath, updatedContent, 'utf-8');
    } else {
      console.log('No changes found, file not updated');
    }

    res.status(200).json({ message: 'Color removed successfully' });
  } catch (error) {
    console.error('Error removing color from CSV:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}