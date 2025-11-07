const ContestInfoShimmer = () => {
  return (
    <div className="bg-black text-white flex flex-col min-h-screen">
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Contest header with thumbnail */}
            <div className="bg-gray-900/60 backdrop-blur rounded-xl border border-gray-800 overflow-hidden">
              <div className="relative h-64 bg-gradient-to-br from-gray-800 to-gray-900 shimmer-animation">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="h-8 bg-gray-700/60 rounded-lg mb-3 w-3/4 shimmer-animation"></div>
                  <div className="h-4 bg-gray-700/60 rounded w-1/2 shimmer-animation"></div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="px-1">
              <div className="h-6 bg-gray-700/60 rounded-lg mb-3 w-32 shimmer-animation"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-700/60 rounded w-full shimmer-animation"></div>
                <div className="h-4 bg-gray-700/60 rounded w-full shimmer-animation"></div>
                <div className="h-4 bg-gray-700/60 rounded w-5/6 shimmer-animation"></div>
              </div>
            </div>

            {/* Timer and Button side-by-side */}
            <div className="px-1 grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
              {/* Timer Section */}
              <div className="flex flex-col justify-center lg:items-start items-center lg:max-w-md w-full mx-auto">
                <div className="h-6 bg-gray-700/60 rounded-lg mb-4 w-40 shimmer-animation"></div>
                <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto lg:mx-0 w-full">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="text-center">
                      <div className="bg-gray-900 rounded-lg p-3 border border-gray-800">
                        <div className="h-8 bg-gray-700/60 rounded mb-2 shimmer-animation"></div>
                        <div className="h-3 bg-gray-700/60 rounded w-12 mx-auto shimmer-animation"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Button Section */}
              <div className="flex items-center justify-center lg:justify-end">
                <div className="w-full max-w-xs">
                  <div className="h-12 bg-gray-700/60 rounded-lg shimmer-animation"></div>
                </div>
              </div>
            </div>

            {/* Timing details */}
            <div className="px-1">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gray-700/60 rounded shimmer-animation"></div>
                    <div className="flex-1">
                      <div className="h-3 bg-gray-700/60 rounded w-20 mb-2 shimmer-animation"></div>
                      <div className="h-4 bg-gray-700/60 rounded w-32 shimmer-animation"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Coin Rewards */}
            <div className="px-1">
              <div className="bg-gray-900/60 backdrop-blur rounded-xl border border-gray-800 p-4">
                <div className="h-5 bg-gray-700/60 rounded w-32 mb-4 shimmer-animation"></div>
                <div className="grid grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="text-center">
                      <div className="h-12 w-12 bg-gray-700/60 rounded-full mx-auto mb-2 shimmer-animation"></div>
                      <div className="h-4 bg-gray-700/60 rounded w-16 mx-auto shimmer-animation"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Leaderboard */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:h-full">
            <div className="flex-1 flex flex-col min-h-0 px-1">
              <div className="flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-gray-700/60 rounded mr-2 shimmer-animation"></div>
                <div className="h-6 bg-gray-700/60 rounded w-32 shimmer-animation"></div>
              </div>
              <div className="space-y-2 flex-1 min-h-0">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-700/60 rounded-full shimmer-animation"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-700/60 rounded w-24 mb-2 shimmer-animation"></div>
                        <div className="h-3 bg-gray-700/60 rounded w-16 shimmer-animation"></div>
                      </div>
                      <div className="h-6 bg-gray-700/60 rounded w-12 shimmer-animation"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Contest Rules */}
        <div className="py-6">
          <div className="bg-gray-900/60 backdrop-blur rounded-xl border border-gray-800 p-5">
            <div className="h-6 bg-gray-700/60 rounded w-32 mb-4 shimmer-animation"></div>
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gray-700/60 rounded-full mt-2 shimmer-animation"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-700/60 rounded w-full mb-1 shimmer-animation"></div>
                    <div className="h-4 bg-gray-700/60 rounded w-5/6 shimmer-animation"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestInfoShimmer;

