import { useTranslation } from 'react-i18next';
import { BarChart3 } from 'lucide-react';

const Performance = () => {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
            <div className="p-4 bg-sys-primary/10 rounded-full">
                <BarChart3 className="w-12 h-12 text-sys-primary" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">{t('sidebar.performance_analysis')}</h1>
            <p className="text-slate-500 max-w-sm">
                <span className="block font-semibold mb-1">{t('common.coming_soon_title')}</span>
                {t('performance.coming_soon_desc')}
            </p>
        </div>
    );
};

export default Performance;
