
import { useState } from 'react';
import Navbar from '../../components/user/Navbar';
import { useContests } from '../../app/hooks/contest/useContests';
import { useContestTimer } from '../../app/hooks/contest/useContestTimer';
import ContestDashboardHeader from '../../components/contestDashBoard/ContestDashboardHeader';
import ActiveContestsSection from '../../components/contestDashBoard/ActiveContestsSection';
import ContestTabsNavigation from '../../components/contestDashBoard/ContestTabsNavigation';
import UpcomingContestsList from '../../components/contestDashBoard/UpcomingContestsList';
import PastContestsList from '../../components/contestDashBoard/PastContestsList';
import ContestAdvertisement from '../../components/contestDashBoard/ContestAdvertisement';

const ContestDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [pastSearchTerm, setPastSearchTerm] = useState('');

  const {
    activeContest,
    upcomingContests,
    pastContests,
    pastPage,
    setPastPage,
    pastTotal,
    pastTotalPages,
    pastLimit,
    loadingActive,
    loadingUpcoming,
    loadingPast,
    handleRegisterForContest,
    setPastSearch,
  } = useContests();

  const timeLeft = useContestTimer(activeContest);

  const totalPages = pastTotalPages || 1;

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'past') setPastPage(1);
  };

  const handlePastSearchChange = (value: string) => {
    setPastSearchTerm(value);
    setPastSearch(value);
    setPastPage(1);
  };

  return (
    <div className="bg-black text-white flex flex-col min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ContestDashboardHeader />

        <ActiveContestsSection
          activeContest={activeContest}
          timeLeft={timeLeft}
          loadingActive={loadingActive}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ContestTabsNavigation
              activeTab={activeTab}
              onTabChange={handleTabChange}
              pastSearchTerm={pastSearchTerm}
              onPastSearchChange={handlePastSearchChange}
            />

            <div className="space-y-4 max-w-2xl w-full mx-auto">
              {activeTab === 'upcoming' ? (
                <UpcomingContestsList
                  upcomingContests={upcomingContests || []}
                  loadingUpcoming={loadingUpcoming}
                  onRegister={handleRegisterForContest}
                />
              ) : (
                <PastContestsList
                  pastContests={pastContests}
                  loadingPast={loadingPast}
                  pastSearchTerm={pastSearchTerm}
                  pastPage={pastPage}
                  totalPages={totalPages}
                  pastLimit={pastLimit}
                  pastTotal={pastTotal}
                  onPageChange={setPastPage}
                />
              )}
            </div>
          </div>

          <ContestAdvertisement />
        </div>
      </div>
    </div>
  );
};

export default ContestDashboardPage;