import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Activity, ArrowUpRight, Users, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const RealTime = () => {
    const { t } = useTranslation();
    const [trafficData, setTrafficData] = useState<number[]>(Array(24).fill(10));

    // Simulate live data stream
    useEffect(() => {
        const interval = setInterval(() => {
            setTrafficData(prev => {
                const newData = [...prev.slice(1), Math.floor(Math.random() * 50) + 10];
                return newData;
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">{t('sidebar.real_time')}</h1>
                    <p className="text-slate-500">Live sensor feed monitor</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Live Connection
                </div>
            </div>

            {/* Live Traffic Monitor */}
            <div className="bg-sys-dark rounded-2xl p-6 shadow-xl border border-sys-sidebar overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Activity className="w-64 h-64 text-white" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-sys-primary/20 rounded-xl">
                            <Zap className="w-6 h-6 text-sys-primary" />
                        </div>
                        <div>
                            <h3 className="text-white text-lg font-bold">Traffic Intensity</h3>
                            <p className="text-slate-400 text-sm">Main Entrance - Device 01</p>
                        </div>
                        <div className="ml-auto text-right">
                            <h2 className="text-3xl font-bold text-white font-mono">{trafficData[trafficData.length - 1]}</h2>
                            <p className="text-emerald-400 text-xs flex items-center justify-end gap-1">
                                <ArrowUpRight className="w-3 h-3" /> +12%
                            </p>
                        </div>
                    </div>

                    {/* CSS Bar Chart */}
                    <div className="h-48 flex items-end justify-between gap-1">
                        {trafficData.map((value, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: '0%' }}
                                animate={{ height: `${value}%` }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                className="w-full bg-gradient-to-t from-sys-primary/20 to-sys-primary rounded-t-sm relative group"
                            >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-sys-dark text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {value} pax
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* X-Axis Labels */}
                    <div className="flex justify-between mt-2 text-[10px] text-slate-500 font-mono uppercase">
                        <span>-60s</span>
                        <span>-45s</span>
                        <span>-30s</span>
                        <span>-15s</span>
                        <span>Now</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-purple-500" />
                        Active Zones
                    </h3>
                    <div className="space-y-4">
                        {[
                            { name: 'Entrance Hall', count: 42, pct: 85 },
                            { name: 'Loading Dock', count: 3, pct: 15 },
                            { name: 'Cafeteria', count: 28, pct: 60 },
                        ].map((zone, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-slate-700">{zone.name}</span>
                                    <span className="text-slate-500">{zone.count} people</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                                        style={{ width: `${zone.pct}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-orange-500" />
                        System Health
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                <span className="text-sm font-medium text-emerald-900">API Gateway</span>
                            </div>
                            <span className="text-xs font-bold text-emerald-600">OPERATIONAL</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                <span className="text-sm font-medium text-emerald-900">MQTT Broker</span>
                            </div>
                            <span className="text-xs font-bold text-emerald-600">CONNECTED</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-100">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                                <span className="text-sm font-medium text-amber-900">Device VS125-04</span>
                            </div>
                            <span className="text-xs font-bold text-amber-600">RECONNECTING</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RealTime;
