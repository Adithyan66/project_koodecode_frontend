import { formatDate } from '../../utils/format';

interface ContestTimingDetailsProps {
  startTime: Date;
  endTime: Date;
  registrationDeadline: Date;
}

const ContestTimingDetails = ({ startTime, endTime, registrationDeadline }: ContestTimingDetailsProps) => {
  return (
    <div className="px-1">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-3">
          <i className="fas fa-play text-green-400" />
          <div>
            <div className="text-xs uppercase tracking-wider text-gray-400">Starts</div>
            <div className="text-sm text-gray-200">{formatDate(startTime)}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <i className="fas fa-flag-checkered text-red-400" />
          <div>
            <div className="text-xs uppercase tracking-wider text-gray-400">Ends</div>
            <div className="text-sm text-gray-200">{formatDate(endTime)}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <i className="fas fa-user-check text-blue-400" />
          <div>
            <div className="text-xs uppercase tracking-wider text-gray-400">Registration</div>
            <div className="text-sm text-gray-200">{formatDate(registrationDeadline)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestTimingDetails;

