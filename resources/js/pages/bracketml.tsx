import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserType } from '@/types/user';
import { Head, usePage, Link } from '@inertiajs/react';
import { useState, Fragment } from 'react';
import { route } from 'ziggy-js';
import { Dialog, Transition } from '@headlessui/react';

const navItems = [
    { title: 'Home', href: route('home') },
    { title: 'About', href: route('about') },
    { title: 'FAQ', href: '#faq' },
    { title: 'Contact', href: '#contact' },
    { title: 'Bracket', href: route('bracket') },
    { title: 'Register', href: route('register') },
];

const BracketML: React.FC = () => {
    const { user } = usePage<{ user: { data: UserType } }>().props;

    // State untuk kontrol registration closed popup
    const [showClosedPopup, setShowClosedPopup] = useState(false);
    const isRegistrationClosed = true; // Set registration sebagai closed

    return (
        <>
            <div className="min-h-screen p-4 pt-5 bg-gray-50 sm:p-6 lg:p-8">
                <Head title="Tournament Brackets | IT-ESEGA 2025" />
                <div className="relative z-10">
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
                </div>

                {/* Main Content */}
                <div className="mx-auto max-w-[1350px] px-4 md:px-8 lg:px-12 py-24 mt-8">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            <span className="text-red-600">IT-ESEGA</span> Mobile Legends
                            <br />
                            <span className="text-3xl md:text-4xl text-gray-800">Qualification Day 1</span>
                        </h1>
                        <div className="w-24 h-1 bg-red-600 rounded-full mx-auto"></div>
                    </div>

                    {/* Bracket Grid - 2 Columns Layout */}
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                        {Array.from({ length: 16 }, (_, index) => {
                            const groupLetter = String.fromCharCode(65 + index);
                            const groupIframes: Record<string, string> = {
                                A: 'https://challonge.com/A_ITESEGA2025/module',
                                B: 'https://challonge.com/B_ITESEGA2025/module',
                                C: 'https://challonge.com/C_ITESEGA2025/module',
                                D: 'https://challonge.com/D_ITESEGA2025/module',
                                E: 'https://challonge.com/E_ITESEGA2025/module',
                                F: 'https://challonge.com/F_ITESEGA2025/module',
                                G: 'https://challonge.com/G_ITESEGA2025/module',
                                H: 'https://challonge.com/H_ITESEGA2025/module',
                                I: 'https://challonge.com/I_ITESEGA2025/module',
                                J: 'https://challonge.com/J_ITESEGA2025/module',
                                K: 'https://challonge.com/K_ITESEGA2025/module',
                                L: 'https://challonge.com/L_ITESEGA2025/module',
                                M: 'https://challonge.com/M_ITESEGA2025/module',
                                N: 'https://challonge.com/N_ITESEGA2025/module',
                                O: 'https://challonge.com/O_ITESEGA2025/module',
                                P: 'https://challonge.com/P_ITESEGA2025/module',
                            };

                            return (
                                <Card key={index} className="w-full transition-shadow duration-300 bg-white border-2 border-gray-300 shadow-lg hover:shadow-xl">
                                    <CardHeader className="border-b border-gray-200 bg-gray-50">
                                        <CardTitle className="text-xl font-bold text-center text-gray-900">
                                            <span className="text-red-600">Group {groupLetter}</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="w-full overflow-hidden bg-white border-2 border-gray-300 rounded-lg shadow-inner">
                                            <iframe
                                                src={groupIframes[groupLetter] || ''}
                                                width="100%"
                                                height="500"
                                                frameBorder="0"
                                                scrolling="auto"
                                                className="w-full"
                                                title={`Challonge Tournament Bracket Group ${groupLetter}`}
                                                style={{ display: 'block' }}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
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

export default BracketML;
