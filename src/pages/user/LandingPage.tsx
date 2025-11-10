import React, { useEffect, useState } from 'react';
import Navbar from '../../components/user/Navbar';
import RoomsSection from '../../components/room/entry-related/RoomsSection';
import { useLanding } from '../../app/hooks/common/useLanding';
import HeroSection from '../../components/landing/HeroSection';
import FeatureHighlightsSection from '../../components/landing/FeatureHighlightsSection';
import WorkflowSection from '../../components/landing/WorkflowSection';
import Footer from '../../components/landing/LandingFooter';
import { usePushNotifications } from '../../app/hooks/usePushNotifications';
import PushPermissionPrompt from '../../components/landing/PushPermissionPrompt';
import { toast } from 'react-toastify';

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
    const {
        isSupported,
        isSubscribed,
        isLoading: isPushLoading,
        subscribe,
        hasCheckedSubscription
    } = usePushNotifications();
    console.log(isSupported, isSubscribed, isPushLoading);
    
    const [showPushPrompt, setShowPushPrompt] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (!isSupported) {
            setShowPushPrompt(false);
            return;
        }
        if (!hasCheckedSubscription) {
            setShowPushPrompt(false);
            return;
        }
        const permission = typeof Notification === 'undefined' ? null : Notification.permission;
        const now = Date.now();
        const lastPromptRaw = localStorage.getItem('koodecode:lastPushPrompt');
        const lastPrompt = lastPromptRaw ? Number(lastPromptRaw) : 0;
        const shouldPrompt = now - lastPrompt >= 1 * 60 * 1000;
        if (permission === 'denied') {
            setShowPushPrompt(false);
            if (!lastPromptRaw) {
                localStorage.setItem('koodecode:lastPushPrompt', now.toString());
            }
            return;
        }
        if (permission === 'granted' && isSubscribed) {
            setShowPushPrompt(false);
            localStorage.setItem('koodecode:lastPushPrompt', now.toString());
            return;
        }
        if (permission === 'granted' && !isSubscribed) {
            if (shouldPrompt) {
                setShowPushPrompt(true);
                localStorage.setItem('koodecode:lastPushPrompt', now.toString());
            } else {
                setShowPushPrompt(false);
            }
            return;
        }
        if (shouldPrompt) {
            setShowPushPrompt(true);
            localStorage.setItem('koodecode:lastPushPrompt', now.toString());
        } else {
            setShowPushPrompt(false);
        }
    }, [isSupported, isSubscribed, hasCheckedSubscription]);

    useEffect(() => {
        if (!showPushPrompt) return;
        if (!isSupported || !hasCheckedSubscription) {
            setShowPushPrompt(false);
        }
    }, [isSupported, showPushPrompt, hasCheckedSubscription]);

    const handleRecordPrompt = () => {
        if (typeof window === 'undefined') return;
        localStorage.setItem('koodecode:lastPushPrompt', Date.now().toString());
    };

    const handleEnableNotifications = async () => {
        const success = await subscribe();
        if (success) {
            toast.success('Push notifications enabled');
            handleRecordPrompt();
            setShowPushPrompt(false);
        } else {
            toast.error('Unable to enable notifications right now');
        }
    };

    const handleDismissPrompt = () => {
        handleRecordPrompt();
        setShowPushPrompt(false);
    };
    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-[#050505] to-black text-white relative">
            <Navbar />

            <div className="pointer-events-none fixed right-6 top-24 z-40 flex justify-end">
                {showPushPrompt && (
                    <PushPermissionPrompt
                        isLoading={isPushLoading}
                        onEnable={handleEnableNotifications}
                        onDismiss={handleDismissPrompt}
                    />
                )}
            </div>

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


            <WorkflowSection workflowSteps={workflowSteps} />

            <FeatureHighlightsSection featureHighlights={featureHighlights} />
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
