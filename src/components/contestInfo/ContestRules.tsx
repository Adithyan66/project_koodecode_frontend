import { formatTime } from '../../utils/format';
import type { ContestDTO } from '../../types/contest.dto';

interface ContestRulesProps {
  contest: ContestDTO;
}

const ContestRules = ({ contest }: ContestRulesProps) => {
  return (
    <div className="p-6 bg-black border-t">
      <h3 className="text-xl font-bold mb-6">Contest Rules & Regulations</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-gray-950 rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <i className="fas fa-check-circle w-5 h-5" />
              General Rules
            </h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Participants must register before the registration deadline</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Each problem has a time limit of {contest.problemTimeLimit}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Maximum {contest.maxAttempts} attempts allowed per problem</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Wrong submissions incur a penalty of {contest.wrongSubmissionPenalty} points</span>
              </li>
            </ul>
          </div>
          <div className="bg-gray-950 rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
              <i className="fas fa-trophy w-5 h-5" />
              Scoring System
            </h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Points are awarded based on problem difficulty and completion time</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Faster correct submissions receive higher scores</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Partial credit may be given for partially correct solutions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Wrong submissions result in point deductions</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-gray-950 rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
              <i className="fas fa-exclamation-circle w-5 h-5" />
              Prohibited Actions
            </h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span>Collaborating with other participants during the contest</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span>Sharing solutions or hints with other participants</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span>Using external help or AI assistance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span>Creating multiple accounts to participate</span>
              </li>
            </ul>
          </div>
          <div className="bg-gray-950 rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
              <i className="fas fa-users w-5 h-5" />
              Ranking Criteria
            </h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>Total score (higher is better)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>Number of problems solved (more is better)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>Total time taken (less is better)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>Number of wrong submissions (fewer is better)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-6 bg-gray-950 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
          <i className="fas fa-exclamation-circle w-5 h-5" />
          Important Notice
        </h4>
        <div className="text-sm text-yellow-700 grid md:grid-cols-2 gap-4">
          <div>
            <p>• Contest decisions are final and binding</p>
            <p>• Technical issues should be reported immediately</p>
          </div>
          <div>
            <p>• Fair play is expected from all participants</p>
            <p>• Violations may result in disqualification</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestRules;