"use client";

import { motion } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface SuccessDialogProps {
  isOpen: boolean;
  message: string;
  title?: string;
  buttonText?: string;
  redirectUrl?: string;
  onClose?: () => void;
}

export default function SuccessDialog({
  isOpen,
  message,
  title = "Pendaftaran Berhasil!",
  buttonText = "Kembali ke Beranda",
  redirectUrl = "/",
  onClose
}: SuccessDialogProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Untuk menampilkan animasi masuk
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  };

  // Tampilkan konfeti
  useEffect(() => {
    if (isVisible) {
      const createConfetti = () => {
        const confettiContainer = document.getElementById('confetti-container');
        if (!confettiContainer) return;

        for (let i = 0; i < 200; i++) {
          const confetti = document.createElement('div');
          confetti.className = 'confetti';
          
          // Warna acak untuk konfeti - disesuaikan dengan warna tema --secondary (#4D7A8C)
          const colors = ['#4D7A8C', '#719ba9', '#365866', '#a6bfca', '#d3e0e5', '#60a5fa', '#dbeafe', '#ffffff'];
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          
          // Ukuran acak (lebih besar di desktop untuk mencocokkan skala segede gaban)
          const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
          const size = Math.random() * (isMobile ? 12 : 24) + (isMobile ? 5 : 12);
          
          // Posisi awal acak
          const startX = Math.random() * window.innerWidth;
          
          // Kecepatan animasi acak
          const duration = Math.random() * 3 + 2;
          
          // Bentuk acak (bulat atau persegi)
          const isCircle = Math.random() > 0.5;
          
          confetti.style.backgroundColor = randomColor;
          confetti.style.width = `${size}px`;
          confetti.style.height = `${size}px`;
          confetti.style.left = `${startX}px`;
          confetti.style.top = '-20px';
          confetti.style.position = 'absolute';
          confetti.style.borderRadius = isCircle ? '50%' : '0';
          confetti.style.opacity = '0.8';
          confetti.style.animation = `fall ${duration}s linear forwards`;
          
          confettiContainer.appendChild(confetti);
          
          // Hapus konfeti setelah animasi selesai
          setTimeout(() => {
            confetti.remove();
          }, duration * 1000);
        }
      };
      
      // Tambahkan style untuk animasi
      const style = document.createElement('style');
      style.id = 'confetti-style';
      style.innerHTML = `
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.8;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
      
      // Buat konfeti saat modal terbuka
      createConfetti();
      
      return () => {
        // Bersihkan style saat komponen unmount
        const styleElement = document.getElementById('confetti-style');
        if (styleElement) {
          styleElement.remove();
        }
      };
    }
  }, [isVisible]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm overflow-hidden">
      <div id="confetti-container" className="fixed inset-0 pointer-events-none" />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.4, type: "spring", stiffness: 120 }}
        className="bg-white rounded-2xl md:rounded-[3rem] shadow-2xl max-w-lg md:max-w-[90vw] lg:max-w-[80vw] w-full mx-4 relative overflow-hidden transition-all duration-300"
      >
        {/* Dekorasi latar belakang */}
        <div className="absolute -top-24 -right-24 md:-top-48 md:-right-48 w-48 md:w-96 h-48 md:h-96 bg-secondary/15 rounded-full"></div>
        <div className="absolute -bottom-24 -left-24 md:-bottom-48 md:-left-48 w-48 md:w-96 h-48 md:h-96 bg-secondary/5 rounded-full"></div>
        
        {/* Garis atas */}
        <div className="bg-secondary h-3 md:h-6" />
        
        {/* Tombol close */}
        <button 
          onClick={handleClose}
          className="absolute right-4 top-4 md:right-8 md:top-8 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <X className="h-6 w-6 md:h-12 md:w-12" />
        </button>
        
        <div className="px-8 sm:px-10 py-12 md:px-20 md:py-24 lg:px-28 lg:py-32 relative z-10">
          <div className="flex flex-col items-center gap-8 md:gap-16 text-center">
            {/* Icon sukses dengan efek */}
            <div className="relative inline-flex">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="p-6 md:p-12 bg-green-50 rounded-full">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-20"></span>
                  <CheckCircle2 className="h-16 w-16 md:h-40 md:w-40 text-green-600 relative z-10" />
                </div>
              </motion.div>
            </div>
            
            {/* Judul dan pesan */}
            <div className="space-y-4 md:space-y-8">
              <motion.h2 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl md:text-7xl lg:text-8xl font-bold md:font-black text-gray-800"
              >
                {title}
              </motion.h2>
              <motion.p 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-gray-600 text-lg md:text-3xl lg:text-4xl leading-relaxed md:leading-normal"
              >
                {message}
              </motion.p>
            </div>
            
            {/* Tombol aksi */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="w-full pt-4 md:pt-8"
            >
              <Button
                onClick={handleClose}
                className="w-full bg-secondary hover:bg-secondary/90 
                text-white py-4 px-6 md:py-8 md:px-12 rounded-xl md:rounded-2xl font-medium transition-all duration-300 text-lg md:text-3xl lg:text-4xl
                shadow-[0_4px_20px_-3px_rgba(77,122,140,0.4)] hover:shadow-[0_8px_25px_-5px_rgba(77,122,140,0.6)]
                flex items-center justify-center gap-2"
              >
                {buttonText}
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 