import React from 'react';
import type { BannerCard as BannerCardType } from '../../../data/problemsMockData';

interface BannerCardProps {
  card: BannerCardType;
}

const BannerCard: React.FC<BannerCardProps> = ({ card }) => {
  return (
    <div
      className={`relative bg-gradient-to-r ${card.bgGradient} rounded-xl p-4 h-32 flex flex-col justify-between overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300`}
    >
      <div className="z-10">
        <h3 className="text-white text-lg font-bold mb-0.5">{card.title}</h3>
        <p className="text-white text-sm opacity-90">{card.subtitle}</p>
      </div>

      <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3 text-white text-xl font-bold">
        DAY<br />30
      </div>

      <button className="z-10 bg-white text-gray-800 px-4 py-1.5 text-sm rounded-lg font-semibold hover:bg-gray-100 transition-colors w-fit">
        {card.buttonText}
      </button>
    </div>
  );
};

export default BannerCard;

