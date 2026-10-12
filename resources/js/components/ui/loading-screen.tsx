"use client";

import { Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface LoadingScreenProps {
  isOpen: boolean;
  message?: string;
  subMessage?: string;
}

export default function LoadingScreen({
  isOpen,
  message = "Mohon Tunggu",
  subMessage = "Sedang memproses data...",
}: LoadingScreenProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-2xl relative overflow-hidden max-w-xs sm:max-w-sm md:max-w-md mx-auto">
        {/* Background Decoration */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/50 to-white overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-blue-100 rounded-full blur-2xl -translate-x-8 -translate-y-8"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-24 sm:h-24 bg-blue-200/80 rounded-full blur-2xl translate-x-2 translate-y-2"></div>
        </div>
        
        {/* Loader Container */}
        <div className="relative flex flex-col items-center py-6 sm:py-8">
          {/* Pulsing Circle Behind Loader */}
          <span className="animate-ping absolute inline-flex h-16 w-16 rounded-full bg-blue-400 opacity-20"></span>
          
          {/* Spinner */}
          <Loader2 className="h-14 w-14 sm:h-16 sm:w-16 text-blue-600 animate-spin relative z-10" />
          
          {/* Loading text dengan animasi pergantian pesan */}
          <div className="mt-6 text-center min-h-[3.5rem]">
            <AnimatePresence mode="wait">
              <motion.p
                key={message}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="text-base sm:text-lg font-semibold text-gray-800"
              >
                {message}
              </motion.p>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.p
                key={subMessage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-sm text-gray-500 mt-1"
              >
                {subMessage}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}