
import { useState, useEffect } from 'react';
import Navbar from '../../components/user/Navbar';
import { useContests } from '../../app/hooks/contest/useContests';
import { useContestTimer } from '../../app/hooks/contest/useContestTimer';
import { useDebounce } from '../../utils/debounce';
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

  const debouncedPastSearchTerm = useDebounce(pastSearchTerm, 500);

  useEffect(() => {
    setPastSearch(debouncedPastSearchTerm);
    setPastPage(1);
  }, [debouncedPastSearchTerm, setPastSearch, setPastPage]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'past') setPastPage(1);
  };

  const handlePastSearchChange = (value: string) => {
    setPastSearchTerm(value);
  };

  return (
    <div className="flex min-h-screen flex-col bg-neutral-950 text-white">
      <Navbar />
      <main className="relative flex-1 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.12),_transparent_55%)]" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <ContestDashboardHeader />

          <ActiveContestsSection
            activeContest={activeContest}
            timeLeft={timeLeft}
            loadingActive={loadingActive}
          />

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ContestTabsNavigation
                activeTab={activeTab}
                onTabChange={handleTabChange}
                pastSearchTerm={pastSearchTerm}
                onPastSearchChange={handlePastSearchChange}
              />

              <div className="mx-auto w-full max-w-2xl space-y-4">
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
      </main>
    </div>
  );
};

export default ContestDashboardPage;