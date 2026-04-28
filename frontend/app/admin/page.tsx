'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/app/lib/api';
import { useAuthStore } from '@/app/lib/store/auth.store';
import {
  LogOut, CreditCard, Users, FolderOpen,
  AlertCircle, MessageSquare, Package, CheckCircle, XCircle
} from 'lucide-react';

type Tab = 'payments' | 'students' | 'projects' | 'complaints' | 'contacts' | 'builds';

export default function AdminPage() {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>('payments');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const tabs: { key: Tab; label: string; icon: any; endpoint: string }[] = [
    { key: 'payments', label: 'Payments', icon: CreditCard, endpoint: '/admin/payments' },
    { key: 'students', label: 'Students', icon: Users, endpoint: '/admin/students' },
    { key: 'projects', label: 'Projects', icon: FolderOpen, endpoint: '/admin/projects' },
    { key: 'complaints', label: 'Complaints', icon: AlertCircle, endpoint: '/admin/complaints' },
    { key: 'contacts', label: 'Contacts', icon: MessageSquare, endpoint: '/admin/contacts' },
    { key: 'builds', label: 'Builds', icon: Package, endpoint: '/admin/builds' },
  ];

  useEffect(() => {
    const token = localStorage.getItem('tmv_token');
    if (!token) { router.push('/login'); return; }
    fetchTab(activeTab);
  }, [activeTab]);

  const fetchTab = async (tab: Tab) => {
    setLoading(true);
    try {
      const endpoint = tabs.find(t => t.key === tab)?.endpoint;
      const res = await api.get(endpoint!);
      setData(res.data?.data || res.data || []);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      await api.patch(`/admin/payments/${id}/approve`, {});
      fetchTab('payments');
    } catch {
      alert('Failed to approve payment');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoading(id);
    try {
      await api.patch(`/admin/payments/${id}/reject`, {});
      fetchTab('payments');
    } catch {
      alert('Failed to reject payment');
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  const statusColor = (status: string) => {
    if (status === 'approved' || status === 'active') return 'text-green-400 border-green-400/20 bg-green-400/10';
    if (status === 'rejected') return 'text-red-400 border-red-400/20 bg-red-400/10';
    return 'text-yellow-400 border-yellow-400/20 bg-yellow-400/10';
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-brand-blue rounded-sm flex items-center justify-center">
            <span className="font-bebas text-white text-sm">T</span>
          </div>
          <span className="font-bebas tracking-widest text-white">TECHMINDSVERSE</span>
          <span className="text-white/20 text-xs border border-white/10 px-2 py-0.5 ml-2">Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white/30 text-sm">{user?.email}</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="font-bebas text-4xl text-white">ADMIN PANEL</h1>
          <p className="text-white/30 text-sm mt-1">Manage payments, students, projects and more</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-white/5 mb-10 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
                activeTab === tab.key
                  ? 'border-brand-blue text-white'
                  : 'border-transparent text-white/30 hover:text-white'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <p className="text-white/30">Loading...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="border border-white/5 p-12 text-center">
            <p className="text-white/30">No records found.</p>
          </div>
        ) : (
          <div className="space-y-3">

            {/* PAYMENTS */}
            {activeTab === 'payments' && data.map((payment: any) => (
              <div key={payment.id} className="border border-white/5 p-5">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div>
                    <p className="text-white font-medium">₦{payment.amount?.toLocaleString()}</p>
                    <p className="text-white/40 text-sm mt-1">
                      {payment.users?.email || 'Unknown user'}
                    </p>
                    <p className="text-white/20 text-xs mt-1">Ref: {payment.reference}</p>
                    <p className="text-white/20 text-xs">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </p>
                    {payment.proof_image_url && (
                      <a
                        href={payment.proof_image_url}
                        target="_blank"
                        className="text-brand-blue text-xs mt-2 inline-block hover:underline"
                      >
                        View Proof →
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs border px-3 py-1 capitalize ${statusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                    {payment.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(payment.id)}
                          disabled={actionLoading === payment.id}
                          className="flex items-center gap-1 text-xs bg-green-500/10 border border-green-500/30 text-green-400 px-3 py-1 hover:bg-green-500/20 transition disabled:opacity-50"
                        >
                          <CheckCircle size={12} /> Approve
                        </button>
                        <button
                          onClick={() => handleReject(payment.id)}
                          disabled={actionLoading === payment.id}
                          className="flex items-center gap-1 text-xs bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-1 hover:bg-red-500/20 transition disabled:opacity-50"
                        >
                          <XCircle size={12} /> Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* STUDENTS */}
            {activeTab === 'students' && data.map((student: any) => (
              <div key={student.id} className="border border-white/5 p-5">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <p className="text-white font-medium">{student.full_name || 'No name'}</p>
                    <p className="text-white/40 text-sm">{student.users?.email}</p>
                    <p className="text-white/20 text-xs mt-1 capitalize">
                      Track: {student.track || 'Not assigned'}
                    </p>
                  </div>
                  <span className={`text-xs border px-3 py-1 capitalize ${statusColor(student.users?.status)}`}>
                    {student.users?.status}
                  </span>
                </div>
              </div>
            ))}

            {/* PROJECTS */}
            {activeTab === 'projects' && data.map((project: any) => (
              <div key={project.id} className="border border-white/5 p-5">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div>
                    <p className="text-white font-medium">{project.title}</p>
                    <p className="text-white/40 text-sm mt-1">{project.description}</p>
                    <p className="text-white/20 text-xs mt-2">
                      By: {project.students?.full_name || 'Unknown'}
                    </p>
                    {project.file_url && (
                      <a
                        href={project.file_url}
                        target="_blank"
                        className="text-brand-blue text-xs mt-1 inline-block hover:underline"
                      >
                        View File →
                      </a>
                    )}
                  </div>
                  <span className={`text-xs border px-3 py-1 capitalize ${statusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>
              </div>
            ))}

            {/* COMPLAINTS */}
            {activeTab === 'complaints' && data.map((complaint: any) => (
              <div key={complaint.id} className="border border-white/5 p-5">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div>
                    <p className="text-white font-medium">{complaint.subject}</p>
                    <p className="text-white/40 text-sm mt-1">{complaint.message}</p>
                    <p className="text-white/20 text-xs mt-2">{complaint.users?.email}</p>
                    <p className="text-white/20 text-xs">
                      {new Date(complaint.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`text-xs border px-3 py-1 capitalize ${statusColor(complaint.status)}`}>
                    {complaint.status}
                  </span>
                </div>
              </div>
            ))}

            {/* CONTACTS */}
            {activeTab === 'contacts' && data.map((contact: any) => (
              <div key={contact.id} className="border border-white/5 p-5">
                <p className="text-white font-medium">{contact.name}</p>
                <p className="text-white/40 text-sm">{contact.email}</p>
                <p className="text-brand-blue text-sm mt-1">{contact.subject}</p>
                <p className="text-white/40 text-sm mt-2">{contact.message}</p>
                <p className="text-white/20 text-xs mt-2">
                  {new Date(contact.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}

            {/* BUILDS */}
            {activeTab === 'builds' && data.map((build: any) => (
              <div key={build.id} className="border border-white/5 p-5">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div>
                    <p className="text-white font-medium">{build.name}</p>
                    <p className="text-white/40 text-sm">{build.email}</p>
                    <p className="text-brand-blue text-xs mt-1 capitalize">{build.category}</p>
                    <p className="text-white/40 text-sm mt-2">{build.description}</p>
                    {build.budget && (
                      <p className="text-white/20 text-xs mt-1">Budget: {build.budget}</p>
                    )}
                    {build.requirements && (
                      <p className="text-white/20 text-xs mt-1">Requirements: {build.requirements}</p>
                    )}
                    <p className="text-white/20 text-xs mt-2">
                      {new Date(build.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`text-xs border px-3 py-1 capitalize ${statusColor(build.status)}`}>
                    {build.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}