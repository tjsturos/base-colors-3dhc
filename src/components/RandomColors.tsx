import React from 'react';

interface RandomColorsProps {
  colors: string[];
}

const RandomColors: React.FC<RandomColorsProps> = ({ colors }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
      {colors.map((color, index) => (
        <div key={index} className="flex flex-col items-center">
          <div
            className="w-20 h-20 rounded-xl shadow-md"
            style={{ backgroundColor: color }}
          ></div>
          <span className="mt-2 text-sm">{color}</span>
        </div>
      ))}
    </div>
  );
};

export default RandomColors;
