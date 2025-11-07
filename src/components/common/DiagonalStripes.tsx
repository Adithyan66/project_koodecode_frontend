import React from 'react';

const DiagonalStripes: React.FC = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <svg
                className="absolute left-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[600px] md:h-[600px] lg:w-[700px] lg:h-[700px] animate-fade-in"
                viewBox="0 0 500 500"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <linearGradient id="stripe1" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#22c55e', stopOpacity: 0.4 }} />
                        <stop offset="100%" style={{ stopColor: '#15803d', stopOpacity: 0.15 }} />
                    </linearGradient>
                    <linearGradient id="stripe2" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#22c55e', stopOpacity: 0.4 }} />
                        <stop offset="100%" style={{ stopColor: '#166534', stopOpacity: 0.15 }} />
                    </linearGradient>
                    <linearGradient id="stripe3" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#22c55e', stopOpacity: 0.4 }} />
                        <stop offset="100%" style={{ stopColor: '#14532d', stopOpacity: 0.15 }} />
                    </linearGradient>
                </defs>

                <g className="animate-float-slow">
                    <rect
                        x="50"
                        y="50"
                        width="80"
                        height="350"
                        rx="8"
                        fill="url(#stripe1)"
                        transform="rotate(45 150 225)"
                        className="animate-pulse-subtle"
                    />
                </g>

                <g className="animate-float-medium">
                    <rect
                        x="150"
                        y="50"
                        width="80"
                        height="350"
                        rx="8"
                        fill="url(#stripe2)"
                        transform="rotate(45 250 225)"
                        className="animate-pulse-subtle"
                        style={{ animationDelay: '0.5s' }}
                    />
                </g>

                <g className="animate-float-fast">
                    <rect
                        x="250"
                        y="50"
                        width="80"
                        height="350"
                        rx="8"
                        fill="url(#stripe3)"
                        transform="rotate(45 350 225)"
                        className="animate-pulse-subtle"
                        style={{ animationDelay: '1s' }}
                    />
                </g>
            </svg>

            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes floatSlow {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-20px);
                    }
                }

                @keyframes floatMedium {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-15px);
                    }
                }

                @keyframes floatFast {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }

                @keyframes pulseSubtle {
                    0%, 100% {
                        opacity: 0.4;
                    }
                    50% {
                        opacity: 0.6;
                    }
                }

                .animate-fade-in {
                    animation: fadeIn 1.5s ease-in-out;
                }

                .animate-float-slow {
                    animation: floatSlow 8s ease-in-out infinite;
                }

                .animate-float-medium {
                    animation: floatMedium 6s ease-in-out infinite;
                    animation-delay: 0.5s;
                }

                .animate-float-fast {
                    animation: floatFast 4s ease-in-out infinite;
                    animation-delay: 1s;
                }

                .animate-pulse-subtle {
                    animation: pulseSubtle 3s ease-in-out infinite;
                }

                @media (max-width: 768px) {
                    .animate-fade-in {
                        transform: scale(0.7) translateX(-50px);
                    }
                }

                @media (max-width: 480px) {
                    .animate-fade-in {
                        transform: scale(0.5) translateX(-80px) rotate(-10deg);
                    }
                }
            `}</style>
        </div>
    );
};

export default DiagonalStripes;

