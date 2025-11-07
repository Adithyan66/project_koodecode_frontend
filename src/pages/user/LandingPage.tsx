import React from 'react';
import Navbar from '../../components/user/Navbar';
import RoomsSection from '../../components/room/entry-related/RoomsSection';
import { useLanding } from '../../app/hooks/common/useLanding';
import HeroSection from '../../components/landing/HeroSection';
import FeatureHighlightsSection from '../../components/landing/FeatureHighlightsSection';
import WorkflowSection from '../../components/landing/WorkflowSection';
import Footer from '../../components/landing/LandingFooter';

const LandingPage: React.FC = () => {
    const {
        activeHeroView,
        featureHighlights,
        handleCreateRoom,
        handleJoinRoom,
        heroCardHeight,
        heroCardRef,
        isAuthenticated,
        setActiveHeroView,
        setHeroCardHeight,
        workflowSteps,
        frontCardRef,
        helpNote
    } = useLanding();

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-[#050505] to-black text-white relative">
            <Navbar />

            <HeroSection
                activeHeroView={activeHeroView}
                handleCreateRoom={handleCreateRoom}
                handleJoinRoom={handleJoinRoom}
                heroCardHeight={heroCardHeight}
                heroCardRef={heroCardRef as React.MutableRefObject<HTMLDivElement>}
                setActiveHeroView={setActiveHeroView}
                setHeroCardHeight={setHeroCardHeight}
                frontCardRef={frontCardRef as React.MutableRefObject<HTMLDivElement>}
                helpNote={helpNote}
            />

            <FeatureHighlightsSection featureHighlights={featureHighlights} />

            <WorkflowSection workflowSteps={workflowSteps} />

            {isAuthenticated && (
                <RoomsSection
                    title="Join Active Rooms"
                    status="active"
                    accentColor="green"
                />
            )}

            {isAuthenticated && (
                <RoomsSection
                    title="Upcoming Scheduled Rooms"
                    status="waiting"
                    accentColor="blue"
                />
            )}

            <Footer />
        </div>
    );
};

export default LandingPage;
