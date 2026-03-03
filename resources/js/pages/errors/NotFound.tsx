import { Head, Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { ArrowLeft, FolderX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotFoundProps {
  status: number;
  message: string;
}

export default function NotFound({ status, message }: NotFoundProps) {
  return (
    <>
      <Head title="404 - Halaman Tidak Ditemukan" />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4 relative overflow-hidden">
        {/* Background Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-red-50/40 to-red-100/30"></div>
        
        {/* Cross Blob - Top Left */}
        <div className="absolute -left-12 top-24 w-28 h-28 opacity-5 pointer-events-none">
            <motion.div
                animate={{
                    rotate: [0, -360],
                }}
                transition={{
                    duration: 28,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="w-full h-full"
            >
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-red-500">
                    <path d="M85,40 h30 v45 h45 v30 h-45 v45 h-30 v-45 h-45 v-30 h45 z" />
                </svg>
            </motion.div>
        </div>

        {/* Cross Blob - Bottom Right */}
        <div className="absolute right-8 bottom-16 w-20 h-20 opacity-5 pointer-events-none">
            <motion.div
                animate={{
                    rotate: [360, 0],
                }}
                transition={{
                    duration: 22,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="w-full h-full"
            >
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-red-500">
                    <path d="M85,40 h30 v45 h45 v30 h-45 v45 h-30 v-45 h-45 v-30 h45 z" />
                </svg>
            </motion.div>
        </div>

        {/* Circle Blob - Top Right */}
        <div className="absolute right-24 top-32 w-24 h-24 opacity-5 pointer-events-none">
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 180],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="w-full h-full"
            >
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-red-500">
                    <circle cx="100" cy="100" r="80" />
                </svg>
            </motion.div>
        </div>
        
        {/* Wave Blob - Left Center */}
        <div className="absolute -left-10 top-1/2 w-32 h-32 opacity-5 pointer-events-none">
            <motion.div
                animate={{
                    rotate: [0, 180],
                    y: [0, 15, 0],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="w-full h-full"
            >
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-red-500">
                    <path d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-1C87.1,14.2,81.7,28.5,73.3,41.1C64.9,53.8,53.5,64.9,40.2,71.1C26.9,77.3,11.6,78.6,-1.2,80.6C-14.1,82.5,-28.1,85.1,-40.9,80.7C-53.8,76.3,-65.3,64.9,-73.6,51.7C-81.9,38.5,-86.9,23.6,-87.1,8.5C-87.3,-6.5,-82.8,-21.7,-75.4,-34.9C-68.1,-48.2,-57.9,-59.6,-45.2,-67.5C-32.4,-75.3,-16.2,-79.6,-0.2,-79.3C15.8,-79,31.6,-74,44.7,-76.4Z" transform="translate(100 100)" />
                </svg>
            </motion.div>
        </div>
        
        {/* Triangle Blob - Bottom Left */}
        <div className="absolute left-20 bottom-24 w-16 h-16 opacity-5 pointer-events-none">
            <motion.div
                animate={{
                    rotate: [0, 360],
                    scale: [1, 0.9, 1],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="w-full h-full"
            >
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-red-500">
                    <polygon points="100,10 40,180 160,180" />
                </svg>
            </motion.div>
        </div>
        
        {/* Square Blob - Top Center */}
        <div className="absolute left-1/2 -translate-x-1/2 top-10 w-16 h-16 opacity-5 pointer-events-none">
            <motion.div
                animate={{
                    rotate: [45, 0, 45],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="w-full h-full"
            >
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-red-500">
                    <rect x="50" y="50" width="100" height="100" />
                </svg>
            </motion.div>
        </div>
        
        {/* Hexagon Blob - Right Center */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-24 h-24 opacity-5 pointer-events-none">
            <motion.div
                animate={{
                    rotate: [0, -360],
                    x: [0, -10, 0],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="w-full h-full"
            >
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-red-500">
                    <path d="M148,183.7H52c-12.7,0-23-10.3-23-23v-96c0-8.9,5.2-17.1,13.4-20.9l96-44c6.3-2.9,13.5-2.9,19.8,0l96,44c8.2,3.8,13.4,11.9,13.4,20.9v96C171,173.4,160.7,183.7,148,183.7z" transform="scale(0.5) translate(100, 100)" />
                </svg>
            </motion.div>
        </div>

        <div className="w-full max-w-xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-50">
              <div className="absolute -inset-1 rounded-full bg-red-100/40 blur-md"></div>
              <FolderX className="h-12 w-12 text-red-500" />
            </div>
            <motion.h1 
              className="mb-2 text-6xl font-bold text-gray-900"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {status}
            </motion.h1>
            <h2 className="mb-3 text-2xl font-bold text-gray-800">
              Halaman Tidak Ditemukan
            </h2>
            <p className="text-gray-600 mb-8">
              {message || "Maaf, halaman yang Anda cari tidak ditemukan atau telah dipindahkan."}
            </p>
          </motion.div>

          <div className="flex justify-center">
            <Button
              asChild
              className="bg-red-600 hover:bg-red-700 text-white py-5 gap-2 text-base relative overflow-hidden group"
            >
              <Link href="/">
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-red-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <ArrowLeft className="h-5 w-5 relative z-10" />
                <span className="relative z-10">Kembali ke Beranda</span>
              </Link>
            </Button>
          </div>

          <div className="mt-16 text-sm text-gray-500">
            &copy; {new Date().getFullYear()} IT-ESEGA 2025. All rights reserved.
          </div>
        </div>
      </div>
    </>
  );
} 