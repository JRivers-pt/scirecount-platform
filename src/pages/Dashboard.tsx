import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUp, ArrowDown, Users, Clock, Calendar, MoreHorizontal, Filter } from 'lucide-react';
import { deviceService, type DeviceData } from '../services/DeviceService';

const StatCard = ({ title, value, change, trend, icon: Icon }: { title: string; value: string; change: string; trend: 'up' | 'down'; icon: any }) => {
    const { t } = useTranslation();
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <Icon className="w-6 h-6 text-sys-primary" />
                </div>
                <button className="text-slate-400 hover:text-slate-600">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>
            <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-slate-800 tracking-tight mb-2">{value}</h3>
                <div className={`flex items-center space-x-2 text-sm font-medium ${trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                    <span className={`flex items-center ${trend === 'up' ? 'bg-emerald-50' : 'bg-red-50'} px-2 py-0.5 rounded-full`}>
                        {trend === 'up' ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                        {change}
                    </span>
                    <span className="text-slate-400 font-normal">{t('dashboard.vs_last_month')}</span>
                </div>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const { t } = useTranslation();
    const [devices, setDevices] = useState<DeviceData[]>([]);

    useEffect(() => {
        // Subscribe to real-time updates from our service
        const unsubscribe = deviceService.subscribe((data) => {
            setDevices(data);
        });
        return unsubscribe;
    }, []);

    // Calculate total stats from devices
    const totalVisits = devices.reduce((acc, d) => acc + d.lineCrossing.in, 0);
    const avgOccupancy = Math.floor(devices.reduce((acc, d) => acc + d.occupancy, 0) / (devices.length || 1));

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Filters Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">{t('dashboard.title')}</h1>
                    <p className="text-slate-500">{t('dashboard.subtitle')}</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        {t('dashboard.filter_today', { date: 'Dec 10, 2025' })}
                    </button>
                    <button className="flex items-center px-4 py-2 bg-sys-primary text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors shadow-lg shadow-sys-primary/25">
                        <Filter className="w-4 h-4 mr-2" />
                        {t('dashboard.filter_button')}
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title={t('dashboard.card_total_visits')}
                    value={totalVisits.toLocaleString()}
                    change="12.5%"
                    trend="up"
                    icon={Users}
                />
                <StatCard
                    title={t('dashboard.card_avg_occupancy')}
                    value={avgOccupancy.toString()}
                    change="3.2%"
                    trend="down"
                    icon={Users}
                />
                <StatCard
                    title={t('dashboard.card_avg_stay')}
                    value="18m 42s"
                    change="5.8%"
                    trend="up"
                    icon={Clock}
                />
            </div>

            {/* Main Data Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-800">{t('dashboard.table_title')}</h3>
                    <button className="text-sm text-sys-primary font-medium hover:underline">{t('dashboard.view_report')}</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4">{t('dashboard.table_header_center')}</th>
                                <th className="px-6 py-4">{t('dashboard.table_header_status')}</th>
                                <th className="px-6 py-4">{t('dashboard.table_header_in')}</th>
                                <th className="px-6 py-4">{t('dashboard.table_header_occupancy')}</th>
                                <th className="px-6 py-4">{t('dashboard.table_header_out')}</th>
                                <th className="px-6 py-4 text-right">{t('dashboard.table_header_update')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {devices.map((device, i) => (
                                <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                            <div>
                                                <p className="font-semibold text-slate-700">{device.name}</p>
                                                <p className="text-xs text-slate-400 font-mono">{device.deviceId}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800`}>
                                            {t(`dashboard.status_${device.status}`)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-slate-600 font-bold">{device.lineCrossing.in}</td>
                                    <td className="px-6 py-4 font-mono text-slate-600">{device.occupancy}</td>
                                    <td className="px-6 py-4 text-slate-500">{device.lineCrossing.out}</td>
                                    <td className="px-6 py-4 text-right text-xs text-slate-400 font-mono">
                                        {device.lastUpdate.toLocaleTimeString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
