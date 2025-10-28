import React from 'react';
import type { BannerCard as BannerCardType } from '../../../data/problemsMockData';

interface BannerCardProps {
  card: BannerCardType;
}

const BannerCard: React.FC<BannerCardProps> = ({ card }) => {
  return (
    <div
      className="relative rounded-xl h-32 overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300"
    >
      <img 
        src={card.bannerurl} 
        alt="Banner"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
    </div>
  );
};

export default BannerCard;

