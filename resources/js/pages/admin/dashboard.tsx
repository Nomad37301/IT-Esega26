import AuthenticatedAdminLayout from "@/layouts/admin/layout";
import { UserType } from "@/types/user";
import { usePage, Head } from "@inertiajs/react";
import { useState } from "react";
import { route } from "ziggy-js";

export default function AdminDashboard() {
    const { user } = usePage<{ user: { data: UserType } }>().props;
    const auth = user.data;
    const [isExporting, setIsExporting] = useState(false);

    const handleExportDatabase = () => {
        setIsExporting(true);
        window.location.href = route('admin.export.full-database');
        // Reset loading state after delay (download starts in background)
        setTimeout(() => setIsExporting(false), 8000);
    };

    return (
        <AuthenticatedAdminLayout title="Admin Dashboard" headerTitle={'Dashboard'} user={auth}>
            <Head title="IT-ESEGA 2026 Official Website | Dashboard" />
            <div className="space-y-6">
                {/* Welcome */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Selamat datang, {auth?.name} 👋
                    </h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Kelola turnamen IT-ESEGA 2026 dari dashboard ini.
                    </p>
                </div>

                {/* Export Section */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                            <svg className="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Export Full Database
                            </h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Download seluruh isi database dan file yang diupload (logo tim, bukti pembayaran, foto pemain, tanda tangan) sebagai file ZIP.
                            </p>
                            <div className="mt-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
                                <p className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1.5">File ZIP berisi:</p>
                                <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                                    <li className="flex items-center gap-1.5">
                                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                        <span><strong>database/</strong>  EFile Excel (.xlsx) dengan seluruh tabel database (bisa disortir & direkap)</span>
                                    </li>
                                    <li className="flex items-center gap-1.5">
                                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                                        <span><strong>uploads/ML_teams/</strong>  ELogo tim & bukti pembayaran Mobile Legends</span>
                                    </li>
                                    <li className="flex items-center gap-1.5">
                                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                                        <span><strong>uploads/PUBG_teams/</strong>  ELogo tim & bukti pembayaran PUBG Mobile</span>
                                    </li>
                                </ul>
                            </div>
                            <button
                                onClick={handleExportDatabase}
                                disabled={isExporting}
                                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isExporting ? (
                                    <>
                                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Sedang mengexport...
                                    </>
                                ) : (
                                    <>
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                        </svg>
                                        Download Semua Data (.zip)
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedAdminLayout>
    );
}

