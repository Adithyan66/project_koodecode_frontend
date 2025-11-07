import React from 'react';
import DiagonalStripes from '../common/DiagonalStripes';
import CreateRoomInlinePanel from '../room/entry-related/CreateRoomInlinePanel';
import JoinPrivateRoomInlinePanel from '../room/entry-related/JoinPrivateRoomInlinePanel';
import handShakeImg from '../../assets/images/ChatGPT_Image_Aug_2__2025__11_16_25_AM-removebg-preview 1.svg';
import type { HeroView } from '../../app/hooks/common/useLanding';

type HeroSectionProps = {
    activeHeroView: HeroView;
    handleCreateRoom: () => void;
    handleJoinRoom: () => void;
    heroCardHeight: number | null;
    heroCardRef: React.MutableRefObject<HTMLDivElement>;
    setActiveHeroView: React.Dispatch<React.SetStateAction<HeroView>>;
    setHeroCardHeight: React.Dispatch<React.SetStateAction<number | null>>;
    frontCardRef: React.MutableRefObject<HTMLDivElement>;
    helpNote: string;
};

const HeroSection: React.FC<HeroSectionProps> = ({
    activeHeroView,
    handleCreateRoom,
    handleJoinRoom,
    heroCardHeight,
    heroCardRef,
    setActiveHeroView,
    setHeroCardHeight,
    frontCardRef,
    helpNote
}) => {
    const handleImageLoad = () => {
        if (frontCardRef.current) {
            setHeroCardHeight(frontCardRef.current.offsetHeight);
        }
    };

    return (
        <section className="relative px-6 pt-24 pb-32 md:pb-36">
            <DiagonalStripes />
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-12rem] right-[-6rem] h-[26rem] w-[26rem] bg-gradient-to-br from-green-500/15 via-teal-400/10 to-blue-500/10 blur-3xl rounded-full" />
                <div className="absolute bottom-[-10rem] left-[-8rem] h-[24rem] w-[24rem] bg-gradient-to-br from-purple-500/15 via-pink-500/10 to-orange-400/10 blur-3xl rounded-full" />
            </div>
            <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center relative">
                <div className="space-y-8">
                    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm uppercase tracking-[0.4em] text-white/70">
                        Collaborate Beyond Screens
                    </span>
                    <h1 className="font-bold tracking-tight text-4xl sm:text-5xl lg:text-6xl leading-tight">
                        Supercharge your <span className="bg-gradient-to-r from-green-400 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">real-time coding</span>
                        <br className="hidden sm:block" /> with peers who build relentlessly.
                    </h1>
                    <p className="text-lg sm:text-xl text-white/70 max-w-xl">
                        Pair program, prototype, and practice interviews in immersive rooms designed for engineering squads. Bring your entire workflow into one collaborative canvas.
                    </p>
                    <div className="flex flex-wrap items-center gap-4">
                        <button
                            onClick={handleCreateRoom}
                            className="relative overflow-hidden rounded-full bg-gradient-to-r from-green-500 via-emerald-500 to-cyan-400 px-8 py-3 text-black font-semibold shadow-[0_20px_60px_-15px_rgba(16,185,129,0.6)] transition-transform hover:scale-[1.02]"
                        >
                            Launch a Room
                        </button>
                        <button
                            onClick={handleJoinRoom}
                            className="rounded-full border border-white/20 px-8 py-3 font-semibold text-white/80 transition hover:border-emerald-400 hover:text-emerald-300"
                        >
                            Private Sessions
                        </button>
                        <div className="flex items-center space-x-3 text-sm text-white/60">
                            <div className="flex -space-x-2">
                                <span className="h-9 w-9 rounded-full border border-black/20 bg-gradient-to-br from-green-500/60 to-emerald-400/60" />
                                <span className="h-9 w-9 rounded-full border border-black/20 bg-gradient-to-br from-purple-500/60 to-pink-400/60" />
                                <span className="h-9 w-9 rounded-full border border-black/20 bg-gradient-to-br from-cyan-500/60 to-blue-400/60" />
                            </div>
                            <span>Trusted by thousands of makers weekly</span>
                        </div>
                    </div>
                </div>
                <div className="relative">
                    <div
                        ref={heroCardRef}
                        className="relative h-full"
                        style={{ perspective: '2000px' }}
                    >
                        <div
                            className={`relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] ${activeHeroView !== 'default' ? '[transform:rotateY(180deg)]' : ''}`}
                            style={{
                                height: heroCardHeight ? `${heroCardHeight}px` : undefined,
                                minHeight: '28rem'
                            }}
                        >
                            <div className="absolute inset-0 rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-sm p-1 shadow-[0_20px_60px_-25px_rgba(16,185,129,0.7)] [backface-visibility:hidden]">
                                <div ref={frontCardRef} className="rounded-[28px] bg-gradient-to-br from-gray-900 via-gray-900/80 to-black p-6">
                                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-white/40">
                                        <span>Session Overview</span>
                                        <span>Live</span>
                                    </div>
                                    <img
                                        src={handShakeImg}
                                        alt="Creators collaborating"
                                        className="mx-auto mt-6 w-full max-w-sm drop-shadow-2xl"
                                        onLoad={handleImageLoad}
                                    />
                                    <p className="mt-8 text-sm text-white/65 leading-relaxed text-left">
                                        {helpNote}
                                    </p>
                                </div>
                            </div>
                            <div className="absolute inset-0 rounded-[32px] border border-white/10 bg-gradient-to-br from-gray-900 via-gray-900/80 to-black p-6 overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)]">
                                {activeHeroView === 'create' && (
                                    <CreateRoomInlinePanel onClose={() => setActiveHeroView('default')} />
                                )}
                                {activeHeroView === 'join' && (
                                    <JoinPrivateRoomInlinePanel onClose={() => setActiveHeroView('default')} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;

