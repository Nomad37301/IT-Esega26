import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserType } from '@/types/user';
import { Head, usePage, Link } from '@inertiajs/react';
import { useState, Fragment } from 'react';
import { useRegistrationStatus } from '@/hooks/use-registration-status';
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

interface Bracket {
    id: number;
    game_name: string;
    stage_name: string;
    group_name: string | null;
    bracket_url: string;
    order_position: number;
}

interface Props {
    user: { data: UserType };
    brackets: Bracket[];
}

const BracketML: React.FC<Props> = ({ user, brackets }) => {
    // State untuk kontrol registration closed popup
    const [showClosedPopup, setShowClosedPopup] = useState(false);
    const isRegistrationClosed = useRegistrationStatus();

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
                        forceSolid
                    />
                </div>

                {/* Main Content */}
                <div className="mx-auto max-w-[1350px] px-4 md:px-8 lg:px-12 py-24 mt-8">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            <span className="text-secondary">IT-ESEGA</span> Mobile Legends
                            <br />
                            <span className="text-3xl md:text-4xl text-gray-800">Qualification Day 1</span>
                        </h1>
                        <div className="w-24 h-1 bg-secondary rounded-full mx-auto"></div>
                    </div>

                    {/* Bracket Grid - Dynamic Columns Layout */}
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                        {brackets.length > 0 ? (
                            brackets.map((bracket) => (
                                <Card key={bracket.id} className="w-full transition-shadow duration-300 bg-white border-2 border-gray-300 shadow-lg hover:shadow-xl">
                                    <CardHeader className="border-b border-gray-200 bg-gray-50">
                                        <CardTitle className="text-xl font-bold text-center text-gray-900">
                                            <span className="text-secondary">
                                                {bracket.group_name ? `Group ${bracket.group_name}` : bracket.stage_name}
                                            </span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="w-full overflow-hidden bg-white border-2 border-gray-300 rounded-lg shadow-inner">
                                            <iframe
                                                src={bracket.bracket_url}
                                                width="100%"
                                                height="500"
                                                frameBorder="0"
                                                scrolling="auto"
                                                className="w-full"
                                                title={`Challonge Tournament Bracket ${bracket.group_name || bracket.stage_name}`}
                                                style={{ display: 'block' }}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20">
                                <p className="text-gray-500 text-lg">Belum ada bracket yang tersedia saat ini.</p>
                            </div>
                        )}
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
                                        className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white transition bg-secondary rounded-md hover:opacity-90"
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
