


import React, { useMemo } from 'react';
import { imageKitService } from '../../../services/ImageKitService';
import { ContestState } from '../../../types/contest-info';

// const getContestThumbnail = (thumbnailKey) => {
//   if (thumbnailKey) {
//     console.log("dont sho", imageKitService.getProfileImageUrl(thumbnailKey, 400, 200, { radius: '8' }));
//     return imageKitService.getProfileImageUrl(thumbnailKey, 400, 200, { radius: '8' });
//   }

//   return '/default-contest-thumbnail.jpg';
// };


const getStateColor = (state) => {
  switch (state) {
    case ContestState.UPCOMING:
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case ContestState.REGISTRATION_OPEN:
      return 'bg-green-100 text-green-800 border-green-200';
    case ContestState.ACTIVE:
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case ContestState.ENDED:
      return 'bg-red-100 text-red-800 border-red-200';
    case ContestState.RESULTS_PUBLISHED:
      return 'bg-purple-100 text-purple-800 border-purple-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStateIcon = (state) => {
  switch (state) {
    case ContestState.REGISTRATION_OPEN:
      return <i className="fas fa-check-circle w-4 h-4" />;
    case ContestState.ACTIVE:
      return <i className="fas fa-clock w-4 h-4" />;
    case ContestState.ENDED:
    case ContestState.RESULTS_PUBLISHED:
      return <i className="fas fa-trophy w-4 h-4" />;
    default:
      return <i className="fas fa-calendar w-4 h-4" />;
  }
};

const ContestHeader = ({ contest }) => {

  const thumbnailUrl = useMemo(() => {
    if (contest.thumbnail) {
      console.log("Computing thumbnail URL");
      return imageKitService.getProfileImageUrl(contest.thumbnail, 400, 200, { radius: '8' });
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
              <span className="text-sm bg-black bg-opacity-20 px-2 py-1 rounded">
                Contest #{contest.contestNumber}
              </span>
              <span className={`text-xs px-2 py-1 rounded border flex items-center gap-1 ${getStateColor(contest.state)}`}>
                {getStateIcon(contest.state)}
                {contest.state.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-2">{contest.title}</h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContestHeader;