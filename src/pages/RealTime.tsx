import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { deviceService, type DeviceData } from '../services/DeviceService';

const BigCounter = ({ label, value }: { label: string, value: number }) => (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center hover:shadow-md transition-all">
        <h2 className="text-xl font-bold text-slate-500 uppercase tracking-widest mb-4">{label}</h2>
        <span className="text-8xl font-black text-slate-800 tracking-tighter">{value}</span>
    </div>
);

const RealTime = () => {
    const { t } = useTranslation();
    const [devices, setDevices] = useState<DeviceData[]>([]);

    // Subscribe to real data stream
    useEffect(() => {
        const unsubscribe = deviceService.subscribe((data: DeviceData[]) => {
            setDevices(data);
        });
        return unsubscribe;
    }, []);

    const totalVisits = devices.reduce((acc, curr) => acc + curr.lineCrossing.in, 0);
    const totalOccupancy = devices.reduce((acc, curr) => acc + curr.occupancy, 0);

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{t('sidebar.real_time')}</h1>
                <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    <span className="text-sm font-medium text-emerald-600 uppercase tracking-wider">Ao Vivo</span>
                </div>
            </div>

            {/* Top Counters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <BigCounter label={t('card_total_visits')} value={totalVisits} />
                <BigCounter label={t('card_avg_occupancy')} value={totalOccupancy} />
            </div>

            {/* Realtime Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
                    <h3 className="font-semibold text-slate-700 uppercase tracking-wider text-xs">{t('table_title')}</h3>
                </div>
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-xs">
                        <tr>
                            <th className="px-6 py-4">{t('table_header_center')}</th>
                            <th className="px-6 py-4 text-center">{t('card_total_visits')}</th>
                            <th className="px-6 py-4 text-center">{t('card_avg_occupancy')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {devices.map((device, i) => (
                            <tr key={i} className="hover:bg-slate-50 transition-colors cursor-default">
                                <td className="px-6 py-4 font-medium text-slate-700">{device.name}</td>
                                <td className="px-6 py-4 text-center text-lg font-bold text-slate-800 font-mono">{device.lineCrossing.in}</td>
                                <td className="px-6 py-4 text-center text-lg font-bold text-slate-800 font-mono">{device.occupancy}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RealTime;
