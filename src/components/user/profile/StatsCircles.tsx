import React from 'react';
import { PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer } from 'recharts';

interface DifficultyStats {
  solved: number;
  total: number;
}

interface StatsCirclesProps {
  easy: DifficultyStats;
  medium: DifficultyStats;
  hard: DifficultyStats;
  attempting: number;
}

export const StatsCircles: React.FC<StatsCirclesProps> = ({
  easy,
  medium,
  hard,
  attempting,
}) => {
  const MIN_FILL_PERCENTAGE = 4;

  const getPercentage = ({ solved, total }: DifficultyStats) => {
    if (total === 0) {
      return 0;
    }
    if (solved === 0) {
      return MIN_FILL_PERCENTAGE;
    }
    const percentage = (solved / total) * 100;
    return Math.min(percentage, 100);
  };

  const totalSolved = easy.solved + medium.solved + hard.solved;
  const totalProblems = easy.total + medium.total + hard.total;

  const radialData = [
    {
      name: 'Easy',
      value: getPercentage(easy),
      fill: '#22c55e',
      solved: easy.solved ,
      total: easy.total,
    },
    {
      name: 'Medium',
      value: getPercentage(medium),
      fill: '#eab308',
      solved: medium.solved,
      total: medium.total,
    },
    {
      name: 'Hard',
      value: getPercentage(hard),
      fill: '#ef4444',
      solved: hard.solved,
      total: hard.total,
    },
  ];

  return (
    <div className="bg-white/5 rounded-lg p-4 flex items-center gap-6">
      <div className="flex flex-col items-center">
        <ResponsiveContainer width={180} height={180}>
          <RadialBarChart
            data={radialData}
            innerRadius={30}
            outerRadius={85}
            startAngle={90}
            endAngle={360}
            barSize={10}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar
              dataKey="value"
              cornerRadius={10}
              background={{ fill: '#2a2a2a' }}
            />
            <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle">
              <tspan className="fill-white text-l font-bold">
                {totalSolved}/{totalProblems}
              </tspan>
            </text>
            <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle">
              <tspan className="fill-green-500 text-xs">
                ✓ Solved
              </tspan>
            </text>
          </RadialBarChart>
        </ResponsiveContainer>
        
      </div>

      <div className="flex flex-col gap-1.5 flex-1">
        <div className="flex items-center justify-between px-2 py-1.5">
          <div className="text-[#22c55e] text-xs font-medium">Easy</div>
          <div className="text-gray-300 text-xs">{easy.solved}/{easy.total}</div>
        </div>
        
        <div className="flex items-center justify-between px-2 py-1.5">
          <div className="text-[#eab308] text-xs font-medium">Med.</div>
          <div className="text-gray-300 text-xs">{medium.solved}/{medium.total}</div>
        </div>
        
        <div className="flex items-center justify-between px-2 py-1.5">
          <div className="text-[#ef4444] text-xs font-medium">Hard</div>
          <div className="text-gray-300 text-xs">{hard.solved}/{hard.total}</div>
        </div>
           {attempting > 0 && (
          <div className="text-gray-300 text-sm mt-2">
            {attempting} Attempting
          </div>
        )}
      </div>
    </div>
  );
};

