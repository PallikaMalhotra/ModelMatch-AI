'use client';

export function LoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-16 h-16 mb-6">
        {/* Animated gradient ring */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-600 border-r-purple-400 animate-spin" />
        <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-purple-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" />
        </div>
      </div>

      <p className="text-gray-600 font-medium text-center mb-2">
        Finding the best models for your task...
      </p>
      <p className="text-sm text-gray-500 text-center">
        Analyzing benchmarks and generating recommendations
      </p>

      {/* Progress indicator */}
      <div className="mt-6 w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full animate-pulse" />
      </div>
    </div>
  );
}
