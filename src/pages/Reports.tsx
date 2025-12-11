import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Calendar, FileText, Download, ChevronDown } from 'lucide-react';

const ReportFilter = ({ icon: Icon, label, placeholder }: { icon: any, label: string, placeholder: string }) => (
    <div className="flex flex-col gap-1.5 min-w-[200px] flex-1">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon className="h-4 w-4 text-slate-400" />
            </div>
            <button className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-left text-sm text-slate-700 flex items-center justify-between hover:border-sys-primary focus:ring-2 focus:ring-sys-primary/20 transition-all shadow-sm">
                <span>{placeholder}</span>
                <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>
        </div>
    </div>
);

// Mock Data for Report
const MOCK_REPORT_DATA = [
    { center: 'Entrada Principal', date: '05/12/2025', start: '09:00', end: '10:00', visits: 145, occupancy: 42, stay: '12m 30s' },
    { center: 'Entrada Principal', date: '05/12/2025', start: '10:00', end: '11:00', visits: 230, occupancy: 85, stay: '18m 45s' },
    { center: 'Entrada Principal', date: '05/12/2025', start: '11:00', end: '12:00', visits: 310, occupancy: 120, stay: '22m 10s' },
    { center: 'Entrada Principal', date: '05/12/2025', start: '12:00', end: '13:00', visits: 280, occupancy: 95, stay: '20m 00s' },
    { center: 'Salida Cafetería', date: '05/12/2025', start: '09:00', end: '10:00', visits: 50, occupancy: 10, stay: '08m 15s' },
    { center: 'Salida Cafetería', date: '05/12/2025', start: '10:00', end: '11:00', visits: 95, occupancy: 30, stay: '15m 20s' },
];

const Reports = () => {
    const { t } = useTranslation();
    const [hasSearched, setHasSearched] = useState(false);

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{t('reports.title')}</h1>
                    <p className="text-slate-500 mt-1">{t('reports.subtitle')}</p>
                </div>
            </div>

            {/* Filter Section */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex flex-wrap gap-6 items-end">
                    <ReportFilter icon={FileText} label={t('reports.filter_type')} placeholder={t('reports.type_visits')} />
                    <ReportFilter icon={Search} label={t('reports.filter_center')} placeholder="Todos los centros" />
                    <ReportFilter icon={Calendar} label={t('reports.filter_dates')} placeholder="Esta semana" />

                    <button
                        onClick={() => setHasSearched(true)}
                        className="px-6 py-2.5 bg-sys-primary text-white font-medium rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-sys-primary/25 flex items-center gap-2"
                    >
                        <Search className="w-4 h-4" />
                        {t('reports.btn_search')}
                    </button>
                </div>
            </div>

            {/* Results Table */}
            {hasSearched && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in-up">
                    <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                        <h3 className="font-semibold text-slate-700">{t('reports.results_title')}</h3>
                        <button className="flex items-center gap-2 text-sm text-sys-primary font-medium hover:text-blue-700 transition-colors">
                            <Download className="w-4 h-4" />
                            {t('reports.btn_export')}
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-xs">
                                <tr>
                                    <th className="px-6 py-4">{t('reports.col_center')}</th>
                                    <th className="px-6 py-4">{t('reports.col_date')}</th>
                                    <th className="px-6 py-4">{t('reports.col_start')}</th>
                                    <th className="px-6 py-4">{t('reports.col_end')}</th>
                                    <th className="px-6 py-4 text-center">{t('reports.col_visits')}</th>
                                    <th className="px-6 py-4 text-center">{t('reports.col_occupancy')}</th>
                                    <th className="px-6 py-4 text-center">{t('reports.col_stay')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {MOCK_REPORT_DATA.map((row, i) => (
                                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-700">{row.center}</td>
                                        <td className="px-6 py-4 text-slate-600">{row.date}</td>
                                        <td className="px-6 py-4 text-slate-500 font-mono">{row.start}</td>
                                        <td className="px-6 py-4 text-slate-500 font-mono">{row.end}</td>
                                        <td className="px-6 py-4 text-center font-bold text-slate-700">{row.visits}</td>
                                        <td className="px-6 py-4 text-center text-slate-600">{row.occupancy}</td>
                                        <td className="px-6 py-4 text-center text-slate-600">{row.stay}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reports;
