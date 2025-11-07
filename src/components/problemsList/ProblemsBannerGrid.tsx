import React from 'react';
import BannerCard from './BannerCard';
import type { BannerCard as BannerCardType } from '../../data/problemsMockData';

type ProblemsBannerGridProps = {
    banners: BannerCardType[];
};

const ProblemsBannerGrid: React.FC<ProblemsBannerGridProps> = ({ banners }) => (
    <div className="grid grid-cols-4 gap-4 mb-6">
        {banners.map(card => (
            <BannerCard key={card.id} card={card} />
        ))}
    </div>
);

export default ProblemsBannerGrid;
