import React, { useEffect, useMemo, useState } from 'react';

interface Badge {
  id: string;
  name: string;
  imageUrl: string;
  color: string;
}

interface RecentBadge {
  imageUrl: string;
  title: string;
  year: number;
  color: string;
}

interface BadgesSectionProps {
  totalBadges: number;
  badges: Badge[];
  recentBadge: RecentBadge;
}

export const BadgesSection: React.FC<BadgesSectionProps> = ({
  totalBadges,
  badges,
  recentBadge,
}) => {
  const [startIndex, setStartIndex] = useState(0);
  const [animationState, setAnimationState] = useState<'idle' | 'exiting' | 'entering-start' | 'entering-active'>('idle');
  const [animationDirection, setAnimationDirection] = useState<'next' | 'prev' | null>(null);
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const [hoveredBadgeId, setHoveredBadgeId] = useState<string | null>(null);

  const hasBadges = badges.length > 0;

  const displayedBadges = useMemo(() => {
    return badges.slice(startIndex, startIndex + 3);
  }, [badges, startIndex]);

  const hoveredBadge = useMemo(
    () => badges.find((badge) => badge.id === hoveredBadgeId) ?? null,
    [badges, hoveredBadgeId]
  );

  useEffect(() => {
    if (badges.length <= 3 && startIndex !== 0) {
      setStartIndex(0);
    } else {
      const maxStart = Math.max(0, badges.length - 3);
      if (startIndex > maxStart) {
        setStartIndex(maxStart);
      }
    }
  }, [badges.length, startIndex]);

  useEffect(() => {
    let timeoutId: number | undefined;
    let rafId: number | undefined;
    let rafId2: number | undefined;

    if (animationState === 'exiting') {
      timeoutId = window.setTimeout(() => {
        if (pendingIndex !== null) {
          setStartIndex(pendingIndex);
        }
        setAnimationState('entering-start');
      }, 260);
    } else if (animationState === 'entering-start') {
      rafId = window.requestAnimationFrame(() => {
        rafId2 = window.requestAnimationFrame(() => {
          setAnimationState('entering-active');
        });
      });
    } else if (animationState === 'entering-active') {
      timeoutId = window.setTimeout(() => {
        setAnimationState('idle');
        setAnimationDirection(null);
        setPendingIndex(null);
      }, 260);
    }

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      if (rafId) window.cancelAnimationFrame(rafId);
      if (rafId2) window.cancelAnimationFrame(rafId2);
    };
  }, [animationState, pendingIndex]);

  const handleNext = () => {
    if (animationState !== 'idle') return;
    if (startIndex + 3 >= badges.length) return;
    const nextIndex = startIndex + 1;
    setAnimationDirection('next');
    setPendingIndex(nextIndex);
    setAnimationState('exiting');
    setHoveredBadgeId(null);
  };

  const handlePrev = () => {
    if (animationState !== 'idle') return;
    if (startIndex === 0) return;
    const prevIndex = startIndex - 1;
    setAnimationDirection('prev');
    setPendingIndex(prevIndex);
    setAnimationState('exiting');
    setHoveredBadgeId(null);
  };

  const getCarouselStyle = (): React.CSSProperties => {
    const baseTransition = 'transform 0.26s ease, opacity 0.26s ease';

    if (animationState === 'exiting' && animationDirection) {
      return {
        transition: baseTransition,
        opacity: 0,
        transform:
          animationDirection === 'next'
            ? 'translateX(-24px) scale(0.92)'
            : 'translateX(24px) scale(0.92)',
      };
    }

    if (animationState === 'entering-start' && animationDirection) {
      return {
        transition: baseTransition,
        opacity: 0,
        transform:
          animationDirection === 'next'
            ? 'translateX(24px) scale(0.96)'
            : 'translateX(-24px) scale(0.96)',
      };
    }

    return {
      transition: baseTransition,
      opacity: 1,
      transform: 'translateX(0) scale(1)',
    };
  };

  return (
    <div className="bg-white/5 rounded-lg p-4 relative">
      {hoveredBadge && (
        <div className="absolute left-1/2 -translate-x-1/2 -translate-y-2 top-12 bg-black/80 px-3 py-1 rounded text-xs text-white pointer-events-none z-10">
          {hoveredBadge.name}
        </div>
      )}

      <div className="flex flex-col items-center mb-3">
        <div className="flex items-center justify-center gap-4">
       
        {badges.length > 3 && (
          <button
            className={`p-1 rounded-full transition-colors ${
              startIndex === 0 || animationState !== 'idle'
                ? 'text-gray-600 cursor-not-allowed'
                : 'text-gray-300 hover:text-white'
            }`}
            onClick={handlePrev}
            disabled={startIndex === 0 || animationState !== 'idle'}
            aria-label="Previous badges"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        <div
          className="flex gap-4 justify-center items-end"
          style={getCarouselStyle()}
        >
          {hasBadges ? (
            displayedBadges.map((badge, index) => {
              const isCenter = index === 1;
              return (
                <div
                  key={`${badge.id}-${startIndex}`}
                  className={`flex flex-col items-center justify-center transition-transform duration-300 ease-out ${
                    isCenter ? 'scale-110 translate-y-1' : 'scale-95'
                  }`}
                  onMouseEnter={() => setHoveredBadgeId(badge.id)}
                  onMouseLeave={() => setHoveredBadgeId((current) => (current === badge.id ? null : current))}
                >
                  <div
                    className={`flex items-center justify-center transition-all duration-300 ${
                      isCenter ? 'h-20 md:h-24' : 'h-16 md:h-18'
                    }`}
                    style={{ minWidth: isCenter ? '5.5rem' : '4.5rem' }}
                  >
                    {badge.imageUrl ? (
                      <img
                        src={badge.imageUrl}
                        alt={badge.name}
                        className={`h-full w-auto object-contain transition-transform duration-300 ${
                          isCenter ? 'scale-110' : 'scale-100'
                        }`}
                        loading="lazy"
                      />
                    ) : (
                      <span className={`text-white ${isCenter ? 'text-3xl' : 'text-2xl'}`}>🏅</span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex items-center justify-center h-20 md:h-24 min-w-[5.5rem] px-6">
              <span className="text-gray-400 text-sm font-semibold tracking-wide uppercase">No badges available</span>
            </div>
          )}
        </div>

        {badges.length > 3 && (
          <button
            className={`p-1 rounded-full transition-colors ${
              startIndex + 3 >= badges.length || animationState !== 'idle'
                ? 'text-gray-600 cursor-not-allowed'
                : 'text-gray-300 hover:text-white'
            }`}
            onClick={handleNext}
            disabled={startIndex + 3 >= badges.length || animationState !== 'idle'}
            aria-label="Next badges"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
        </div>
      </div>

      <div className="border-t border-gray-700 pt-3">
  <div className="w-full flex justify-between items-start">
    <div>
      <h3 className="text-white text-sm font-semibold">Badges</h3>
      <p className="text-gray-400 text-lg font-bold">{totalBadges}</p>
    </div>

    <div className="text-right">
      <div className="flex items-center gap-2">
        <div className="h-12 flex items-center justify-center">
          {recentBadge.imageUrl ? (
            <img
            src={recentBadge.imageUrl}
            alt={recentBadge.title}
            className="h-full w-auto object-contain"
            style={{ transform: 'scale(1.2)' }}
            loading="lazy"
            />
          ) : (
            <span className="text-white text-base">🏅</span>
          )}
        </div>
        <div>
          <h4 className="text-gray-400 text-xs mb-2">Most Recent Badge</h4>
          <h5 className="text-white font-semibold text-xs">{recentBadge.title}</h5>
        </div>
      </div>
    </div>
  </div>
</div>
    </div>
  );
};

