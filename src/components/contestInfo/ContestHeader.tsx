

import { useMemo } from 'react';
import { imageKitService } from '../../services/ImageKitService';
import type { ContestDTO } from '../../types/contest.dto';

interface ContestHeaderProps {
  contest: ContestDTO;
}

const ContestHeader = ({ contest }: ContestHeaderProps) => {

  const thumbnailUrl = useMemo(() => {
    if (contest.thumbnail) {
      return imageKitService.getProfileImageUrl(contest.thumbnail, 400, 200, { radius: 8 });
    }
    return '/default-contest-thumbnail.jpg';
  }, [contest.thumbnail]);


  return (

    <>
      <div className="relative w-full h-64">
        <img
          src={thumbnailUrl}
          alt={contest.title}
          className="w-full h-64 object-cover"
        />

        <div className="absolute inset-0  flex items-end">
          <div className="p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
            </div>
            <h1 className="text-3xl font-bold mb-2">{contest.title}</h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContestHeader;