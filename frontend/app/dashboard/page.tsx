'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/app/lib/api';
import { useAuthStore } from '@/app/lib/store/auth.store';
import { LogOut, User, CreditCard, FolderOpen, AlertCircle } from 'lucide-react';

interface Overview {
  totalPayments: number;
  approvedPayments: number;
  pendingPayments: number;
  rejectedPayments: number;
}

interface Payment {
  id: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  reference: string;
  proof_image_url?: string;
  created_at: string;
}

interface StudentProfile {
  id: string;
  full_name: string;
  phone?: string;
  track?: string;
  users?: { email: string; status: string };
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'payments' | 'projects' | 'complaints'>('overview');
  const [projectForm, setProjectForm] = useState({ title: '', description: '', file_url: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [complaintForm, setComplaintForm] = useState({ subject: '', message: '' });
  const [complaintSuccess, setComplaintSuccess] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('tmv_token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, paymentsRes] = await Promise.all([
        api.get('/students/me'),
        api.get('/payments/my'),
      ]);

      setProfile(profileRes.data);

      const p = paymentsRes.data;
      setPayments(p);
      setOverview({
        totalPayments: p.length,
        approvedPayments: p.filter((x: Payment) => x.status === 'approved').length,
        pendingPayments: p.filter((x: Payment) => x.status === 'pending').length,
        rejectedPayments: p.filter((x: Payment) => x.status === 'rejected').length,
      });
    } catch {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/projects/submit', projectForm);
      setSubmitSuccess(true);
      setProjectForm({ title: '', description: '', file_url: '' });
    } catch {
      alert('Failed to submit project');
    } finally {
      setSubmitting(false);
    }
  };

  const handleComplaintSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/complaints/create', complaintForm);
      setComplaintSuccess(true);
      setComplaintForm({ subject: '', message: '' });
    } catch {
      alert('Failed to submit complaint');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white/40">Loading dashboard...</p>
      </div>
    );
  }

  const statusColor = (status: string) => {
    if (status === 'approved') return 'text-green-400 border-green-400/20 bg-green-400/10';
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
          <span className="text-white/20 text-xs border border-white/10 px-2 py-0.5 ml-2">Student</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors"
        >
          <LogOut size={14} /> Logout
        </button>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Welcome */}
        <div className="mb-10">
          <h1 className="font-bebas text-4xl text-white">
            WELCOME BACK{profile?.full_name ? `, ${profile.full_name.toUpperCase()}` : ''}
          </h1>
          <p className="text-white/30 text-sm mt-1">{user?.email}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-white/5 mb-10">
          {(['overview', 'payments', 'projects', 'complaints'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? 'border-brand-blue text-white'
                  : 'border-transparent text-white/30 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {[
                { label: 'Total Payments', value: overview?.totalPayments ?? 0, icon: CreditCard },
                { label: 'Approved', value: overview?.approvedPayments ?? 0, icon: CreditCard, color: 'text-green-400' },
                { label: 'Pending', value: overview?.pendingPayments ?? 0, icon: CreditCard, color: 'text-yellow-400' },
                { label: 'Rejected', value: overview?.rejectedPayments ?? 0, icon: CreditCard, color: 'text-red-400' },
              ].map((stat, i) => (
                <div key={i} className="border border-white/5 p-6">
                  <p className="text-white/40 text-xs mb-2">{stat.label}</p>
                  <p className={`font-bebas text-4xl ${stat.color || 'text-white'}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Profile card */}
            <div className="border border-white/5 p-6">
              <h3 className="font-bebas text-xl text-white mb-4 flex items-center gap-2">
                <User size={16} className="text-brand-blue" /> PROFILE
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-white/30 mb-1">Full Name</p>
                  <p className="text-white">{profile?.full_name || '—'}</p>
                </div>
                <div>
                  <p className="text-white/30 mb-1">Email</p>
                  <p className="text-white">{profile?.users?.email || user?.email || '—'}</p>
                </div>
                <div>
                  <p className="text-white/30 mb-1">Track</p>
                  <p className="text-white capitalize">{profile?.track || 'Not assigned'}</p>
                </div>
                <div>
                  <p className="text-white/30 mb-1">Account Status</p>
                  <p className="text-green-400 capitalize">{profile?.users?.status || 'active'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PAYMENTS TAB */}
        {activeTab === 'payments' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bebas text-2xl text-white flex items-center gap-2">
                <CreditCard size={18} className="text-brand-blue" /> MY PAYMENTS
              </h2>
              <Link
                href="/dashboard/submit-payment"
                className="bg-brand-blue text-white text-sm px-4 py-2 hover:bg-blue-600 transition"
              >
                + Submit Payment
              </Link>
            </div>

            {payments.length === 0 ? (
              <div className="border border-white/5 p-12 text-center">
                <p className="text-white/30">No payments submitted yet.</p>
                <Link href="/dashboard/submit-payment" className="text-brand-blue text-sm mt-4 inline-block">
                  Submit your first payment →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {payments.map(payment => (
                  <div key={payment.id} className="border border-white/5 p-5 flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">₦{payment.amount.toLocaleString()}</p>
                      <p className="text-white/30 text-xs mt-1">Ref: {payment.reference}</p>
                      <p className="text-white/20 text-xs">{new Date(payment.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className={`text-xs border px-3 py-1 capitalize ${statusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PROJECTS TAB */}
        {activeTab === 'projects' && (
          <div>
            <h2 className="font-bebas text-2xl text-white flex items-center gap-2 mb-6">
              <FolderOpen size={18} className="text-brand-blue" /> SUBMIT PROJECT
            </h2>

            {submitSuccess ? (
              <div className="border border-green-500/30 bg-green-500/10 text-green-400 p-6">
                Project submitted successfully. Your instructor will review it shortly.
              </div>
            ) : (
              <form onSubmit={handleProjectSubmit} className="space-y-5 max-w-xl">
                <div>
                  <label className="text-white/50 text-sm block mb-2">Project Title</label>
                  <input
                    type="text"
                    required
                    value={projectForm.title}
                    onChange={e => setProjectForm({ ...projectForm, title: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-brand-blue transition"
                  />
                </div>
                <div>
                  <label className="text-white/50 text-sm block mb-2">Description</label>
                  <textarea
                    required
                    rows={4}
                    value={projectForm.description}
                    onChange={e => setProjectForm({ ...projectForm, description: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-brand-blue transition resize-none"
                  />
                </div>
                <div>
                  <label className="text-white/50 text-sm block mb-2">File/Repo URL (Optional)</label>
                  <input
                    type="url"
                    value={projectForm.file_url}
                    onChange={e => setProjectForm({ ...projectForm, file_url: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-brand-blue transition"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-brand-blue text-white px-8 py-3 font-medium hover:bg-blue-600 transition disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Project'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* COMPLAINTS TAB */}
        {activeTab === 'complaints' && (
          <div>
            <h2 className="font-bebas text-2xl text-white flex items-center gap-2 mb-6">
              <AlertCircle size={18} className="text-brand-blue" /> SUBMIT COMPLAINT
            </h2>

            {complaintSuccess ? (
              <div className="border border-green-500/30 bg-green-500/10 text-green-400 p-6">
                Complaint submitted. Our team will respond shortly.
              </div>
            ) : (
              <form onSubmit={handleComplaintSubmit} className="space-y-5 max-w-xl">
                <div>
                  <label className="text-white/50 text-sm block mb-2">Subject</label>
                  <input
                    type="text"
                    required
                    value={complaintForm.subject}
                    onChange={e => setComplaintForm({ ...complaintForm, subject: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-brand-blue transition"
                  />
                </div>
                <div>
                  <label className="text-white/50 text-sm block mb-2">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={complaintForm.message}
                    onChange={e => setComplaintForm({ ...complaintForm, message: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-brand-blue transition resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-brand-blue text-white px-8 py-3 font-medium hover:bg-blue-600 transition disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Complaint'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}