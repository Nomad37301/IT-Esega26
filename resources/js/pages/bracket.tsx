import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UserType } from '@/types/user';
import { Head, router, usePage, Link } from '@inertiajs/react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect, useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { route } from 'ziggy-js';

const navItems = [
    { title: 'Home', href: route('home') },
    { title: 'About', href: route('about') },
    { title: 'FAQ', href: '#faq' },
    { title: 'Contact', href: '#contact' },
    { title: 'Bracket', href: route('bracket') },
    { title: 'Register', href: route('register') },
];

const Bracket: React.FC = () => {
    const { user } = usePage<{ user: { data: UserType } }>().props;

    // State untuk kontrol registration closed popup
    const [showClosedPopup, setShowClosedPopup] = useState(false);
    const isRegistrationClosed = true; // Set registration sebagai closed

    useEffect(() => {
        // Inisialisasi AOS
        AOS.init({
            duration: 800,
            once: false,
            mirror: true,
        });

        // Reset scroll ke atas saat halaman dimuat
        window.scrollTo(0, 0);

        // Refresh AOS
        setTimeout(() => {
            AOS.refresh();
        }, 100);
    }, []);

    const brackets = [
        {
            title: 'Mobile Legends Qualification Day 1',
            summary: 'Explore the full Mobile Legends bracket. Follow every matchup and track your favorite teams.',
            link: '/bracket/mobile-legends',
        },
        {
            title: 'Free Fire',
            summary: "Check out the Free Fire bracket and see who's advancing. Live updates and results.",
            link: '/bracket/free-fire',
        },
    ];

    return (
        <>
            <div className="home relative min-h-screen overflow-hidden">
                <Head title="Tournament Brackets | IT-ESEGA 2025" />
                {/* Background Layer */}
                <div className="absolute inset-0 bg-white"></div>
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-white via-red-50/40 to-red-100/30"></div>
                {/* Cross Blob - Top Left */}
                <div className="pointer-events-none absolute top-24 -left-12 h-28 w-28 opacity-5">
                    <div className="animate-spin-slow h-full w-full">
                        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="h-full w-full fill-red-500">
                            <path d="M85,40 h30 v45 h45 v30 h-45 v45 h-30 v-45 h-45 v-30 h45 z" />
                        </svg>
                    </div>
                </div>
                {/* Cross Blob - Bottom Right */}
                <div className="pointer-events-none absolute -right-8 bottom-16 h-20 w-20 opacity-5">
                    <div className="animate-spin-reverse-slow h-full w-full">
                        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="h-full w-full fill-red-500">
                            <path d="M85,40 h30 v45 h45 v30 h-45 v45 h-30 v-45 h-45 v-30 h45 z" />
                        </svg>
                    </div>
                </div>
                <div className="relative z-10">
                    <Navbar
                        user={user}
                        logo={
                            <div className="flex items-center justify-start">
                                <img src="/Images/LogoEsega25.png" alt="IT-ESEGA-25 Logo" className="h-18 w-auto object-contain" />
                            </div>
                        }
                        items={navItems}
                        isRegistrationClosed={isRegistrationClosed}
                        setShowClosedPopup={setShowClosedPopup}
                    />

                    {/* Main Content Container */}
                    <div className="mx-auto max-w-[1350px] px-4 md:px-8 lg:px-12 py-16 pt-32">
                        {/* Header Section */}
                        <div className="text-center mb-8" data-aos="fade-up">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
                                <span className="text-red-600">IT-ESEGA</span> Brackets
                            </h1>
                            <div className="w-16 h-0.5 bg-red-600 rounded-full mx-auto mb-4"></div>
                            <p className="text-base text-gray-600 max-w-xl mx-auto">
                                Follow your favorite teams and watch live matches
                            </p>
                        </div>

                        {/* Brackets Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {brackets.map((bracket, index) => (
                                <div
                                    key={index}
                                    className="group"
                                    data-aos="fade-up"
                                    data-aos-delay={index * 100}
                                >
                                    <Card className="h-full border border-gray-200 hover:border-red-300 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                                        <CardContent className="p-6">
                                            <div className="text-center">
                                                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                                                    {bracket.title}
                                                </h2>
                                                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                                                    {bracket.summary}
                                                </p>
                                                <Button
                                                    className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300"
                                                    onClick={() => router.visit(bracket.link)}
                                                >
                                                    View Bracket
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </div>

                        {/* Special Card - Day 2 & Grand Final */}
                        <div className="flex justify-center" data-aos="fade-up" data-aos-delay={300}>
                            <Card className="max-w-xl w-full border border-yellow-400 bg-gradient-to-br from-yellow-50 to-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                                <CardContent className="p-6 text-center">
                                    <h2 className="text-2xl font-semibold text-yellow-700 mb-3">
                                        Mobile Legends
                                        <br />
                                        <span className="text-lg">Day 2 & Grand Final</span>
                                    </h2>
                                    <p className="text-gray-700 mb-4 text-sm leading-relaxed max-w-md mx-auto">
                                        Watch the most anticipated matches of the tournament
                                    </p>
                                    <Button
                                        className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-6 rounded-lg text-sm font-medium transition-all duration-300"
                                        onClick={() => router.visit('/bracket/mobile-legends/day2-3')}
                                    >
                                        View Finals
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
            <Footer 
                isRegistrationClosed={isRegistrationClosed}
                setShowClosedPopup={setShowClosedPopup}
            />

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
};

export default Bracket;
