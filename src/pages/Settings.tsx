import { useTranslation } from 'react-i18next';
import { Save, Globe, Shield } from 'lucide-react';

const Settings = () => {
    const { t } = useTranslation();

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">{t('sidebar.settings')}</h1>
                <p className="text-slate-500">Manage your organization and preferences</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="border-b border-slate-100">
                    <nav className="flex px-6 gap-6">
                        <button className="py-4 text-sm font-medium text-sys-primary border-b-2 border-sys-primary">General</button>
                        <button className="py-4 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">Notifications</button>
                        <button className="py-4 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">Integrations</button>
                        <button className="py-4 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">Billing</button>
                    </nav>
                </div>

                <div className="p-8 space-y-8">
                    {/* Organization Settings */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <Globe className="w-5 h-5 text-slate-400" />
                            <h3 className="text-lg font-bold text-slate-800">Organization Profile</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Company Name</label>
                                <input type="text" defaultValue="TechScire Solutions" className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sys-primary/20" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Tax ID / VAT</label>
                                <input type="text" defaultValue="ES-B12345678" className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sys-primary/20" />
                            </div>
                            <div className="col-span-2 space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Primary Contact Email</label>
                                <input type="email" defaultValue="admin@techscire.com" className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sys-primary/20" />
                            </div>
                        </div>
                    </section>

                    <hr className="border-slate-100" />

                    {/* Branding */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <Shield className="w-5 h-5 text-slate-400" />
                            <h3 className="text-lg font-bold text-slate-800">Security & Access</h3>
                        </div>

                        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50/50">
                            <div>
                                <h4 className="font-semibold text-slate-800">Two-Factor Authentication</h4>
                                <p className="text-sm text-slate-500">Add an extra layer of security to your account.</p>
                            </div>
                            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">Configure</button>
                        </div>
                        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50/50">
                            <div>
                                <h4 className="font-semibold text-slate-800">API Access Tokens</h4>
                                <p className="text-sm text-slate-500">Manage keys for accessing the ScireCount API.</p>
                            </div>
                            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">Manage Keys</button>
                        </div>
                    </section>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                    <button className="px-6 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">Cancel</button>
                    <button className="px-6 py-2 bg-sys-primary text-white rounded-lg text-sm font-medium hover:bg-blue-600 shadow-lg shadow-sys-primary/25 transition-colors flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
