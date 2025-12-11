import { useTranslation } from 'react-i18next';
import { PieChart } from 'lucide-react';

const StoreOptimizer = () => {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
            <div className="p-4 bg-purple-100 rounded-full">
                <PieChart className="w-12 h-12 text-purple-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">{t('sidebar.store_optimizer')}</h1>
            <p className="text-slate-500 max-w-sm">
                <span className="block font-semibold mb-1">{t('common.coming_soon_title')}</span>
                {t('optimizer.coming_soon_desc')}
            </p>
        </div>
    );
};

export default StoreOptimizer;
