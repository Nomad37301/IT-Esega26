import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuPortal, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserType } from '@/types/user';
import { Link, router } from '@inertiajs/react';
import { LayoutDashboard, LogOut, Menu, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { route } from 'ziggy-js';

interface NavItem {
    title: string;
    href: string;
}

interface NavbarProps {
    logo?: React.ReactNode;
    items?: NavItem[];
    user?: { data: UserType };
    isRegistrationClosed?: boolean;
    setShowClosedPopup?: (show: boolean) => void;
}

export function Navbar({ logo, items = [], user, isRegistrationClosed = false, setShowClosedPopup }: NavbarProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownTriggerRef = useRef<HTMLButtonElement>(null);
    const dropdownContentRef = useRef<HTMLDivElement>(null);
    // Memisahkan item Register dari items lainnya
    const navigationItems = items.filter((item) => item.title !== 'Register');
    const registerItem = items.find((item) => item.title === 'Register');
    const currentPath = window.location.pathname;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isDropdownOpen && dropdownTriggerRef.current && dropdownContentRef.current) {
            const triggerRect = dropdownTriggerRef.current.getBoundingClientRect();

            // Calculate position
            const top = triggerRect.bottom + 5;
            const right = window.innerWidth - triggerRect.right;

            dropdownContentRef.current.style.position = 'fixed';
            dropdownContentRef.current.style.top = `${top}px`;
            dropdownContentRef.current.style.right = `${right}px`;
        }
    }, [isDropdownOpen]);

    const handleNavigation = (e: React.MouseEvent, href: string, title: string) => {
        // Jika link adalah FAQ atau Contact
        if (title === 'FAQ' || title === 'Contact') {
            e.preventDefault();

            // Jika bukan di halaman home, arahkan ke home dulu
            if (window.location.pathname !== '/') {
                router.visit('/', {
                    preserveScroll: true,
                    preserveState: true,
                    onSuccess: () => {
                        // Tunggu sebentar untuk memastikan halaman sudah ter-render
                        setTimeout(() => {
                            const element = document.getElementById(href.substring(1));
                            if (element) {
                                element.scrollIntoView({ behavior: 'smooth' });
                            }
                        }, 50);
                    },
                });
            } else {
                // Jika sudah di halaman home, langsung scroll
                const element = document.getElementById(href.substring(1));
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }
        } else if (title === 'Home' && window.location.pathname === '/') {
            // Jika di halaman home dan klik home, scroll ke atas
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            // Untuk navigasi normal ke halaman lain
            e.preventDefault();
            router.visit(href, {
                preserveScroll: false,
                preserveState: false,
                onSuccess: () => {
                    // Reset scroll position setelah navigasi
                    window.scrollTo(0, 0);
                },
            });
        }
    };

    // const getRedirectPath = (user: UserType) => {
    //     if (user === undefined) return '#';

    //     console.log('User dari Navbar :', user?.updated_at)

    //     const roles = user?.roles?.map((role) => role.name) || [];
    //     console.log('User Role : ', roles)

    //     if (roles.includes('admin') || roles.includes('super_admin')) {
    //         return route('admin.dashboard');
    //     }

    //     return route('dashboard');
    // };

    console.log('Navbar props:', { logo, items, user });
    console.log('Navbar user:', user);
    console.log('Navbar Data Role:', user?.data.name);

    return (
        <nav
            className={`fixed top-0 right-0 left-0 z-[999] transform-gpu transition-all duration-500 ${
                isScrolled ? 'navbar-scrolled translate-y-0' : 'navbar-transparent translate-y-0'
            }`}
            style={{
                willChange: 'transform, opacity, background-color',
                backfaceVisibility: 'hidden',
            }}
        >
            <div className="mx-auto max-w-[1350px] px-4 py-4 md:px-8 lg:px-12">
                <div className="flex items-center justify-between">
                    {/* Logo Section */}
                    <div className="w-[180px] flex-shrink-0 transition-transform duration-300 hover:scale-105">
                        <Link
                            href={route('home')}
                            onClick={(e) => {
                                if (window.location.pathname === '/') {
                                    e.preventDefault();
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }
                            }}
                            className="block"
                        >
                            {logo}
                        </Link>
                    </div>

                    {/* Desktop Navigation - Centered */}
                    <div className="hidden flex-grow justify-center md:flex">
                        {/* Center Navigation Links */}
                        <div className="flex w-full max-w-2xl items-center justify-center space-x-12">
                            {navigationItems.map((item) => {
                                const isActive = currentPath === item.href;
                                return (
                                    <Link
                                        key={item.title}
                                        href={item.title === 'FAQ' ? '#faq' : item.title === 'Contact' ? '#contact' : item.href}
                                        onClick={(e) =>
                                            handleNavigation(
                                                e,
                                                item.title === 'FAQ' ? '#faq' : item.title === 'Contact' ? '#contact' : item.href,
                                                item.title,
                                            )
                                        }
                                        className={`nav-link group relative overflow-hidden px-2 py-1 text-[15px] font-medium ${
                                            isActive ? 'active' : ''
                                        }`}
                                    >
                                        {item.title}
                                        <span
                                            className="absolute bottom-0 left-0 h-0.5 w-full origin-left transform transition-all duration-300 ease-out"
                                            style={{
                                                background: 'linear-gradient(to right, var(--color-teal), var(--color-teal-light))',
                                                transform: isActive ? 'translateX(0)' : 'translateX(-100%)',
                                            }}
                                            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateX(0)')}
                                        ></span>
                                        <span
                                            className="absolute bottom-0 left-0 h-0.5 w-full translate-x-[-100%] transform transition-all duration-300 ease-out group-hover:translate-x-0"
                                            style={{
                                                background: 'linear-gradient(to right, var(--color-teal), var(--color-teal-light))',
                                            }}
                                        ></span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Action Button or User Icon */}
                    <div className="hidden w-[180px] flex-shrink-0 justify-end md:flex">
                        {user ? (
                            <div>
                                <button
                                    ref={dropdownTriggerRef}
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex h-10 w-10 transform items-center justify-center rounded-full bg-gradient-to-r from-[#ba0000] to-[#ba0000]/90 text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:from-[#ba0000]/90 hover:to-[#ba0000] hover:shadow-lg focus:ring-2 focus:ring-[#ba0000]/20 focus:ring-offset-2 focus:outline-none"
                                >
                                    <User className="h-5 w-5" />
                                </button>

                                {isDropdownOpen &&
                                    createPortal(
                                        <div
                                            ref={dropdownContentRef}
                                            className="z-[1000] w-56 rounded-xl border border-gray-100/50 bg-white/95 p-2 shadow-lg backdrop-blur-md"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <div className="px-2 py-1.5">
                                                <p className="truncate text-sm font-medium text-gray-900">{user.data.name}</p>
                                                <p className="truncate text-xs text-gray-500">
                                                    {user.data.roles?.map((role) => role.name).join(', ')}
                                                </p>
                                            </div>
                                            <div className="my-2 h-px bg-gray-100/50"></div>
                                            <Link
                                                href={
                                                    user.data.roles?.some((role) => role.name === 'admin' || role.name === 'super_admin')
                                                        ? route('admin.dashboard')
                                                        : route('dashboard')
                                                }
                                                className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-gray-700 transition-colors duration-200 hover:bg-[#ba0000]/5 hover:text-[#ba0000]"
                                            >
                                                <LayoutDashboard className="h-4 w-4" />
                                                Dashboard
                                            </Link>
                                            <Link
                                                href={route('logout')}
                                                method="post"
                                                as="button"
                                                className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-gray-700 transition-colors duration-200 hover:bg-[#ba0000]/5 hover:text-[#ba0000]"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                Logout
                                            </Link>
                                        </div>,
                                        document.body,
                                    )}
                            </div>
                        ) : (
                            registerItem && (
                                <button
                                    type="button"
                                    className="btn-navy inline-flex items-center rounded-lg px-6 py-2.5 text-sm font-semibold shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                                    disabled={isRegistrationClosed}
                                    onClick={(e) => {
                                        if (isRegistrationClosed) {
                                            e.preventDefault();
                                            setShowClosedPopup && setShowClosedPopup(true);
                                        } else {
                                            window.location.href = registerItem.href;
                                        }
                                    }}
                                >
                                    {registerItem.title}
                                </button>
                            )
                        )}
                    </div>

                    {/* Add click outside handler */}
                    {isDropdownOpen &&
                        createPortal(<div className="fixed inset-0 z-[999]" onClick={() => setIsDropdownOpen(false)} />, document.body)}

                    {/* Mobile Menu */}
                    <div className="md:hidden">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={`rounded-lg transition-all duration-300 ${
                                        isScrolled ? 'text-gray-700 hover:bg-gray-100/50' : 'text-white hover:bg-white/10'
                                    }`}
                                >
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-72 rounded-xl border border-gray-100/50 bg-white p-3 shadow-lg"
                                    sideOffset={5}
                                    alignOffset={5}
                                    avoidCollisions={true}
                                    collisionPadding={10}
                                    style={{
                                        position: 'fixed',
                                        right: '1rem',
                                        top: '4rem',
                                        transform: 'none',
                                        willChange: 'transform',
                                    }}
                                >
                                    <div className="space-y-1">
                                        {navigationItems.map((item) => (
                                            <Link
                                                key={item.title}
                                                href={item.title === 'FAQ' ? '#faq' : item.title === 'Contact' ? '#contact' : item.href}
                                                onClick={(e) =>
                                                    handleNavigation(
                                                        e,
                                                        item.title === 'FAQ' ? '#faq' : item.title === 'Contact' ? '#contact' : item.href,
                                                        item.title,
                                                    )
                                                }
                                                className={`block rounded-lg px-4 py-3 text-[15px] transition-all duration-300 ${
                                                    currentPath === item.href
                                                        ? 'bg-[#ba0000]/5 font-semibold text-[#ba0000]'
                                                        : 'text-gray-700 hover:bg-[#ba0000]/5 hover:text-[#ba0000]'
                                                }`}
                                            >
                                                {item.title}
                                            </Link>
                                        ))}
                                        {user ? (
                                            <>
                                                <div className="border-t border-gray-100/50 px-4 py-3">
                                                    <p className="truncate text-sm font-medium text-gray-900">{user.data.name}</p>
                                                    <p className="truncate text-xs text-gray-500">
                                                        {user.data.roles?.map((role) => role.name).join(', ')}
                                                    </p>
                                                </div>
                                                <Link
                                                    href={
                                                        user.data.roles?.some((role) => role.name === 'admin' || role.name === 'super_admin')
                                                            ? route('admin.dashboard')
                                                            : route('dashboard')
                                                    }
                                                    className="flex items-center gap-2 rounded-lg bg-[#ba0000]/5 px-4 py-3 text-[15px] font-semibold text-[#ba0000] transition-all duration-300 hover:bg-[#ba0000]/10"
                                                >
                                                    <LayoutDashboard className="h-5 w-5" /> Dashboard
                                                </Link>
                                                <Link
                                                    href={route('logout')}
                                                    method="post"
                                                    as="button"
                                                    className="flex items-center gap-2 rounded-lg px-4 py-3 text-[15px] text-gray-700 transition-all duration-300 hover:bg-[#ba0000]/5 hover:text-[#ba0000]"
                                                >
                                                    <LogOut className="h-5 w-5" /> Logout
                                                </Link>
                                            </>
                                        ) : (
                                            registerItem && (
                                                <button
                                                    type="button"
                                                    className="btn-navy mt-2 block w-full rounded-lg px-4 py-3 text-center text-[15px] font-semibold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60"
                                                    disabled={isRegistrationClosed}
                                                    onClick={(e) => {
                                                        if (isRegistrationClosed) {
                                                            e.preventDefault();
                                                            setShowClosedPopup && setShowClosedPopup(true);
                                                        } else {
                                                            window.location.href = registerItem.href;
                                                        }
                                                    }}
                                                >
                                                    {registerItem.title}
                                                </button>
                                            )
                                        )}
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenuPortal>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </nav>
    );
}
