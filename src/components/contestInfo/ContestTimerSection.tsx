interface ContestTimerSectionProps {
  countdown: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
  title: string;
}

const ContestTimerSection = ({ countdown, title }: ContestTimerSectionProps) => {
  return (
    <div className="flex flex-col justify-center lg:items-start items-center lg:max-w-md w-full mx-auto">
      <h3 className="text-lg font-semibold mb-4 text-center lg:text-left bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
        {title}
      </h3>
      <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto lg:mx-0 w-full">
        {Object.entries(countdown).map(([unit, value]) => (
          <div key={unit} className="text-center">
            <div className="relative bg-gradient-to-br from-green-900/40 via-emerald-900/30 to-green-800/40 rounded-lg p-3 border-2 border-green-500/40 shadow-lg shadow-green-500/20 hover:border-green-400/60 hover:shadow-green-400/30 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-lg"></div>
              <div className="relative">
                <div className="text-2xl font-bold text-green-300 drop-shadow-lg">{value}</div>
                <div className="text-[10px] tracking-wider text-green-400/80 uppercase font-medium">{unit}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContestTimerSection;

