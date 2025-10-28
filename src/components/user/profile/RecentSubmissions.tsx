import React from 'react';

interface Submission {
  id: string;
  title: string;
  timeAgo: string;
}

interface RecentSubmissionsProps {
  submissions: Submission[];
}

export const RecentSubmissions: React.FC<RecentSubmissionsProps> = ({
  submissions,
}) => {
  return (
    <div className="bg-[#1a1a1a] rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-white text-lg font-semibold">Recent AC</h3>
        </div>
        <button className="text-gray-400 hover:text-white text-sm flex items-center gap-1 transition-colors">
          View all submissions
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="space-y-3">
        {submissions.map((submission) => (
          <div
            key={submission.id}
            className="flex items-center justify-between py-3 px-4 bg-[#252525] hover:bg-[#2a2a2a] rounded-lg transition-colors cursor-pointer"
          >
            <span className="text-gray-300 text-sm">{submission.title}</span>
            <span className="text-gray-500 text-xs whitespace-nowrap ml-4">{submission.timeAgo}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

