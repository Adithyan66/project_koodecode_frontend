import React from 'react';

const ProblemsListShimmer: React.FC = () => {
    const bannerPlaceholders = Array.from({ length: 4 });

    return (
        <div className="max-w-[1400px] mx-auto px-6 py-8">
            <div className="animate-pulse">
                <div className="grid grid-cols-4 gap-4 mb-6">
                    {bannerPlaceholders.map((_, index) => (
                        <div
                            key={index}
                            className="h-32 rounded-xl bg-gray-900"
                        />
                    ))}
                </div>

                <div className="flex gap-6">
                    <div className="flex-1 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <div className="h-10 w-80 rounded-lg bg-gray-900" />
                                    <div className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-gray-800" />
                                </div>
                                <div className="h-10 w-40 rounded-lg bg-gray-900" />
                            </div>
                            <div className="h-4 w-32 rounded bg-gray-900" />
                        </div>

                        <div className="h-64 rounded-xl bg-gray-900" />
                    </div>

                    <div className="w-80 space-y-4">
                        <div className="h-8 w-40 rounded bg-gray-900" />
                        <div className="bg-gray-900 rounded-xl p-4 space-y-3">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <div key={index} className="h-6 rounded bg-gray-800" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProblemsListShimmer;
