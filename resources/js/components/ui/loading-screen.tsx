"use client";

import { Loader2 } from "lucide-react";

interface LoadingScreenProps {
  isOpen: boolean;
}

export default function LoadingScreen({
  isOpen
}: LoadingScreenProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-2xl relative overflow-hidden max-w-xs sm:max-w-sm md:max-w-md mx-auto">
        {/* Background Decoration */}
        <div className="absolute inset-0 bg-gradient-to-tr from-red-100/50 to-white overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-red-100 rounded-full blur-2xl -translate-x-8 -translate-y-8"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-24 sm:h-24 bg-red-200/80 rounded-full blur-2xl translate-x-2 translate-y-2"></div>
        </div>
        
        {/* Loader Container */}
        <div className="relative flex flex-col items-center py-6 sm:py-8">
          {/* Pulsing Circle Behind Loader */}
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-20"></span>
          
          {/* Spinner */}
          <Loader2 className="h-14 w-14 sm:h-16 sm:w-16 text-red-600 animate-spin relative z-10" />
          
          {/* Loading text */}
          <p className="mt-6 text-base sm:text-lg font-medium text-gray-700">Mohon Tunggu</p>
          <p className="text-sm text-gray-500">Sedang memproses data...</p>
        </div>
      </div>
    </div>
  );
} 