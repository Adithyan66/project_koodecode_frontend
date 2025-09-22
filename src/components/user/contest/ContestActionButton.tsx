

// src/components/user/contests/ContestActionButton.tsx
import React from 'react';
import { ContestState } from '../../../types/contest-info';
import { formatDate } from '../../../utils/format';

const ContestActionButton = ({ contest, isRegistering, handleRegister, handleEnterContest }) => {
  if (contest.userSubmission) {
    const { status, testCasesPassed, totalTestCases, submittedAt } = contest.userSubmission;
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-green-800 mb-3">
            <i className="fas fa-check-circle w-6 h-6" />
            <span className="text-xl font-bold">Contest Completed!</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-sm text-gray-600">Status</div>
              <div
                className={`font-semibold capitalize ${
                  status === 'accepted'
                    ? 'text-green-600'
                    : status === 'wrong_answer'
                    ? 'text-red-600'
                    : 'text-yellow-600'
                }`}
              >
                {status.replace('_', ' ')}
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-sm text-gray-600">Test Cases</div>
              <div className="font-semibold text-blue-600">
                {testCasesPassed}/{totalTestCases}
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-sm text-gray-600">Submitted</div>
              <div className="font-semibold text-gray-800">{formatDate(submittedAt)}</div>
            </div>
          </div>
          <div className="text-sm text-green-600">
            Thank you for participating! Check the leaderboard for your ranking.
          </div>
        </div>
      </div>
    );
  }

  const isContestEnded = contest.state === ContestState.ENDED || contest.state === ContestState.RESULTS_PUBLISHED;
  if (isContestEnded) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-gray-600 justify-center">
          <i className="fas fa-clock w-5 h-5" />
          <span className="font-semibold">Contest Ended</span>
        </div>
        <p className="text-sm text-gray-500 mt-1 text-center">This contest has concluded</p>
      </div>
    );
  }

  if (isRegistering) {
    return (
      <button
        disabled
        className="w-full bg-gray-300 text-gray-500 py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2"
      >
        <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
        Registering...
      </button>
    );
  }

  const now = new Date();
  switch (contest.state) {
    case ContestState.REGISTRATION_OPEN:
      const registrationDeadlinePassed = now > contest.registrationDeadline;
      if (registrationDeadlinePassed) {
        return (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-800 justify-center">
              <i className="fas fa-exclamation-circle w-5 h-5" />
              <span className="font-semibold">Registration Closed</span>
            </div>
            <p className="text-sm text-red-600 mt-1 text-center">Registration deadline has passed</p>
          </div>
        );
      }
      return contest.isUserRegistered ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-800 justify-center">
            <i className="fas fa-check-circle w-5 h-5" />
            <span className="font-semibold">You are registered!</span>
          </div>
          <p className="text-sm text-green-600 mt-1 text-center">
            Contest starts {formatDate(contest.startTime)}
          </p>
        </div>
      ) : (
        <button
          onClick={handleRegister}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
        >
          Register for Contest
        </button>
      );

    case ContestState.ACTIVE:
      return contest.isUserRegistered ? (
        <button
          onClick={handleEnterContest}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
        >
          Enter Contest
        </button>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800 justify-center">
            <i className="fas fa-exclamation-circle w-5 h-5" />
            <span className="font-semibold">Registration Closed</span>
          </div>
          <p className="text-sm text-red-600 mt-1 text-center">Contest is currently active</p>
        </div>
      );

    case ContestState.UPCOMING:
      const registrationOpen = now >= contest.registrationDeadline;
      if (registrationOpen && !contest.isUserRegistered) {
        return (
          <button
            onClick={handleRegister}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
          >
            Register for Contest
          </button>
        );
      } else if (contest.isUserRegistered) {
        return (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-800 justify-center">
              <i className="fas fa-check-circle w-5 h-5" />
              <span className="font-semibold">You are registered!</span>
            </div>
            <p className="text-sm text-green-600 mt-1 text-center">
              Contest starts {formatDate(contest.startTime)}
            </p>
          </div>
        );
      }
      return (
        <button
          disabled
          className="w-full bg-gray-300 text-gray-500 py-3 px-6 rounded-lg font-semibold cursor-not-allowed"
        >
          Registration Opens Soon
        </button>
      );

    default:
      return null;
  }
};

export default ContestActionButton;