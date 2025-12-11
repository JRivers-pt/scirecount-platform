import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Search, MoreHorizontal, Mail, MapPin, CheckCircle, XCircle } from 'lucide-react';

// Initial state empty, fetch from backend
const Clients = () => {
    const { t } = useTranslation();
    const [clients, setClients] = useState<any[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Form State
    const [newClient, setNewClient] = useState({ name: '', email: '', plan: 'Pro' });

    // Fetch Clients
    useEffect(() => {
        fetch('http://localhost:3000/api/clients')
            .then(res => res.json())
            .then(data => setClients(data))
            .catch(err => console.error("Failed to fetch clients:", err));
    }, []);

    const handleCreateClient = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/api/clients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newClient, status: 'active', locationsCount: 0 })
            });

            if (response.ok) {
                const createdClient = await response.json();
                setClients([...clients, createdClient]);
                setIsCreateModalOpen(false);
                setNewClient({ name: '', email: '', plan: 'Pro' });
            }
        } catch (error) {
            console.error("Error creating client:", error);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{t('clients.title')}</h1>
                    <p className="text-slate-500 mt-1">{t('clients.subtitle')}</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-sys-primary text-white font-medium rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-sys-primary/25"
                >
                    <Plus className="w-5 h-5" />
                    {t('clients.btn_new')}
                </button>
            </div>

            {/* Simulating Search/Filter Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                <Search className="w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    placeholder={t('clients.search_placeholder')}
                    className="flex-1 bg-transparent border-none focus:outline-none text-sm text-slate-700 placeholder-slate-400"
                />
            </div>

            {/* Clients Grid */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-xs">
                        <tr>
                            <th className="px-6 py-4">{t('clients.col_name')}</th>
                            <th className="px-6 py-4">{t('clients.col_plan')}</th>
                            <th className="px-6 py-4">{t('clients.col_locations')}</th>
                            <th className="px-6 py-4">{t('clients.col_status')}</th>
                            <th className="px-6 py-4 text-right">{t('clients.col_actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {clients.map((client) => (
                            <tr key={client.id} className="hover:bg-slate-50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-200 to-slate-100 flex items-center justify-center text-slate-500 font-bold border border-slate-200">
                                            {client.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-700">{client.name}</p>
                                            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                                                <Mail className="w-3 h-3" />
                                                {client.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 text-xs font-bold border border-purple-100 uppercase tracking-wide">
                                        {client.plan}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-600 font-medium">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-slate-400" />
                                        {client.locations}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {client.status === 'active' ? (
                                        <span className="inline-flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full text-xs font-semibold">
                                            <CheckCircle className="w-3 h-3" /> {t('clients.status_active')}
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full text-xs font-semibold">
                                            <XCircle className="w-3 h-3" /> {t('clients.status_inactive')}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Create Client Modal (Overlay) */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="font-bold text-slate-800">{t('clients.modal_title')}</h3>
                        </div>
                        <form onSubmit={handleCreateClient} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">{t('clients.col_name')}</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sys-primary/20"
                                    value={newClient.name}
                                    onChange={e => setNewClient({ ...newClient, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">{t('clients.label_email')}</label>
                                <input
                                    required
                                    type="email"
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sys-primary/20"
                                    value={newClient.email}
                                    onChange={e => setNewClient({ ...newClient, email: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50">{t('clients.btn_cancel')}</button>
                                <button type="submit" className="flex-1 px-4 py-2 bg-sys-primary text-white rounded-lg font-medium hover:bg-blue-600 shadow-lg shadow-sys-primary/20">{t('clients.btn_create')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Clients;
