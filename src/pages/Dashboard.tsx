import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUp, ArrowDown, Calendar, Filter, Search, Download, ChevronDown } from 'lucide-react';
import { deviceService, type DeviceData } from '../services/DeviceService';

const FilterButton = ({ icon: Icon, label, value }: { icon?: any, label: string, value: string }) => (
    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
        {Icon && <Icon className="w-4 h-4 text-slate-400" />}
        <span className="text-slate-500 font-normal">{label}:</span>
        <span className="text-slate-800 font-semibold">{value}</span>
        <ChevronDown className="w-3 h-3 text-slate-400 ml-1" />
    </button>
);

const MetricCard = ({ title, value, compareValue, change, trend }: { title: string, value: string | number, compareValue: string, change: string, trend: 'up' | 'down' }) => {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">{title}</h3>
            <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-bold text-slate-800">{value}</span>
            </div>
            <div className="mt-3 flex items-center justify-between">
                <div className="text-xs text-slate-400">
                    <span>Prev: </span>
                    <span className="font-medium text-slate-600">{compareValue}</span>
                </div>
                <div className={`flex items-center px-2 py-0.5 rounded text-xs font-bold ${trend === 'up' ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'}`}>
                    {trend === 'up' ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                    {change}
                </div>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const { t } = useTranslation();
    const [devices, setDevices] = useState<DeviceData[]>([]);

    useEffect(() => {
        const unsubscribe = deviceService.subscribe((data) => {
            setDevices(data);
        });
        return unsubscribe;
    }, []);

    // Aggregations
    const totalVisits = devices.reduce((acc, d) => acc + d.lineCrossing.in, 0);
    const avgOccupancy = Math.floor(devices.reduce((acc, d) => acc + d.occupancy, 0) / (devices.length || 1));
    // Mocking standard logic for "Avg Stay" based on occupancy/visits ratio for demo
    const avgStaySeconds = totalVisits > 0 ? Math.floor((avgOccupancy * 3600) / totalVisits) : 0;
    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header & Title */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{t('dashboard.title')}</h1>
                    <p className="text-slate-500 mt-1">{t('dashboard.subtitle')}</p>
                </div>
            </div>

            {/* Reference-Style Filters Bar */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-wrap items-center gap-3">
                <FilterButton icon={Calendar} label={t('dashboard.filter_period')} value="05/12/2025 - 05/12/2025" />
                <FilterButton icon={Calendar} label={t('dashboard.filter_compare')} value="28/11/2025 - 28/11/2025" />
                <FilterButton icon={Filter} label={t('dashboard.filter_grouping')} value={t('dashboard.grouping_day')} />

                <div className="ml-auto flex items-center gap-2">
                    <button className="p-2 bg-sys-primary text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm">
                        <Search className="w-5 h-5" />
                    </button>
                    <button className="p-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
                        <Download className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard
                    title={t('dashboard.card_total_visits')}
                    value={totalVisits.toLocaleString()}
                    compareValue={(totalVisits * 0.9).toFixed(0)}
                    change="12.5%"
                    trend="up"
                />
                <MetricCard
                    title={t('dashboard.card_avg_occupancy')}
                    value={avgOccupancy}
                    compareValue={(avgOccupancy * 1.1).toFixed(0)}
                    change="5.2%"
                    trend="down"
                />
                <MetricCard
                    title={t('dashboard.card_avg_stay')}
                    value={formatTime(avgStaySeconds)}
                    compareValue={formatTime(avgStaySeconds - 45)}
                    change="2.4%"
                    trend="up"
                />
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-xs">
                            <tr>
                                <th className="px-6 py-4">{t('dashboard.table_header_center')}</th>
                                <th className="px-6 py-4 text-center">{t('dashboard.card_total_visits')}</th>
                                <th className="px-6 py-4 text-center">{t('dashboard.card_avg_occupancy')}</th>
                                <th className="px-6 py-4 text-center">{t('dashboard.card_avg_stay')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {devices.map((device, i) => (
                                <tr key={i} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-700">{device.name}</div>
                                        <div className="text-xs text-slate-400">{device.deviceId}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center font-mono text-slate-600 font-medium">
                                        {device.lineCrossing.in}
                                    </td>
                                    <td className="px-6 py-4 text-center font-mono text-slate-600 font-medium">
                                        {device.occupancy}
                                    </td>
                                    <td className="px-6 py-4 text-center font-mono text-slate-600 font-medium">
                                        {/* Simulating per-device stay time variation */}
                                        {formatTime(avgStaySeconds + (i % 2 === 0 ? 120 : -60))}
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
