import trophy from '../../assets/images/trophy 1.png';
import contestText from '../../assets/images/KoodeCode Contest.svg';

const ContestDashboardHeader = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center mb-12">
      <img src={trophy} alt="Trophy" className="w-16 h-16 mb-3 animate-bounce" />
      <img src={contestText} alt="Contest Text" className="w-80 h-auto mb-3" />
      <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 bg-clip-text text-transparent">
        Contest every day, compete and see your ranking
      </h1>
    </div>
  );
};

export default ContestDashboardHeader;

