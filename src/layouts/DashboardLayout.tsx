import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    LayoutDashboard,
    Activity,
    MapPin,
    Settings,
    BarChart3,
    PieChart,
    Users,
    Menu,
    Bell,
    Search
} from 'lucide-react';
import LanguageSwitcher from '../components/LanguageSwitcher';

// Fallback for clsx simply joining strings
const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

const SidebarItem = ({ to, icon: Icon, label, active }: { to: string; icon: any; label: string; active?: boolean }) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) => cn(
                "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group",
                (isActive || active)
                    ? "bg-sys-primary text-white shadow-lg shadow-sys-primary/25"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
            )}
        >
            <Icon className={cn("w-5 h-5 mr-3 transition-colors", (active) ? "text-white" : "text-slate-500 group-hover:text-white")} />
            {label}
        </NavLink>
    );
};

const DashboardLayout = () => {
    const { t } = useTranslation();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 bg-sys-sidebar w-64 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 shadow-2xl flex flex-col",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Logo Area */}
                <div className="h-20 flex items-center px-6 border-b border-slate-700/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-sys-primary to-blue-500 flex items-center justify-center shadow-lg shadow-sys-primary/20">
                            <Activity className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white tracking-tight">ScireCount</h1>
                            <span className="text-[10px] text-sys-primary font-semibold uppercase tracking-wider bg-sys-primary/10 px-2 py-0.5 rounded-full border border-sys-primary/20">Enterprise</span>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
                    <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-2">{t('sidebar.analytics_section')}</p>
                    <SidebarItem to="/dashboard" icon={LayoutDashboard} label={t('sidebar.visits')} active={true} />
                    <SidebarItem to="/dashboard/realtime" icon={Activity} label={t('sidebar.real_time')} />
                    <SidebarItem to="/dashboard/zones" icon={MapPin} label={t('sidebar.zones')} />

                    <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-6">{t('sidebar.reports_section')}</p>
                    <SidebarItem to="/dashboard/stats" icon={BarChart3} label={t('sidebar.stats')} />
                    <SidebarItem to="/dashboard/heatmap" icon={PieChart} label={t('sidebar.heatmaps')} />

                    <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-6">{t('sidebar.management_section')}</p>
                    <SidebarItem to="/dashboard/users" icon={Users} label={t('sidebar.users')} />
                    <SidebarItem to="/dashboard/settings" icon={Settings} label={t('sidebar.settings')} />
                </div>

                {/* User Profile Snippet */}
                <div className="p-4 border-t border-slate-700/50">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
                            SC
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">Admin User</p>
                            <p className="text-xs text-slate-400 truncate">admin@scirecount.com</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10 sticky top-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <h2 className="text-xl font-bold text-slate-800">{t('common.profile')}</h2>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Language Switcher */}
                        <LanguageSwitcher />

                        {/* Search */}
                        <div className="hidden md:flex items-center relative">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3" />
                            <input
                                type="text"
                                placeholder={t('common.search_placeholder')}
                                className="pl-10 pr-4 py-2 rounded-full border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-sys-primary/50 w-64"
                            />
                        </div>

                        {/* Notifications */}
                        <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                            <Bell className="w-6 h-6" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-8 relative">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
