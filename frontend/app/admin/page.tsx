'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/app/lib/api';
import { useAuthStore } from '@/app/lib/store/auth.store';
import {
  LogOut,
  LayoutDashboard,
  CreditCard,
  Users,
  FolderOpen,
  AlertCircle,
  MessageSquare,
  Package,
  Activity,
  TrendingUp,
} from 'lucide-react';

type Tab =
  | 'overview'
  | 'payments'
  | 'students'
  | 'projects'
  | 'complaints'
  | 'contacts'
  | 'builds'
  | 'logs';

export default function AdminPage() {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();

  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [data, setData] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { key: 'overview', label: 'Overview', icon: LayoutDashboard, endpoint: '/admin/metrics' },
    { key: 'payments', label: 'Payments', icon: CreditCard, endpoint: '/admin/payments' },
    { key: 'students', label: 'Students', icon: Users, endpoint: '/admin/students' },
    { key: 'projects', label: 'Projects', icon: FolderOpen, endpoint: '/admin/projects' },
    { key: 'complaints', label: 'Complaints', icon: AlertCircle, endpoint: '/admin/complaints' },
    { key: 'contacts', label: 'Contacts', icon: MessageSquare, endpoint: '/admin/contacts' },
    { key: 'builds', label: 'Builds', icon: Package, endpoint: '/admin/builds' },
    { key: 'logs', label: 'Activity Logs', icon: Activity, endpoint: '/admin/build-logs' },
  ];

  useEffect(() => {
    const token = localStorage.getItem('tmv_token');
    if (!token) router.push('/login');
  }, []);

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const fetchData = async (tab: Tab) => {
    setLoading(true);
    try {
      const endpoint = tabs.find(t => t.key === tab)?.endpoint;

      const res = await api.get(endpoint!);

      if (tab === 'overview') {
        setMetrics(res.data);
      } else {
        setData(res.data?.data || res.data || []);
      }
    } catch (err) {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  const statusColor = (status: string) => {
    if (!status) return 'text-white/40 border-white/10';

    if (['approved', 'active', 'completed'].includes(status))
      return 'text-green-400 border-green-400/20 bg-green-400/10';

    if (['rejected', 'failed'].includes(status))
      return 'text-red-400 border-red-400/20 bg-red-400/10';

    return 'text-yellow-400 border-yellow-400/20 bg-yellow-400/10';
  };

  return (
    <div className="min-h-screen bg-black text-white flex">

      {/* SIDEBAR */}
      <div className="w-64 border-r border-white/5 p-6 space-y-6">
        <h1 className="font-bebas text-2xl tracking-widest">TMV ADMIN OS</h1>

        <div className="space-y-2">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as Tab)}
              className={`flex items-center gap-2 w-full px-3 py-2 text-sm transition border ${
                activeTab === tab.key
                  ? 'border-brand-blue text-white bg-brand-blue/10'
                  : 'border-transparent text-white/40 hover:text-white'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        <button
          onClick={handleLogout}
          className="text-white/40 hover:text-white text-sm flex items-center gap-2"
        >
          <LogOut size={14} />
          Logout
        </button>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-8">

        {/* HEADER */}
        <div className="mb-10">
          <h2 className="font-bebas text-4xl">
            {activeTab.toUpperCase()}
          </h2>
          <p className="text-white/30 text-sm">
            System-level control dashboard
          </p>
        </div>

        {/* OVERVIEW */}
        {activeTab === 'overview' && metrics && (
          <div className="grid grid-cols-4 gap-4">
            {Object.entries(metrics).map(([key, value]: any) => (
              <div key={key} className="border border-white/5 p-5">
                <p className="text-white/30 text-xs">{key}</p>
                <p className="text-2xl font-bold mt-2">{value}</p>
              </div>
            ))}
          </div>
        )}

        {/* LIST */}
        {activeTab !== 'overview' && (
          <div className="space-y-3 mt-6">

            {loading ? (
              <p className="text-white/30">Loading...</p>
            ) : data.length === 0 ? (
              <p className="text-white/30">No data found</p>
            ) : (
              data.map((item: any) => (
                <div key={item.id} className="border border-white/5 p-5 flex justify-between">

                  <div>
                    <p className="text-white font-medium">
                      {item.name || item.title || item.subject || 'Record'}
                    </p>

                    <p className="text-white/40 text-sm">
                      {item.email || item.description || ''}
                    </p>

                    <p className="text-white/20 text-xs mt-1">
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <span className={`text-xs border px-3 py-1 ${statusColor(item.status)}`}>
                    {item.status || '—'}
                  </span>

                </div>
              ))
            )}

          </div>
        )}
      </div>
    </div>
  );
}