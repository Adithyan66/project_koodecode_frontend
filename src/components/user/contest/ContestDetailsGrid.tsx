

// src/components/user/contests/ContestDetailsGrid.tsx
import React from 'react';
import { ContestData } from '../../../types/contest-info';

const formatTime = (minutes) => {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

const ContestDetailsGrid = ({ contest }) => {
  return (
    <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4 mb-6">
      <div className="flex items-center gap-3 p-4 bg-gray-950 rounded-lg shadow-sm">
        <i className="fas fa-calendar w-5 h-5 text-blue-600" />
        <div>
          <div className="font-semibold">Start Time</div>
          <div className="text-sm text-gray-600">{formatDate(contest.startTime)}</div>
        </div>
      </div>
      <div className="flex items-center gap-3 p-4 bg-gray-950 rounded-lg shadow-sm">
        <i className="fas fa-clock w-5 h-5 text-red-600" />
        <div>
          <div className="font-semibold">End Time</div>
          <div className="text-sm text-gray-600">{formatDate(contest.endTime)}</div>
        </div>
      </div>
      <div className="flex items-center gap-3 p-4 bg-gray-950 rounded-lg shadow-sm">
        <i className="fas fa-exclamation-circle w-5 h-5 text-orange-600" />
        <div>
          <div className="font-semibold">Registration Deadline</div>
          <div className="text-sm text-gray-600">{formatDate(contest.registrationDeadline)}</div>
        </div>
      </div>
      <div className="flex items-center gap-3 p-4 bg-gray-950 rounded-lg shadow-sm">
        <i className="fas fa-clock w-5 h-5 text-green-600" />
        <div>
          <div className="font-semibold">Problem Time Limit</div>
          <div className="text-sm text-gray-600">{formatTime(contest.problemTimeLimit)}</div>
        </div>
      </div>
      <div className="flex items-center gap-3 p-4 bg-gray-950 rounded-lg shadow-sm">
        <i className="fas fa-users w-5 h-5 text-purple-600" />
        <div>
          <div className="font-semibold">Max Attempts</div>
          <div className="text-sm text-gray-600">{contest.maxAttempts}</div>
        </div>
      </div>
      <div className="flex items-center gap-3 p-4 bg-gray-950 rounded-lg shadow-sm">
        <i className="fas fa-exclamation-circle w-5 h-5 text-red-600" />
        <div>
          <div className="font-semibold">Wrong Submission Penalty</div>
          <div className="text-sm text-gray-600">{contest.wrongSubmissionPenalty} points</div>
        </div>
      </div>
    </div>
  );
};

export default ContestDetailsGrid;