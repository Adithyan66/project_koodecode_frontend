import { useEffect, useRef, useState } from 'react';
import { Sparkles, Users, ShieldCheck, Code2, Workflow, Rocket } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks';

export type HeroView = 'default' | 'create' | 'join';

export type FeatureHighlight = {
    icon: LucideIcon;
    title: string;
    description: string;
};

export type WorkflowStep = {
    icon: LucideIcon;
    title: string;
    description: string;
};

const featureHighlights: FeatureHighlight[] = [
    {
        icon: Sparkles,
        title: 'Live Collaboration Canvas',
        description: 'Bring your code editor, rich whiteboard, and AI prompts together for seamless teamwork.'
    },
    {
        icon: Users,
        title: 'Community-Led Sessions',
        description: 'Host study jams, interview preps, and hack nights with peers across campuses.'
    },
    {
        icon: ShieldCheck,
        title: 'Secure & Private Rooms',
        description: 'Protect your private rooms with access control, waiting rooms, and password gating.'
    }
];

const workflowSteps: WorkflowStep[] = [
    {
        icon: Code2,
        title: 'Spin Up Your Room',
        description: 'Launch an instant workspace or schedule a session with problems and resources ready.'
    },
    {
        icon: Workflow,
        title: 'Collaborate In Real-Time',
        description: 'Pair program, sketch architecture, and iterate quickly with synced previews.'
    },
    {
        icon: Rocket,
        title: 'Ship With Confidence',
        description: 'Track progress, share recaps, and keep momentum going after every session.'
    }
];

export const useLanding = () => {
    const navigate = useNavigate();
    const isAuthenticated = useAppSelector(state => state.user.isAuthenticated);
    const [activeHeroView, setActiveHeroView] = useState<HeroView>('default');
    const heroCardRef = useRef<HTMLDivElement>(null!);
    const frontCardRef = useRef<HTMLDivElement>(null!);
    const [heroCardHeight, setHeroCardHeight] = useState<number | null>(null);

    useEffect(() => {
        if (activeHeroView === 'default') return;

        const handleClickOutside = (event: MouseEvent) => {
            if (!heroCardRef.current || heroCardRef.current.contains(event.target as Node)) {
                return;
            }
            setActiveHeroView('default');
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [activeHeroView]);

    useEffect(() => {
        const updateHeight = () => {
            if (frontCardRef.current) {
                setHeroCardHeight(frontCardRef.current.offsetHeight);
            }
        };

        updateHeight();
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    }, []);

    useEffect(() => {
        if (activeHeroView === 'default' && frontCardRef.current) {
            setHeroCardHeight(frontCardRef.current.offsetHeight);
        }
    }, [activeHeroView]);

    const handleCreateRoom = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        setActiveHeroView('create');
    };

    const handleJoinRoom = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        setActiveHeroView('join');
    };

    return {
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
        helpNote: 'Create tight-knit squads that meet weekly, rotate mentors, and keep everyone accountable.'
    };
};
