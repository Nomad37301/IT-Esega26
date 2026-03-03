'use client';

import { Footer } from '@/components/footer';
import TimelineSection from '@/components/home/timeline';
import { Navbar } from '@/components/navbar';
import { Event } from '@/types/event';
import { UserType } from '@/types/user';
import { Dialog, Disclosure, Transition } from '@headlessui/react';
import { Head, Link, usePage } from '@inertiajs/react';
import * as AOS from 'aos';
import 'aos/dist/aos.css';
import { motion } from 'framer-motion';
import { useEffect, useState, Fragment } from 'react';
import { route } from 'ziggy-js';
import { Inertia } from '@inertiajs/inertia';

// Keen Slider imports
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import dayjs from 'dayjs';

export default function Home() {
    const { user, flash, event = { data: [] }, showSecondTeamRegistration } = usePage<{ 
        user: { data: UserType }, 
        flash: { success?: string; error?: string; info?: string }; 
        event: { data: Event[] },
        showSecondTeamRegistration?: boolean
    }>().props;
    const [isOpen, setIsOpen] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showDoubleSlotNotification, setShowDoubleSlotNotification] = useState(false);
    const [sliderRef, instanceRef] = useKeenSlider(
        {
            initial: 0,
            slides: { perView: 1 }, // Satu gambar per slide
            loop: true,
            mode: "snap", // Pastikan mode snap agar hanya satu slide penuh
            renderMode: "performance",
            drag: true,
            slideChanged(slider) {
                setCurrentSlide(slider.track.details.rel);
            },
            created(slider) {
                setCurrentSlide(slider.track.details.rel);
            },
        }
    );
    const [currentSlide, setCurrentSlide] = useState(0);
    const [showMerchPopup, setShowMerchPopup] = useState(true);

    // State for merch popup slider
    const [popupSlide, setPopupSlide] = useState(0);
    const [popupSliderRef, popupInstanceRef] = useKeenSlider({
        initial: 0,
        slides: { perView: 1 },
        loop: true,
        mode: 'snap',
        renderMode: 'performance',
        drag: true,
        slideChanged(slider) {
            setPopupSlide(slider.track.details.rel);
        },
        created(slider) {
            setPopupSlide(slider.track.details.rel);
        },
    });

    // Auto slide effect
    useEffect(() => {
        const interval = setInterval(() => {
            if (instanceRef.current) {
                instanceRef.current.next();
            }
        }, 3500); // 3.5 detik per slide
        return () => clearInterval(interval);
    }, [instanceRef]);

    // Auto slide effect for popup slider
    useEffect(() => {
        const interval = setInterval(() => {
            if (popupInstanceRef.current) {
                popupInstanceRef.current.next();
            }
        }, 3500); // 3.5 detik per slide
        return () => clearInterval(interval);
    }, [popupInstanceRef]);

    // Debugging data timeline
    console.log('Timeline data dari API:', event);

    // const auth = user;

    console.log('Dari Home', user);

    // console.log(auth?.roles?.[0]?.name)

    useEffect(() => {
        // Jika ada flash success message, tampilkan animasi
        if (flash?.success) {
            setShowSuccess(true);
            // Otomatis hilangkan animasi setelah 5 detik
            const timer = setTimeout(() => {
                setShowSuccess(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [flash?.success]);
    
    // Cek apakah user perlu mendaftar tim kedua (double slot)
    useEffect(() => {
        if (showSecondTeamRegistration) {
            setShowDoubleSlotNotification(true);
            // Notifikasi akan tetap ada sampai user mengklik tombol close
        }
    }, [showSecondTeamRegistration]);

    const navItems = [
        { title: 'Home', href: route('home') },
        { title: 'About', href: route('about') },
        { title: 'FAQ', href: '#faq' },
        { title: 'Contact', href: '#contact' },
        { title: 'Bracket', href: route('bracket') },
        { title: 'Register', href: route('register') },
    ];

    useEffect(() => {
        // Inisialisasi AOS hanya sekali saat komponen di-mount
        AOS.init({
            duration: 800,
            once: true,
            easing: 'ease-out-cubic',
            offset: 100,
            delay: 0,
            mirror: false,
            anchorPlacement: 'top-bottom',
            disable: 'mobile' // Opsional: menonaktifkan pada perangkat mobile jika perlu
        });
    }, []); // Empty dependency array ensures this runs only once on mount

    const faqs = [
        {
            question: 'Apa itu IT-ESEGA?',
            answer: 'IT-ESEGA adalah ajang kompetisi teknologi bergengsi yang jadi tempat berkumpulnya para peserta terbaik dari berbagai daerah di seluruh Indonesia.',
        },
        {
            question: 'Bagaimana saya bisa mendaftar?',
            answer: 'Kamu bisa mendaftar untuk turnamen ini dengan mengklik tombol "Daftar Sekarang" di halaman utama kami.',
        },
        {
            question: 'Game apa saja yang dimainkan dalam turnamen ini?',
            answer: 'Turnamen ini menghadirkan game-game populer seperti Mobile Legends dan Free Fire.',
        },
        {
            question: 'Berapa total prize pool IT-ESEGA?',
            answer: 'Total prize pool IT-ESEGA adalah sebesar IDR 12.000.000.',
        },
        {
            question: 'Berapa biaya registrasi setiap game?',
            answer: 'Biaya registrasi untuk setiap game adalah IDR 100.000.',
        },
        {
            question: 'Apakah bisa mendaftar lebih dari satu game?',
            answer: 'Ya, kamu bisa mendaftar lebih dari satu game selama memenuhi syarat dan membayar biaya masing-masing.',
        },
        {
            question: 'Siapa saja yang boleh ikut serta?',
            answer: 'Turnamen ini terbuka untuk umum dan dapat diikuti oleh siapa saja dari seluruh Indonesia, tidak terbatas hanya mahasiswa.',
        },
    ];

    // Data preorder merch
    const merchData = [
        {
            title: 'T-Shirt IT-ESEGA 2025',
            desc: 'Kaos eksklusif IT-ESEGA 25 dengan desain eksklusif, nyaman dipakai, dan cocok untuk semua kalangan. Tunjukkan dukunganmu di event tahun ini!',
            link: 'https://bit.ly/MerchandiseITESEGA2025',
            images: ['/Images/tshirt-merch.png'],
            price: 'Rp 125.000,-',
            preorder: 'Periode Extend Pre-Order: 5 Juni 2025 – 7 Juli 2025',
        },
        {
            title: 'Retro Jersey IT-ESEGA 2025',
            desc: 'Jersey retro edisi spesial IT-ESEGA 25, desain sporty dan stylish, cocok untuk koleksi maupun dipakai harian. Dapatkan sebelum kehabisan!',
            link: 'https://bit.ly/RetroJerseyITESEGA2025',
            images: ['/Images/jersey-merch-2.png'],
            price: 'Rp 150.000,-',
            preorder: 'Periode Pre-Order: 27 Juni 2025 – 7 Juli 2025',
        },
    ];

    // Flatten merchData to get one image per slide, but keep info reference
    const merchSlides = merchData.flatMap((merch, merchIdx) =>
        merch.images.map((img, imgIdx) => ({
            ...merch,
            image: img,
            merchIdx,
            imgIdx,
            totalImages: merch.images.length,
        }))
    );
    const activeInfo = merchSlides && merchSlides.length > 0 ? merchSlides[currentSlide] : merchData[0];

    // Hapus useEffect router.on('navigate', ...) yang error

    // Tambahkan deklarasi merchImage sebelum return agar bisa digunakan di JSX
    const merchImage = (activeInfo as any).image || (activeInfo as any).images?.[0] || '/Images/LogoEsega25.png';

    useEffect(() => {
        setShowMerchPopup(true); // Always show on mount/reload
    }, []);

    // === PENDAFTARAN OTOMATIS TUTUP ===
    const REGISTRATION_DEADLINE = dayjs('2025-07-02T00:00:00');
    const [isRegistrationClosed, setIsRegistrationClosed] = useState(false);
    const [showClosedPopup, setShowClosedPopup] = useState(false);

    useEffect(() => {
        const now = dayjs();
        setIsRegistrationClosed(now.isAfter(REGISTRATION_DEADLINE));
        const interval = setInterval(() => {
            setIsRegistrationClosed(dayjs().isAfter(REGISTRATION_DEADLINE));
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {/* Merch Popup Modal with Horizontal Layout and Professional Style */}
            <Transition appear show={showMerchPopup} as={Fragment}>
                <Dialog as="div" className="fixed inset-0 z-[100] overflow-y-auto" onClose={() => setShowMerchPopup(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-200"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-150"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
                    </Transition.Child>
                    <div className="flex items-center justify-center min-h-screen p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-200"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-150"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-5xl h-[600px] md:h-[500px] p-0 overflow-hidden transition-all transform bg-white shadow-2xl rounded-2xl relative flex items-center justify-center">
                                <button
                                    onClick={() => setShowMerchPopup(false)}
                                    className="absolute z-20 p-2 text-gray-400 transition rounded-full top-4 right-4 hover:bg-gray-100 hover:text-gray-600"
                                >
                                    <span className="sr-only">Close</span>
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                <div className="flex flex-col items-stretch w-full h-full md:flex-row">
                                    {/* Left: Keen Slider for merch images */}
                                    <div className="relative flex items-center justify-center w-full h-full p-6 bg-gray-50 md:w-3/5 md:p-10">
                                        <button
                                            aria-label="Sebelumnya"
                                            onClick={() => popupInstanceRef.current?.prev()}
                                            className="absolute z-10 p-2 text-red-600 transition -translate-y-1/2 border border-red-200 rounded-full shadow left-2 top-1/2 bg-white/80 hover:bg-red-100 disabled:opacity-50"
                                            style={{ display: merchSlides.length > 1 ? 'block' : 'none' }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                                        </button>
                                        <div ref={popupSliderRef} className="flex w-full h-full overflow-hidden keen-slider">
                                            {merchSlides.map((slide, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center justify-center w-full min-w-0 keen-slider__slide"
                                                >
                                                    <img src={slide.image} alt={slide.title} className="h-[340px] md:h-[420px] w-auto max-w-full object-contain drop-shadow rounded-xl mx-auto" />
                                                </div>
                                            ))}
                                        </div>
                                        <button
                                            aria-label="Selanjutnya"
                                            onClick={() => popupInstanceRef.current?.next()}
                                            className="absolute z-10 p-2 text-red-600 transition -translate-y-1/2 border border-red-200 rounded-full shadow right-2 top-1/2 bg-white/80 hover:bg-red-100 disabled:opacity-50"
                                            style={{ display: merchSlides.length > 1 ? 'block' : 'none' }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                        </button>
                                        {/* Dot navigation */}
                                        <div className="absolute left-0 flex justify-center w-full gap-2 mt-4 bottom-4">
                                            {merchSlides.map((_, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => popupInstanceRef.current?.moveToIdx(idx)}
                                                    className={`w-3 h-3 rounded-full ${popupSlide === idx ? 'bg-red-600' : 'bg-gray-300'} transition`}
                                                ></button>
                                            ))}
                                        </div>
                                    </div>
                                    {/* Right: Info Merch (sync with popupSlide) */}
                                    <div className="flex flex-col justify-center w-full h-full p-6 md:w-2/5 md:p-10">
                                        <h3 className="mb-3 text-2xl font-extrabold leading-tight text-gray-900 md:text-3xl">
                                            {merchSlides[popupSlide].title}
                                        </h3>
                                        <div className="mb-2 text-xl font-bold text-red-600 md:text-2xl">
                                            {merchSlides[popupSlide].price}
                                        </div>
                                        <div className="mb-4 text-xs font-medium text-gray-500 md:text-sm">
                                            {merchSlides[popupSlide].preorder}
                                        </div>
                                        {/* Hapus deskripsi untuk tampilan lebih clean */}
                                        {/* <p className="mb-6 text-sm text-left text-gray-700 md:text-base">{merchSlides[popupSlide].desc}</p> */}
                                        <a
                                            href={merchSlides[popupSlide].link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center w-full py-3 mb-2 -mt-2 text-base font-bold text-white transition bg-red-600 rounded-lg shadow px-7 hover:bg-red-700 sm:w-auto sm:mt-6 sm:mb-0"
                                            style={{ letterSpacing: '0.5px' }}
                                        >
                                            <svg className="w-5 h-5 mr-2 -ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18m-6-6l6 6-6 6" />
                                            </svg>
                                            Order Now
                                        </a>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>

            {/* Head title tetap */}
            <Head title="IT-ESEGA 2025 Official Website" />
            
            {/* Notifikasi Double Slot */}
            <Transition
                show={showDoubleSlotNotification}
                as={Fragment}
                enter="transform transition duration-500"
                enterFrom="translate-y-full opacity-0"
                enterTo="translate-y-0 opacity-100"
                leave="transform transition duration-500"
                leaveFrom="translate-y-0 opacity-100"
                leaveTo="translate-y-full opacity-0"
            >
                <div className="fixed z-50 px-6 py-4 text-white transform -translate-x-1/2 shadow-lg top-6 left-1/2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                    <div className="flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <span className="block font-medium">Pendaftaran Double Slot</span>
                            <span className="text-sm">Anda telah mendaftar tim pertama dengan Double Slot. Silakan mendaftar untuk tim kedua Anda sekarang!</span>
                        </div>
                        <Link
                            href={route('register')}
                            className="px-3 py-1 ml-2 text-sm font-medium text-blue-600 transition-colors bg-white rounded hover:bg-blue-50"
                        >
                            Daftar Tim Kedua
                        </Link>
                        <button
                            onClick={() => setShowDoubleSlotNotification(false)}
                            className="ml-2 text-white transition-colors hover:text-blue-100"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            </Transition>
            
            {/* Notifikasi Sukses dengan Animasi */}
            <Transition
                show={showSuccess}
                as={Fragment}
                enter="transform transition duration-500"
                enterFrom="translate-y-full opacity-0"
                enterTo="translate-y-0 opacity-100"
                leave="transform transition duration-500"
                leaveFrom="translate-y-0 opacity-100"
                leaveTo="translate-y-full opacity-0"
            >
                <div className="fixed z-50 px-6 py-4 text-white transform -translate-x-1/2 shadow-lg bottom-6 left-1/2 rounded-xl bg-gradient-to-r from-green-500 to-green-600">
                    <div className="flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-medium">{flash?.success}</span>
                        <button onClick={() => setShowSuccess(false)} className="ml-4 text-white transition-colors hover:text-green-100">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </Transition>

            <div className="relative min-h-screen overflow-hidden text-black bg-white from-primary to-secondary font-poppins">
                {/* Background Overlay */}
                <div
                    className="absolute inset-0 z-0 from-primary to-secondary bg-gradient-to-br opacity-8"
                    style={{
                        backgroundImage: `url('/Images/bg-image.png')`,
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'contain',
                        backgroundPosition: 'top center',
                        backgroundBlendMode: 'overlay',
                    }}
                />

                <div className="relative z-10 mx-auto text-[#333]">
                    <Navbar
                        user={user}
                        logo={
                            <div className="flex items-center justify-start">
                                <img src="/Images/LogoEsega25.png" alt="IT-ESEGA-25 Logo" className="object-contain w-auto h-18" />
                            </div>
                        }
                        items={navItems}
                        isRegistrationClosed={isRegistrationClosed}
                        setShowClosedPopup={setShowClosedPopup}
                    />

                    {/* Hero Section */}
                    <div className="mx-auto max-w-[1350px] px-4 pt-35 pb-16 md:px-8 md:pt-45 md:pb-40 lg:px-12">
                        <div className="relative z-10 grid w-full grid-cols-1 items-center gap-8 md:grid-cols-[1.5fr_1fr]">
                            <div className="text-center md:text-left" data-aos="fade-up">
                                <h1 className="mb-4 text-4xl leading-tight font-black text-[#333] sm:text-7xl">
                                    IT-ESEGA <span className="inline-block text-red-600 transform -skew-x-12">2025</span>
                                </h1>
                                <p className="mx-auto mb-6 max-w-2xl text-base leading-relaxed text-[#333] sm:mb-8 sm:text-xl md:mx-0">
                                    Bergabunglah dalam perlombaan eSport bergengsi. Daftarkan timmu, taklukkan bracket, dan menangkan hadiah jutaan
                                    rupiah! Ayo Menjadi Juara dalam IT-ESEGA 2025
                                </p>
                                <div className="flex justify-center space-x-4 md:justify-start">
                                    {/* HERO SECTION BUTTON */}
                                    <button
                                        type="button"
                                        className="inline-flex items-center px-6 py-3 text-base font-semibold text-white transition-all duration-300 transform bg-red-600 rounded-lg hover:scale-105 hover:bg-red-700 hover:shadow-lg sm:px-8 sm:py-4 sm:text-lg disabled:opacity-60 disabled:cursor-not-allowed"
                                        disabled={isRegistrationClosed}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (isRegistrationClosed) {
                                                setShowClosedPopup(true);
                                            } else {
                                                window.location.href = route('register');
                                            }
                                        }}
                                    >
                                        Register Now!
                                    </button>
                                    <a
                                        href="https://www.instagram.com/reel/DJx6DmICh5B/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-6 py-3 text-base font-semibold text-red-600 transition-all duration-300 transform bg-white border-2 border-red-600 rounded-lg sm:px-8 sm:py-4 sm:text-lg hover:bg-red-50 hover:scale-105 hover:shadow-lg"
                                    >
                                        How to Register
                                    </a>
                                </div>
                            </div>
                            <div className="justify-center hidden md:flex md:justify-end" data-aos="fade-up" data-aos-delay="100">
                                <motion.img
                                    src="/Images/LogoEsega25.png"
                                    alt="IT-ESEGA Logo"
                                    className="h-[420px] w-auto object-contain"
                                    style={{
                                        maxWidth: '100%',
                                        willChange: 'transform',
                                        backfaceVisibility: 'hidden',
                                        transform: 'translateZ(0)',
                                    }}
                                    animate={{
                                        y: [0, -10, 0],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                        type: 'tween',
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Video Tutorial Modal */}
                    <Transition appear show={isOpen} as={Fragment}>
                        <Dialog as="div" className="fixed inset-0 z-[60] overflow-y-auto" onClose={() => setIsOpen(false)}>
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-200"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-150"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="fixed inset-0">
                                    <div className="absolute inset-0 bg-black/50 backdrop-blur" />
                                </div>
                            </Transition.Child>

                            <div className="fixed inset-0 flex items-center justify-center p-4">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-200"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-150"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Dialog.Panel className="w-full max-w-5xl overflow-hidden transition-all transform bg-white shadow-xl rounded-2xl">
                                        <div className="relative pb-8 sm:pb-0"> {/* Tambah padding bawah di mobile */}
                                            {/* Header */}
                                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                                                <Dialog.Title as="h3" className="text-xl font-semibold leading-6 text-gray-900">
                                                    How to Register
                                                </Dialog.Title>
                                                <button
                                                    onClick={() => setIsOpen(false)}
                                                    className="rounded-full p-1.5 text-gray-400 transition-all duration-200 hover:bg-gray-100 hover:text-gray-500"
                                                >
                                                    <span className="sr-only">Close</span>
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>

                                            {/* Video Container */}
                                            <div className="relative bg-black">
                                                <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                                                    <iframe
                                                        className="absolute inset-0 w-full h-full"
                                                        src=""
                                                        title="How to Register IT-ESEGA 2025"
                                                        frameBorder="0"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    ></iframe>
                                                </div>
                                            </div>

                                            {/* Footer */}
                                            <div className="px-6 py-4 bg-gray-50">
                                                <div className="flex items-center justify-between">
                                                    <div className="text-sm text-gray-600">
                                                        Watch the tutorial carefully to understand the registration process
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white transition-colors duration-200 bg-red-600 rounded-md hover:bg-red-700"
                                                        onClick={() => setIsOpen(false)}
                                                    >
                                                        Got it
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </Dialog>
                    </Transition>

                    {/* Competition Section */}
                    <section className="relative py-16 overflow-hidden md:py-24">
                        {/* Background Layer */}
                        <div className="absolute inset-0 bg-white"></div>

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white via-red-50/40 to-red-100/30"></div>

                        {/* Cross Blob - Top Left Competition */}
                        <div className="absolute pointer-events-none top-24 -left-12 h-28 w-28 opacity-5">
                            <motion.div
                                animate={{
                                    rotate: [0, -360],
                                }}
                                transition={{
                                    duration: 28,
                                    repeat: Infinity,
                                    ease: 'linear',
                                }}
                                className="w-full h-full"
                            >
                                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-red-500">
                                    <path d="M85,40 h30 v45 h45 v30 h-45 v45 h-30 v-45 h-45 v-30 h45 z" />
                                </svg>
                            </motion.div>
                        </div>

                        {/* Cross Blob - Bottom Right Competition */}
                        <div className="absolute w-20 h-20 pointer-events-none right-8 bottom-16 opacity-5">
                            <motion.div
                                animate={{
                                    rotate: [360, 0],
                                }}
                                transition={{
                                    duration: 22,
                                    repeat: Infinity,
                                    ease: 'linear',
                                }}
                                className="w-full h-full"
                            >
                                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-red-500">
                                    <path d="M85,40 h30 v45 h45 v30 h-45 v45 h-30 v-45 h-45 v-30 h45 z" />
                                </svg>
                            </motion.div>
                        </div>

                        {/* Content Container */}
                        <div className="relative z-10 mx-auto max-w-[1350px] px-4 md:px-8 lg:px-12">
                            <div className="mb-8 text-center md:mb-12">
                                <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-800 sm:text-4xl" data-aos="fade-up">
                                    Upcoming <span className="text-red-600">Tournament</span>
                                </h2>
                                <div className="w-20 h-1 mx-auto bg-red-600 rounded-full sm:w-24" data-aos="fade-up" data-aos-delay="50"></div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 justify-items-center">
                                {[{
                                    title: "Mobile Legends",
                                    slots: "64 SLOTS",
                                    type: "DOUBLE SLOT",
                                    scope: "NATIONAL COMPETITION",
                                    date: "JULY 12th, 18th, 19th",
                                    mode: "ONLINE",
                                    image: "/Images/ML-logo.png",
                                    bgImage: "/Images/ML-bg-high.jpeg",
                                    delay: 0,
                                    animation: "fade-up",
                                    fee: "Rp 100.000"
                                }, {
                                    title: "Free Fire",
                                    slots: "48 SLOTS",
                                    type: "SINGLE SLOT",
                                    scope: "NATIONAL COMPETITION",
                                    date: "JULY 5th",
                                    mode: "ONLINE",
                                    image: "/Images/FF-logo.png",
                                    bgImage: "/Images/FF-bg-high.jpeg",
                                    delay: 100,
                                    animation: "fade-up",
                                    fee: "Rp 100.000"
                                }].map((game, i) => (
                                    <div
                                        key={i}
                                        className="relative w-full max-w-md p-3 overflow-hidden transition-all duration-500 bg-white border-2 shadow-lg group rounded-2xl border-red-500/50 hover:border-red-500 hover:shadow-2xl"
                                        data-aos={game.animation}
                                        data-aos-delay={game.delay}
                                        style={{ height: '600px' }}
                                    >
                                        {/* Background Game Image */}
                                        <div
                                            className="absolute inset-0 m-3 transition-transform duration-500 bg-center bg-cover rounded-xl group-hover:scale-110"
                                            style={{ backgroundImage: `url(${game.bgImage})` }}
                                        />

                                        {/* Static Dark Overlay for Mobile View Only */}
                                        <div className="absolute inset-0 block rounded-xl bg-black/60 md:hidden" />

                                        {/* Dark Overlay (only on desktop hover) */}
                                        <div className="absolute inset-0 hidden transition-opacity duration-500 opacity-0 rounded-xl bg-gradient-to-t from-black/90 via-black/70 to-transparent group-hover:opacity-100 md:block" />

                                        {/* Content Container */}
                                        <div className="relative flex flex-col items-center justify-center w-full h-full">
                                            {/* Game Logo */}
                                            <div className="absolute z-20 -translate-x-1/2 -top-1 left-1/2 md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
                                                <div className="flex items-center justify-center rounded-full p-8 transition-all duration-500 md:group-hover:-translate-y-[80%]">
                                                    <img
                                                        src={game.image}
                                                        alt={`${game.title} Logo`}
                                                        className="object-contain w-auto transition-all duration-500 h-42 md:group-hover:scale-140"
                                                    />
                                                </div>
                                            </div>

                                            {/* Content (shown on mobile and on hover in desktop) */}
                                            <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center p-8 my-5 transition-all duration-500 translate-y-0 opacity-100 md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                                                <h3 className="mb-4 text-2xl font-bold text-center text-white">
                                                    {game.title} <span className="text-red-400">Tournament</span>
                                                    <div className="mx-auto mt-2 h-0.5 w-64 rounded-full bg-red-400"></div>
                                                </h3>

                                                <div className="mb-6 space-y-2 text-center">
                                                    <p className="text-lg font-bold text-white/90">{game.slots}</p>
                                                    <p className="text-base text-white/90">{game.type}</p>
                                                    <p className="text-base text-white/90">{game.scope}</p>
                                                    <p className="text-base font-semibold text-white/90">{game.date}</p>
                                                    <p className="text-base font-bold text-white/90">{game.mode}</p>
                                                    <div className="pt-2 mt-2 border-t border-red-400/30">
                                                        <p className="text-sm text-white/90">Registration Fee</p>
                                                        <p className="text-base font-semibold text-white">{game.fee}</p>
                                                    </div>
                                                </div>

                                                <Link
                                                    href={route('register')}
                                                    className="inline-block px-8 py-3 text-base font-semibold text-white transition-all duration-300 transform bg-red-600 rounded-lg hover:scale-105 hover:bg-red-700 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                                                    onClick={(e) => {
                                                        if (isRegistrationClosed) {
                                                            e.preventDefault();
                                                            setShowClosedPopup(true);
                                                        }
                                                    }}
                                                    tabIndex={isRegistrationClosed ? -1 : 0}
                                                    aria-disabled={isRegistrationClosed}
                                                    style={isRegistrationClosed ? { pointerEvents: 'auto', cursor: 'not-allowed' } : {}}
                                                    disabled={isRegistrationClosed ? true : undefined}
                                                >
                                                    Register Now
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Video Teaser Section */}
                    <section className="relative py-16 overflow-hidden md:py-24">
                        <div className="absolute inset-0 bg-gradient-to-b from-red-100/30 via-white to-red-50/40"></div>
                        <div className="relative z-10 mx-auto max-w-[1350px] px-4 md:px-8 lg:px-12">
                            <div className="mb-8 text-center md:mb-12">
                                <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-800 sm:text-4xl" data-aos="fade-up">
                                    IT-ESEGA <span className="text-red-600">Teaser</span>
                                </h2>
                                <div
                                    className="w-20 h-1 mx-auto mb-6 bg-red-600 rounded-full sm:mb-8 sm:w-24"
                                    data-aos="fade-up"
                                    data-aos-delay="50"
                                ></div>
                                <p className="max-w-2xl mx-auto text-base text-gray-600 sm:text-lg" data-aos="fade-up" data-aos-delay="100">
                                    Saksikan keseruan dan kemeriahan IT-ESEGA dalam video teaser berikut ini
                                </p>
                            </div>

                            <div className="max-w-4xl px-4 mx-auto sm:px-0">
                                <div className="relative w-full overflow-hidden transition-all duration-500 border-4 shadow-2xl rounded-2xl border-red-500/20 hover:border-red-500/40" data-aos="fade-up" data-aos-delay="150">
                                    {/* Instagram Reel Embed */}
                                    <div className="relative w-full pt-[125%] bg-black">
                                        <iframe
                                            className="absolute top-0 left-0 w-full h-full"
                                            src="https://www.instagram.com/reel/DIlLmrxSbpP/embed/"
                                            frameBorder="0"
                                            scrolling="no"
                                            allowFullScreen={true}
                                        ></iframe>
                                    </div>

                                    {/* Video Info */}
                                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                                        <div className="flex items-center justify-between text-white">
                                            <div>
                                                <h3 className="mb-2 text-xl font-bold">IT-ESEGA 2025 Official Teaser</h3>
                                                <p className="text-sm text-gray-300">Experience the Next Level of Gaming Competition</p>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className="inline-flex items-center px-3 py-1 text-sm rounded-full bg-red-600/80">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="w-4 h-4 mr-1"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                                        />
                                                    </svg>
                                                    Official Teaser
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Prizepool Section */}
                    <section className="relative py-16 overflow-hidden md:py-24">
                        <div className="absolute inset-0 bg-gradient-to-b from-red-50/40 via-red-100/30 to-white"></div>
                        <div className="relative z-10 mx-auto max-w-[1350px] px-4 md:px-8 lg:px-12">
                            <div className="mb-8 text-center md:mb-12">
                                <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-800 sm:text-4xl" data-aos="fade-up">
                                    Total <span className="text-red-600">Prizepool</span>
                                </h2>
                                <div className="w-20 h-1 mx-auto bg-red-600 rounded-full sm:w-24" data-aos="fade-up" data-aos-delay="50"></div>
                            </div>

                            <div className="max-w-lg mx-auto">
                                <div
                                    className="relative overflow-hidden transition-all duration-500 bg-white border-2 shadow-lg rounded-2xl border-red-500/50 hover:border-red-500 hover:shadow-xl"
                                    data-aos="fade-up"
                                    data-aos-delay="100"
                                >
                                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-red-600"></div>
                                    <div className="px-6 py-8 sm:px-8 sm:py-10">
                                        <div className="flex flex-col items-center">
                                            <div className="p-3 mb-3 rounded-full bg-red-50">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="w-8 h-8 text-red-600"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                            </div>
                                            <div className="text-center">
                                                <p className="mb-1 text-sm font-medium text-gray-500">Total Hadiah</p>
                                                <h3 className="mb-3 text-4xl font-bold text-gray-900 sm:text-5xl">Rp 12.000.000</h3>
                                                <div className="flex items-center justify-center gap-2 text-gray-600">
                                                    <span className="text-2xl">🏆</span>
                                                    <p className="text-sm">Mobile Legends & Free Fire</p>
                                                </div>
                                            </div>
                                            <Link
                                                href={route('register')}
                                                className="mt-6 inline-flex transform items-center rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-red-600 hover:to-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
                                                onClick={(e) => {
                                                    if (isRegistrationClosed) {
                                                        e.preventDefault();
                                                        setShowClosedPopup(true);
                                                    }
                                                }}
                                                tabIndex={isRegistrationClosed ? -1 : 0}
                                                aria-disabled={isRegistrationClosed}
                                                style={isRegistrationClosed ? { pointerEvents: 'auto', cursor: 'not-allowed' } : {}}
                                                disabled={isRegistrationClosed ? true : undefined}
                                            >
                                                Daftar Sekarang
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Timeline Section */}
                    <TimelineSection timeline={event.data || []} />

                    {/* FAQ Section */}
                    <section id="faq" className="relative py-16 overflow-hidden md:py-24">
                        <div className="absolute inset-0 bg-gradient-to-b from-red-100/30 via-white to-red-50/40"></div>
                        <div className="relative z-10 mx-auto max-w-[1350px] px-4 md:px-8 lg:px-12">
                            <div className="max-w-3xl mx-auto">
                                <div className="mb-8 text-center md:mb-12">
                                    <h2 className="mb-4 text-3xl font-extrabold text-gray-900 sm:text-4xl" data-aos="fade-up">
                                        Frequently <span className="text-red-600">Asked Questions</span>
                                    </h2>
                                    <div className="w-20 h-1 mx-auto bg-red-600 rounded-full sm:w-24" data-aos="fade-up" data-aos-delay="50"></div>
                                    <p className="max-w-2xl mx-auto mt-6 text-base text-gray-600 sm:text-lg" data-aos="fade-up" data-aos-delay="100">
                                        Temukan jawaban untuk pertanyaan umum tentang IT-ESEGA 2025 dan proses pendaftaran turnamen
                                    </p>
                                </div>

                                <div className="space-y-4" data-aos="fade-up" data-aos-delay="150">
                                    {faqs.map((faq, index) => (
                                        <Disclosure
                                            key={index}
                                            as="div"
                                            className="overflow-hidden transition-all duration-300 bg-white border shadow-sm rounded-xl border-gray-200/70 hover:shadow-md"
                                        >
                                            {({ open }: { open: boolean }) => (
                                                <>
                                                    <Disclosure.Button className="flex items-center justify-between w-full px-6 py-5 text-left focus:outline-none focus-visible:ring focus-visible:ring-red-500/50">
                                                        <span className={`text-lg font-medium ${open ? 'text-red-600' : 'text-gray-800'}`}>
                                                            {faq.question}
                                                        </span>
                                                        <div
                                                            className={`ml-4 flex-shrink-0 rounded-full p-1.5 ${open ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-500'}`}
                                                        >
                                                            <svg
                                                                className={`h-5 w-5 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                        </div>
                                                    </Disclosure.Button>

                                                    <Disclosure.Panel className="px-6 pb-5">
                                                        <div className="pt-3 text-base leading-relaxed text-gray-600 border-t border-gray-100">
                                                            {faq.answer}
                                                        </div>
                                                    </Disclosure.Panel>
                                                </>
                                            )}
                                        </Disclosure>
                                    ))}
                                </div>

                                <div className="mt-12 text-center" data-aos="fade-up" data-aos-delay="200">
                                    <p className="mb-4 text-gray-600">Masih punya pertanyaan lain?</p>
                                    <a
                                        href="#contact"
                                        className="inline-flex items-center rounded-lg bg-red-50 px-5 py-2.5 text-sm font-medium text-red-600 transition-colors duration-300 hover:bg-red-100 hover:text-red-700"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path
                                                fillRule="evenodd"
                                                d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.395-3.72C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        Hubungi Kami
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Contact Person Section */}
                    <section id="contact" className="relative py-16 overflow-hidden md:py-24">
                        <div className="absolute inset-0 bg-gradient-to-b from-red-50/40 via-red-100/30 to-white"></div>
                        <div className="relative z-10 mx-auto max-w-[1350px] px-4 md:px-8 lg:px-12">
                            <div className="mb-8 text-center md:mb-12">
                                <h2 className="mb-4 text-3xl font-bold sm:text-4xl" data-aos="fade-up">
                                    <span className="text-gray-900">CONTACT</span> <span className="text-red-600">PERSON</span>
                                </h2>
                                <div className="w-20 h-1 mx-auto bg-red-600 rounded-full sm:w-24" data-aos="fade-up" data-aos-delay="50"></div>
                                <p className="max-w-2xl mx-auto mt-4 text-base text-gray-600 sm:text-lg" data-aos="fade-up" data-aos-delay="100">
                                    Jika Anda memiliki pertanyaan lebih lanjut, jangan ragu untuk menghubungi narahubung yang tertera di bawah ini.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
                                {[
                                    {
                                        name: 'Damar',
                                        wa: '089666401388',
                                        line: 'komang.damar',
                                        animation: 'fade-up',
                                        delay: 0,
                                    },
                                    {
                                        name: 'Mita',
                                        wa: '087861081640',
                                        line: 'pramitawindari',
                                        animation: 'fade-up',
                                        delay: 100,
                                    },
                                    {
                                        name: 'Yoga',
                                        wa: '082145175076',
                                        line: 'dewaanoc135',
                                        animation: 'fade-up',
                                        delay: 200,
                                    },
                                ].map((contact, index) => (
                                    <div
                                        key={index}
                                        className="p-6 transition-shadow duration-300 bg-white border border-red-100 shadow-lg rounded-xl hover:shadow-xl"
                                        data-aos={contact.animation}
                                        data-aos-delay={contact.delay}
                                    >
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="flex items-center justify-center w-12 h-12 bg-red-500 rounded-full shadow-md">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="w-6 h-6 text-white"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C2.493 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                                    />
                                                </svg>
                                            </div>
                                            <h3 className="text-xl font-semibold text-red-600">{contact.name}</h3>
                                        </div>
                                        <div className="space-y-3">
                                            <a
                                                href={`https://wa.me/${contact.wa}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-gray-600 transition-colors duration-300 hover:text-red-500"
                                            >
                                                <span className="font-semibold">WA:</span>
                                                <span className="hover:underline">{contact.wa}</span>
                                            </a>
                                            <p className="flex items-center gap-2 text-gray-600">
                                                <span className="font-semibold">LINE:</span>
                                                <span>{contact.line}</span>
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Merch Section */}
                    <section id="merch" className="relative py-16 mb-20 overflow-hidden md:py-24">
                        <div className="absolute inset-0 pointer-events-none"></div>
                        <div className="relative z-10 flex flex-col px-4 mx-auto max-w-[1350px] md:px-8 lg:px-12">
                            {/* Header */}
                            <h2 className="mb-2 text-3xl font-extrabold tracking-tight text-center text-gray-900 sm:text-4xl">
                                Merchandise <span className="ml-2 text-red-600">IT-ESEGA 25</span>
                            </h2>
                            <div className="w-24 h-1 mx-auto mb-4 rounded-full bg-red-600/80"></div>
                            <p className="max-w-2xl mx-auto text-base text-center text-gray-600 mb-15 sm:text-lg">
                                Merchandise resmi IT-ESEGA 25, desain eksklusif dan nyaman dipakai. Tersedia kaos & jersey edisi terbatas.
                            </p>
                            <div className="flex flex-col items-center justify-between gap-10 md:flex-row md:gap-20">
                                {/* Left: Gambar Merch + Navigasi (Keen Slider) */}
                                <div
                                    className="relative flex flex-col items-center justify-center w-full md:w-1/2"
                                    data-aos="fade-up"
                                    data-aos-delay="0"
                                >
                                    <button
                                        aria-label="Sebelumnya"
                                        onClick={() => instanceRef.current?.prev()}
                                        className="absolute z-10 p-2 text-red-600 transition -translate-y-1/2 border border-red-200 rounded-full shadow -left-2 top-1/2 bg-white/80 hover:bg-red-100 disabled:opacity-50"
                                        style={{ display: merchSlides.length > 1 ? 'block' : 'none' }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                                    </button>
                                    <div ref={sliderRef} className="w-full overflow-hidden keen-slider">
                                        {merchSlides.map((slide, idx) => (
                                            <div key={idx} className="flex flex-col items-center justify-center w-full min-w-0 keen-slider__slide">
                                                <img src={slide.image} alt={slide.title} className="h-[300px] w-auto max-w-full object-contain drop-shadow-xl bg-transparent rounded-xl mb-4 mx-auto" />
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        aria-label="Selanjutnya"
                                        onClick={() => instanceRef.current?.next()}
                                        className="absolute right-0 z-10 p-2 text-red-600 transition -translate-y-1/2 border border-red-200 rounded-full shadow top-1/2 bg-white/80 hover:bg-red-100 disabled:opacity-50"
                                        style={{ display: merchSlides.length > 1 ? 'block' : 'none' }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                    </button>
                                    {/* Dot navigation */}
                                    <div className="flex gap-2 mt-2">
                                        {merchSlides.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => instanceRef.current?.moveToIdx(idx)}
                                                className={`w-3 h-3 rounded-full ${currentSlide === idx ? 'bg-red-600' : 'bg-gray-300'} transition`}
                                            ></button>
                                        ))}
                                    </div>
                                </div>
                                {/* Right: Info Merch */}
                                <div
                                    className="flex flex-col items-start justify-center w-full px-2 md:w-1/2 md:pl-12"
                                    data-aos="fade-left"
                                    data-aos-delay="200"
                                >
                                    {/* Info berdasarkan slide aktif */}
                                    {/*
                                    <h3 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">{merchData[currentSlide].title}</h3>
                                    <div className="mb-1 text-xl font-semibold text-red-600">{merchData[currentSlide].price}</div>
                                    <div className="mb-3 text-sm text-gray-500">{merchData[currentSlide].preorder}</div>
                                    <p className="mb-6 text-base text-gray-700 sm:text-lg">{merchData[currentSlide].desc}</p>
                                    <a href={merchData[currentSlide].link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-full py-3 text-base font-semibold text-white transition bg-red-600 rounded-lg shadow px-7 hover:bg-red-700 md:w-auto">
                                        Order Now
                                    </a>
                                    */}
                                    <h3 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">{activeInfo.title}</h3>
                                    <div className="mb-1 text-xl font-semibold text-red-600">{activeInfo.price}</div>
                                    <div className="mb-3 text-sm text-gray-500">{activeInfo.preorder}</div>
                                    <p className="mb-6 text-base text-gray-700 sm:text-lg">{activeInfo.desc}</p>
                                    <a href={activeInfo.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-full py-3 mt-0 mb-2 text-base font-bold text-white transition bg-red-600 rounded-lg shadow px-7 hover:bg-red-700 md:w-auto">
                                        Order Now
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Footer */}
                    <Footer 
                        isRegistrationClosed={isRegistrationClosed}
                        setShowClosedPopup={setShowClosedPopup}
                    />
                </div>
            </div>

            {/* Popup Pendaftaran Tutup */}
            <Transition appear show={showClosedPopup} as={Fragment}>
                <Dialog as="div" className="fixed inset-0 z-[200] overflow-y-auto" onClose={() => setShowClosedPopup(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-200"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-150"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        {/* Overlay tanpa blur, dan gunakan pointer-events-auto agar modal tetap interaktif */}
                        <div className="fixed inset-0 bg-black/40" style={{ zIndex: 201 }} />
                    </Transition.Child>
                    <div className="flex items-center justify-center min-h-screen p-4" style={{ position: 'fixed', inset: 0, zIndex: 202, pointerEvents: 'none' }}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-200"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-150"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            {/* Modal dengan pointer-events-auto agar tidak kena efek overlay */}
                            <Dialog.Panel className="w-full max-w-md p-6 overflow-hidden transition-all transform bg-white shadow-xl rounded-2xl" style={{ zIndex: 203, pointerEvents: 'auto' }}>
                                <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                                    Pendaftaran Ditutup
                                </Dialog.Title>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                        Mohon maaf, pendaftaran untuk IT-ESEGA 2025 sudah ditutup. Pastikan untuk mengikuti kami di media sosial
                                        untuk informasi lebih lanjut tentang event mendatang.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-4 mt-4">
                                    <Link
                                        href={route('home')}
                                        className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white transition bg-red-600 rounded-md hover:bg-red-700"
                                    >
                                        Kembali ke Beranda
                                    </Link>
                                    <button
                                        onClick={() => setShowClosedPopup(false)}
                                        className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 transition bg-gray-100 rounded-md hover:bg-gray-200"
                                    >
                                        Tutup
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}
