// import React, { useState } from 'react';
// import { ChevronDown, RefreshCw } from 'lucide-react';
// import DescriptionSection from '../problem-solving/DescriptionSection';
// import { roomSocketService } from '../../../services/roomSocketService';
// import type { ProblemData } from '../../../types/problem';
// import { formatConstraints } from '../../../utils/problem-related';

// interface ProblemDescriptionTabProps {
//   problem?: ProblemData;
//   canChangeProblem: boolean;
// }

// const ProblemDescriptionTab: React.FC<ProblemDescriptionTabProps> = ({ problem, canChangeProblem }) => {


//   const [showHints, setShowHints] = useState(false);
//   const [showProblemSelector, setShowProblemSelector] = useState(false);
//   const [selectedProblemNumber, setSelectedProblemNumber] = useState('');
//   const [isChangingProblem, setIsChangingProblem] = useState(false);
//   // console.log("problemmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm", problem)

//   // const formattedConstraints = problem?.constraints
//   //   ? problem.constraints.split('\n').filter(constraint => constraint.trim())
//   //   : [];


//   const handleChangeProblem = async () => {
//     if (!selectedProblemNumber || !canChangeProblem) return;

//     setIsChangingProblem(true);
//     try {
//       await roomSocketService.changeProblem(parseInt(selectedProblemNumber));
//       setShowProblemSelector(false);
//       setSelectedProblemNumber('');
//     } catch (error) {
//       console.error('Failed to change problem:', error);
//       alert('Failed to change problem. Please try again.');
//     } finally {
//       setIsChangingProblem(false);
//     }
//   };

//   if (!problem) {
//     return (
//       <div className="p-6 text-center">
//         <div className="text-gray-400 mb-4">
//           <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
//             📋
//           </div>
//           <p className="text-lg">No problem selected</p>
//           <p className="text-sm">The room creator can select a problem to work on together.</p>
//         </div>

//         {canChangeProblem && (
//           <button
//             onClick={() => setShowProblemSelector(true)}
//             className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
//           >
//             Select Problem
//           </button>
//         )}
//       </div>
//     );
//   }


//   const formattedConstraints = formatConstraints(problem!.constraints);

//   return (
//     <div className="h-full overflow-y-auto no-scrollbar">
//       <div className="p-6">
//         {/* Problem Header with Change Option */}
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <h1 className="text-2xl font-bold text-white mb-2">
//               {problem.problemNumber}. {problem.title}
//             </h1>
//             <div className="flex items-center space-x-4">
//               <span className={`px-2 py-1 rounded text-xs font-medium ${problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
//                 problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
//                   'bg-red-100 text-red-800'
//                 }`}>
//                 {problem.difficulty}
//               </span>
//               {problem.acceptanceRate && (
//                 <span className="text-gray-400 text-sm">
//                   Acceptance: {problem.acceptanceRate}%
//                 </span>
//               )}
//             </div>
//           </div>

//           {canChangeProblem && (
//             <div className="relative">
//               <button
//                 onClick={() => setShowProblemSelector(!showProblemSelector)}
//                 className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors flex items-center space-x-1"
//               >
//                 <RefreshCw size={14} />
//                 <span>Change Problem</span>
//                 <ChevronDown size={14} />
//               </button>

//               {showProblemSelector && (
//                 <div className="absolute right-0 top-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10 p-4 min-w-64">
//                   <h3 className="text-white font-medium mb-3">Select New Problem</h3>
//                   <div className="space-y-3">
//                     <input
//                       type="number"
//                       placeholder="Enter problem number (e.g., 1, 2, 3...)"
//                       value={selectedProblemNumber}
//                       onChange={(e) => setSelectedProblemNumber(e.target.value)}
//                       className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       min="1"
//                     />
//                     <div className="flex space-x-2">
//                       <button
//                         onClick={handleChangeProblem}
//                         disabled={!selectedProblemNumber || isChangingProblem}
//                         className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-2 rounded text-sm transition-colors"
//                       >
//                         {isChangingProblem ? 'Changing...' : 'Change'}
//                       </button>
//                       <button
//                         onClick={() => {
//                           setShowProblemSelector(false);
//                           setSelectedProblemNumber('');
//                         }}
//                         className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm transition-colors"
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Problem Description */}
//         <DescriptionSection
//           problemData={problem}
//           formattedConstraints={formattedConstraints}
//           showHints={showHints}
//           setShowHints={setShowHints}
//         />
//       </div>
//     </div>
//   );
// };

// export default ProblemDescriptionTab;

































import React, { useEffect, useState } from 'react';
import { ChevronDown, RefreshCw } from 'lucide-react';
import DescriptionSection from '../problem-solving/DescriptionSection';
import ProblemSelector from './problem-related/ProblemSelector';
import { roomSocketService } from '../../../services/roomSocketService';
import type { ProblemData } from '../../../types/problem';
import { formatConstraints } from '../../../utils/problem-related';
import { useAppSelector } from '../../../app/hooks';
import { toast } from 'react-toastify';

interface ProblemDescriptionTabProps {
  problem?: ProblemData;
  canChangeProblem: boolean;
}

const ProblemDescriptionTab: React.FC<ProblemDescriptionTabProps> = ({
  // problem, 
  canChangeProblem
}) => {
  const [showHints, setShowHints] = useState(false);
  const [showProblemSelector, setShowProblemSelector] = useState(false);
  const [isChangingProblem, setIsChangingProblem] = useState(false);

   const problem =  useAppSelector(state=> state.room.currentRoom?.problem)


  const handleChangeProblem = async (problemNumber: number) => {
    
    if (!canChangeProblem) return;
  
    setIsChangingProblem(true);
    try {
      roomSocketService.changeProblem(problemNumber);
      setShowProblemSelector(false);
    } catch (error) {
      console.error('Failed to change problem:', error);
      toast.error('Failed to change problem. Please try again.');
    } finally {
      setIsChangingProblem(false);
    }
  };

  if (!problem) {
    return (
      <div className="p-6 text-center">
        <div className="text-gray-400 mb-4">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            📋
          </div>
          <p className="text-lg">No problem selected</p>
          <p className="text-sm">The room creator can select a problem to work on together.</p>
        </div>

        {canChangeProblem && (
          <button
            onClick={() => setShowProblemSelector(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
          >
            Select Problem
          </button>
        )}

        {/* Problem Selector Modal */}
        {showProblemSelector && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg w-full max-w-md mx-4">
              <ProblemSelector
                onSelectProblem={handleChangeProblem}
                onClose={() => setShowProblemSelector(false)}
                isChanging={isChangingProblem}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  const formattedConstraints = formatConstraints(problem.constraints);

  return (
    <div className="h-full overflow-y-auto no-scrollbar">
      <div className="p-6">
        {/* Problem Header with Change Option */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {problem.problemNumber}. {problem.title}
            </h1>
            <div className="flex items-center space-x-4">
              <span className={`px-2 py-1 rounded text-xs font-medium ${problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                  problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                }`}>
                {problem.difficulty}
              </span>
              {problem.acceptanceRate && (
                <span className="text-gray-400 text-sm">
                  Acceptance: {problem.acceptanceRate}%
                </span>
              )}
            </div>
          </div>

          {canChangeProblem && (
            <div className="relative">
              <button
                onClick={() => setShowProblemSelector(!showProblemSelector)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors flex items-center space-x-1"
              >
                <RefreshCw size={14} />
                <span>Change Problem</span>
                <ChevronDown size={14} />
              </button>

              {/* Problem Selector Dropdown */}
              {showProblemSelector && (
                <ProblemSelector
                  onSelectProblem={handleChangeProblem}
                  onClose={() => setShowProblemSelector(false)}
                  isChanging={isChangingProblem}
                />
              )}
            </div>
          )}
        </div>

        {/* Problem Description */}
        <DescriptionSection
          problemData={problem}
          formattedConstraints={formattedConstraints}
          showHints={showHints}
          setShowHints={setShowHints}
        />
      </div>
    </div>
  );
};

export default ProblemDescriptionTab;
