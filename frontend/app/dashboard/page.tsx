'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/app/lib/api';
import { useAuthStore } from '@/app/lib/store/auth.store';
import {
  Home, CreditCard, FolderOpen, AlertCircle,
  LogOut, BookOpen, Package, Bell, Activity,
  TrendingUp, ChevronRight, ArrowRight, Plus,
  CheckCircle, Clock, XCircle, Hammer, User,
  BarChart2, Zap, Star, Shield
} from 'lucide-react';

/* ── Types ── */
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
  performance_score?: number;
  rank?: number;
  users?: { email: string; status: string; role: string };
}

interface ClientProfile {
  id: string;
  full_name: string;
  company?: string;
  phone?: string;
  users?: { email: string; status: string; role: string };
}

interface Build {
  id: string;
  name: string;
  email: string;
  category: string;
  description: string;
  status: string;
  progress: number;
  budget?: string;
  mode?: string;
  created_at: string;
}

/* ── Shared utilities ── */
const statusConfig = (status: string) => {
  const map: Record<string, { label: string; className: string; icon: any }> = {
    approved: { label: 'Approved', className: 'bg-green-50 text-green-700 border border-green-200', icon: CheckCircle },
    active: { label: 'Active', className: 'bg-green-50 text-green-700 border border-green-200', icon: CheckCircle },
    completed: { label: 'Completed', className: 'bg-green-50 text-green-700 border border-green-200', icon: CheckCircle },
    delivered: { label: 'Delivered', className: 'bg-green-50 text-green-700 border border-green-200', icon: CheckCircle },
    pending: { label: 'Pending', className: 'bg-yellow-50 text-yellow-700 border border-yellow-200', icon: Clock },
    submitted: { label: 'Submitted', className: 'bg-blue-50 text-blue-700 border border-blue-200', icon: Clock },
    reviewing: { label: 'Reviewing', className: 'bg-purple-50 text-purple-700 border border-purple-200', icon: Activity },
    in_progress: { label: 'In Progress', className: 'bg-blue-50 text-blue-700 border border-blue-200', icon: Activity },
    planning: { label: 'Planning', className: 'bg-indigo-50 text-indigo-700 border border-indigo-200', icon: Activity },
    testing: { label: 'Testing', className: 'bg-orange-50 text-orange-700 border border-orange-200', icon: Activity },
    rejected: { label: 'Rejected', className: 'bg-red-50 text-red-700 border border-red-200', icon: XCircle },
    failed: { label: 'Failed', className: 'bg-red-50 text-red-700 border border-red-200', icon: XCircle },
  };
  return map[status] || { label: status, className: 'bg-gray-50 text-gray-600 border border-gray-200', icon: Clock };
};

function StatusBadge({ status }: { status: string }) {
  const config = statusConfig(status);
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${config.className}`}>
      <Icon size={10} />
      {config.label}
    </span>
  );
}

function MetricCard({ label, value, color = 'text-gray-900', sub }: {
  label: string; value: string | number; color?: string; sub?: string;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 hover:border-gray-200 hover:shadow-sm transition-all">
      <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-2">{label}</p>
      <p className={`text-3xl font-bebas ${color}`}>{value}</p>
      {sub && <p className="text-gray-400 text-xs mt-1">{sub}</p>}
    </div>
  );
}

/* ── Input style ── */
const inputClass = 'w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all';

/* ── Sidebar ── */
function Sidebar({
  role,
  activeTab,
  setActiveTab,
  profile,
  user,
  onLogout,
  tabs,
}: any) {
  return (
    <aside className="w-64 shrink-0 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#1A3BDB] rounded-lg flex items-center justify-center">
            <span className="font-bebas text-white text-base">T</span>
          </div>
          <div>
            <p className="font-bebas tracking-widest text-gray-900 text-sm leading-none">TECHMINDSVERSE</p>
            <p className="text-gray-400 text-[10px] mt-0.5 uppercase tracking-wider">{role === 'client' ? 'Client Portal' : 'Student OS'}</p>
          </div>
        </Link>
      </div>

      {/* Profile */}
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
          <div className="w-9 h-9 bg-[#1A3BDB] rounded-lg flex items-center justify-center shrink-0">
            <span className="font-bebas text-white text-lg">
              {(profile?.full_name || user?.email || 'U')[0].toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-gray-900 text-sm font-semibold truncate">
              {profile?.full_name || user?.email?.split('@')[0]}
            </p>
            <p className="text-gray-400 text-xs truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {tabs.map((tab: any) => {
          const Icon = tab.icon;
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                active
                  ? 'bg-blue-50 text-[#1A3BDB] font-semibold'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon size={16} className={active ? 'text-[#1A3BDB]' : 'text-gray-400'} />
              {tab.label}
              {tab.badge && (
                <span className="ml-auto bg-[#1A3BDB] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Divider + Quick links */}
        <div className="pt-4 mt-4 border-t border-gray-100">
          <p className="px-3 text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-2">Quick Access</p>
          {role !== 'client' && (
            <Link href="/academy" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all">
              <BookOpen size={15} className="text-gray-400" /> Academy
            </Link>
          )}
          <Link href="/build" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all">
            <Package size={15} className="text-gray-400" /> Build Studio
          </Link>
          <Link href="/community" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all">
            <Zap size={15} className="text-gray-400" /> Community
          </Link>
        </div>
      </nav>

      {/* Logout */}
      <div className="px-4 py-4 border-t border-gray-100">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <LogOut size={15} /> Sign Out
        </button>
      </div>
    </aside>
  );
}

/* ── STUDENT DASHBOARD ── */
function StudentDashboard({ user, profile, payments }: {
  user: any; profile: StudentProfile | null; payments: Payment[];
}) {
  const router = useRouter();
  const { clearAuth } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [projectForm, setProjectForm] = useState({ title: '', description: '', file_url: '' });
  const [complaintForm, setComplaintForm] = useState({ subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [projectSuccess, setProjectSuccess] = useState(false);
  const [complaintSuccess, setComplaintSuccess] = useState(false);

  const approved = payments.filter(p => p.status === 'approved').length;
  const pending = payments.filter(p => p.status === 'pending').length;
  const isActive = !profile?.users?.status || profile.users.status === 'active';

  const tabs = [
    { key: 'overview', label: 'Overview', icon: Home },
    { key: 'payments', label: 'Payments', icon: CreditCard, badge: pending > 0 ? pending : undefined },
    { key: 'projects', label: 'Projects', icon: FolderOpen },
    { key: 'support', label: 'Support', icon: AlertCircle },
  ];

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/projects/submit', projectForm);
      setProjectSuccess(true);
      setProjectForm({ title: '', description: '', file_url: '' });
    } catch { alert('Failed to submit project'); }
    finally { setSubmitting(false); }
  };

  const handleComplaintSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/complaints/create', complaintForm);
      setComplaintSuccess(true);
      setComplaintForm({ subject: '', message: '' });
    } catch { alert('Failed to submit'); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        role="student"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        user={user}
        onLogout={() => { clearAuth(); router.push('/login'); }}
        tabs={tabs}
      />

      <main className="flex-1 overflow-x-hidden">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-gray-900 font-semibold text-lg">
              {tabs.find(t => t.key === activeTab)?.label}
            </h1>
            <p className="text-gray-400 text-xs">TechMindsVerse Student Portal</p>
          </div>
          <div className="flex items-center gap-3">
            {!isActive && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-yellow-700 bg-yellow-50 border border-yellow-200 px-3 py-1.5 rounded-full">
                <Bell size={11} /> Pending activation
              </span>
            )}
            <Link
              href="/dashboard/submit-payment"
              className="bg-[#1A3BDB] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2"
            >
              <Plus size={14} /> Submit Payment
            </Link>
          </div>
        </div>

        <div className="px-8 py-8">
          <AnimatePresence mode="wait">

            {/* OVERVIEW */}
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">

                {/* Welcome */}
                <div className="bg-gradient-to-br from-[#1A3BDB] to-blue-700 rounded-2xl p-6 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-1/3 w-24 h-24 bg-white/5 rounded-full translate-y-1/2" />
                  <div className="relative z-10">
                    <p className="text-blue-200 text-sm mb-1">Welcome back</p>
                    <h2 className="font-bebas text-3xl text-white leading-none mb-2">
                      {profile?.full_name?.toUpperCase() || user?.email?.split('@')[0].toUpperCase()}
                    </h2>
                    <p className="text-blue-200 text-sm">
                      {isActive ? '✓ Account active · Keep building' : '⏳ Check your email to activate your account'}
                    </p>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <MetricCard label="Total Payments" value={payments.length} />
                  <MetricCard label="Approved" value={approved} color="text-green-600" sub="Verified" />
                  <MetricCard label="Pending" value={pending} color="text-yellow-600" sub="Awaiting review" />
                  <MetricCard label="Rejected" value={payments.filter(p => p.status === 'rejected').length} color="text-red-500" />
                </div>

                {/* Profile + Ecosystem */}
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Profile card */}
                  <div className="bg-white border border-gray-100 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <User size={16} className="text-[#1A3BDB]" /> My Profile
                      </h3>
                    </div>
                    {profile ? (
                      <div className="space-y-4">
                        {[
                          { label: 'Full Name', value: profile.full_name },
                          { label: 'Email', value: profile.users?.email || user?.email },
                          { label: 'Track', value: profile.track || 'Not assigned yet' },
                          { label: 'Status', value: profile.users?.status || 'active', isStatus: true },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                            <span className="text-gray-500 text-sm">{item.label}</span>
                            {item.isStatus ? (
                              <StatusBadge status={item.value} />
                            ) : (
                              <span className="text-gray-900 text-sm font-medium capitalize">{item.value}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <User size={32} className="text-gray-200 mx-auto mb-3" />
                        <p className="text-gray-400 text-sm">No student profile found.</p>
                        <p className="text-gray-300 text-xs mt-1">Contact support if you enrolled.</p>
                      </div>
                    )}
                  </div>

                  {/* Ecosystem modules */}
                  <div className="bg-white border border-gray-100 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-5 flex items-center gap-2">
                      <Zap size={16} className="text-[#1A3BDB]" /> Ecosystem Access
                    </h3>
                    <div className="space-y-3">
                      {[
                        { icon: BookOpen, label: 'Academy', desc: 'Access your courses', href: '/academy', available: true },
                        { icon: Package, label: 'Build Studio', desc: 'Submit a build request', href: '/build', available: true },
                        { icon: FolderOpen, label: 'Projects', desc: 'Submit your projects', action: () => setActiveTab('projects'), available: true },
                      ].map((mod, i) => (
                        <div
                          key={i}
                          onClick={mod.action}
                          className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 cursor-pointer transition-all group"
                        >
                          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                            <mod.icon size={18} className="text-[#1A3BDB]" />
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-900 text-sm font-medium">{mod.label}</p>
                            <p className="text-gray-400 text-xs">{mod.desc}</p>
                          </div>
                          <ChevronRight size={14} className="text-gray-300 group-hover:text-[#1A3BDB] transition-colors" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent payments */}
                {payments.length > 0 && (
                  <div className="bg-white border border-gray-100 rounded-xl">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                      <h3 className="font-semibold text-gray-900">Recent Payments</h3>
                      <button onClick={() => setActiveTab('payments')} className="text-[#1A3BDB] text-sm hover:underline">
                        View all
                      </button>
                    </div>
                    <div className="divide-y divide-gray-50">
                      {payments.slice(0, 3).map(payment => (
                        <div key={payment.id} className="flex items-center justify-between px-6 py-4">
                          <div>
                            <p className="text-gray-900 font-semibold text-sm">₦{payment.amount.toLocaleString()}</p>
                            <p className="text-gray-400 text-xs mt-0.5">Ref: {payment.reference}</p>
                          </div>
                          <StatusBadge status={payment.status} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* PAYMENTS */}
            {activeTab === 'payments' && (
              <motion.div key="payments" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-gray-900 font-semibold text-xl">My Payments</h2>
                    <p className="text-gray-400 text-sm mt-0.5">{payments.length} total payment{payments.length !== 1 ? 's' : ''}</p>
                  </div>
                  <Link href="/dashboard/submit-payment" className="bg-[#1A3BDB] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2">
                    <Plus size={14} /> Submit Payment
                  </Link>
                </div>

                {payments.length === 0 ? (
                  <div className="bg-white border border-gray-100 rounded-xl p-16 text-center">
                    <CreditCard size={36} className="text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium mb-1">No payments yet</p>
                    <p className="text-gray-400 text-sm mb-6">Submit your enrollment payment to get started.</p>
                    <Link href="/dashboard/submit-payment" className="bg-[#1A3BDB] text-white text-sm font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-all inline-flex items-center gap-2">
                      Submit Payment <ArrowRight size={14} />
                    </Link>
                  </div>
                ) : (
                  <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                    <div className="divide-y divide-gray-50">
                      {payments.map(payment => (
                        <div key={payment.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                              <CreditCard size={16} className="text-[#1A3BDB]" />
                            </div>
                            <div>
                              <p className="text-gray-900 font-semibold">₦{payment.amount.toLocaleString()}</p>
                              <p className="text-gray-400 text-xs mt-0.5">
                                Ref: {payment.reference} · {new Date(payment.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {payment.proof_image_url && (
                              <a href={payment.proof_image_url} target="_blank" className="text-[#1A3BDB] text-xs hover:underline">
                                View proof
                              </a>
                            )}
                            <StatusBadge status={payment.status} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* PROJECTS */}
            {activeTab === 'projects' && (
              <motion.div key="projects" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="mb-6">
                  <h2 className="text-gray-900 font-semibold text-xl">Submit Project</h2>
                  <p className="text-gray-400 text-sm mt-0.5">Share your project with your instructor for review.</p>
                </div>

                {projectSuccess ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                    <CheckCircle size={40} className="text-green-500 mx-auto mb-4" />
                    <h3 className="text-green-800 font-semibold text-lg mb-2">Project Submitted!</h3>
                    <p className="text-green-600 text-sm mb-5">Your instructor will review it shortly.</p>
                    <button onClick={() => setProjectSuccess(false)} className="text-green-700 font-medium text-sm hover:underline">
                      Submit another project
                    </button>
                  </div>
                ) : (
                  <div className="bg-white border border-gray-100 rounded-xl p-8 max-w-2xl">
                    <form onSubmit={handleProjectSubmit} className="space-y-5">
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Project Title *</label>
                        <input type="text" required value={projectForm.title}
                          onChange={e => setProjectForm({ ...projectForm, title: e.target.value })}
                          placeholder="e.g. E-commerce Platform, Portfolio Website"
                          className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Description *</label>
                        <textarea required rows={4} value={projectForm.description}
                          onChange={e => setProjectForm({ ...projectForm, description: e.target.value })}
                          placeholder="Describe what you built and the technologies used..."
                          className={`${inputClass} resize-none`} />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Repository / Live URL <span className="text-gray-400 font-normal">(Optional)</span></label>
                        <input type="url" value={projectForm.file_url}
                          onChange={e => setProjectForm({ ...projectForm, file_url: e.target.value })}
                          placeholder="https://github.com/username/project"
                          className={inputClass} />
                      </div>
                      <button type="submit" disabled={submitting}
                        className="bg-[#1A3BDB] text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center gap-2">
                        {submitting ? 'Submitting...' : (<><FolderOpen size={16} /> Submit Project</>)}
                      </button>
                    </form>
                  </div>
                )}
              </motion.div>
            )}

            {/* SUPPORT */}
            {activeTab === 'support' && (
              <motion.div key="support" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="mb-6">
                  <h2 className="text-gray-900 font-semibold text-xl">Support</h2>
                  <p className="text-gray-400 text-sm mt-0.5">Submit a request or complaint. We respond within 24 hours.</p>
                </div>

                {complaintSuccess ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center max-w-2xl">
                    <CheckCircle size={40} className="text-green-500 mx-auto mb-4" />
                    <h3 className="text-green-800 font-semibold text-lg mb-2">Request Submitted</h3>
                    <p className="text-green-600 text-sm mb-5">Our team will respond to you shortly.</p>
                    <button onClick={() => setComplaintSuccess(false)} className="text-green-700 font-medium text-sm hover:underline">
                      Submit another
                    </button>
                  </div>
                ) : (
                  <div className="bg-white border border-gray-100 rounded-xl p-8 max-w-2xl">
                    <form onSubmit={handleComplaintSubmit} className="space-y-5">
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Subject *</label>
                        <input type="text" required value={complaintForm.subject}
                          onChange={e => setComplaintForm({ ...complaintForm, subject: e.target.value })}
                          placeholder="What is this regarding?"
                          className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Message *</label>
                        <textarea required rows={5} value={complaintForm.message}
                          onChange={e => setComplaintForm({ ...complaintForm, message: e.target.value })}
                          placeholder="Describe your issue or request in detail..."
                          className={`${inputClass} resize-none`} />
                      </div>
                      <button type="submit" disabled={submitting}
                        className="bg-[#1A3BDB] text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50">
                        {submitting ? 'Submitting...' : 'Submit Request'}
                      </button>
                    </form>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

/* ── CLIENT DASHBOARD ── */
function ClientDashboard({ user, profile, builds }: {
  user: any; profile: ClientProfile | null; builds: Build[];
}) {
  const router = useRouter();
  const { clearAuth } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [complaintForm, setComplaintForm] = useState({ subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [complaintSuccess, setComplaintSuccess] = useState(false);

  const activeBuilds = builds.filter(b => ['reviewing', 'planning', 'in_progress', 'testing'].includes(b.status)).length;
  const completedBuilds = builds.filter(b => ['completed', 'delivered'].includes(b.status)).length;

  const tabs = [
    { key: 'overview', label: 'Overview', icon: Home },
    { key: 'builds', label: 'My Builds', icon: Hammer, badge: activeBuilds > 0 ? activeBuilds : undefined },
    { key: 'support', label: 'Support', icon: AlertCircle },
  ];

  const handleComplaintSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/complaints/create', complaintForm);
      setComplaintSuccess(true);
      setComplaintForm({ subject: '', message: '' });
    } catch { alert('Failed to submit'); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        role="client"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        user={user}
        onLogout={() => { clearAuth(); router.push('/login'); }}
        tabs={tabs}
      />

      <main className="flex-1 overflow-x-hidden">
        <div className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-gray-900 font-semibold text-lg">
              {tabs.find(t => t.key === activeTab)?.label}
            </h1>
            <p className="text-gray-400 text-xs">TechMindsVerse Client Portal</p>
          </div>
          <Link href="/build" className="bg-[#1A3BDB] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2">
            <Plus size={14} /> New Build
          </Link>
        </div>

        <div className="px-8 py-8">
          <AnimatePresence mode="wait">

            {/* OVERVIEW */}
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">

                <div className="bg-gradient-to-br from-[#1A3BDB] to-blue-700 rounded-2xl p-6 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <p className="text-blue-200 text-sm mb-1">Client Portal</p>
                  <h2 className="font-bebas text-3xl text-white leading-none mb-2">
                    {profile?.full_name?.toUpperCase() || user?.email?.split('@')[0].toUpperCase()}
                  </h2>
                  <p className="text-blue-200 text-sm">
                    {builds.length === 0
                      ? 'No build requests yet. Submit your first idea →'
                      : `${activeBuilds} active build${activeBuilds !== 1 ? 's' : ''} · ${completedBuilds} completed`}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <MetricCard label="Total Requests" value={builds.length} />
                  <MetricCard label="Active Builds" value={activeBuilds} color="text-[#1A3BDB]" sub="In progress" />
                  <MetricCard label="Completed" value={completedBuilds} color="text-green-600" sub="Delivered" />
                </div>

                {builds.length === 0 ? (
                  <div className="bg-white border border-gray-100 rounded-xl p-16 text-center">
                    <Hammer size={40} className="text-gray-200 mx-auto mb-4" />
                    <h3 className="text-gray-700 font-semibold text-lg mb-2">No builds yet</h3>
                    <p className="text-gray-400 text-sm mb-6 max-w-xs mx-auto">
                      Submit your first build request and our team will review it within 24 hours.
                    </p>
                    <Link href="/build" className="bg-[#1A3BDB] text-white text-sm font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-all inline-flex items-center gap-2">
                      Submit Build Request <ArrowRight size={14} />
                    </Link>
                  </div>
                ) : (
                  <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                      <h3 className="font-semibold text-gray-900">Recent Build Requests</h3>
                      <button onClick={() => setActiveTab('builds')} className="text-[#1A3BDB] text-sm hover:underline">
                        View all
                      </button>
                    </div>
                    <div className="divide-y divide-gray-50">
                      {builds.slice(0, 4).map(build => (
                        <div key={build.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                            <Hammer size={16} className="text-[#1A3BDB]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className="text-gray-900 font-medium text-sm truncate">{build.name}</p>
                              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full capitalize shrink-0">{build.category}</span>
                            </div>
                            <p className="text-gray-400 text-xs truncate">{build.description}</p>
                            {build.progress > 0 && (
                              <div className="flex items-center gap-2 mt-2">
                                <div className="flex-1 bg-gray-100 h-1.5 rounded-full max-w-[100px]">
                                  <div className="h-1.5 bg-[#1A3BDB] rounded-full" style={{ width: `${build.progress}%` }} />
                                </div>
                                <span className="text-gray-400 text-xs">{build.progress}%</span>
                              </div>
                            )}
                          </div>
                          <StatusBadge status={build.status} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* BUILDS */}
            {activeTab === 'builds' && (
              <motion.div key="builds" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-gray-900 font-semibold text-xl">My Build Requests</h2>
                    <p className="text-gray-400 text-sm mt-0.5">{builds.length} request{builds.length !== 1 ? 's' : ''} submitted</p>
                  </div>
                  <Link href="/build" className="bg-[#1A3BDB] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2">
                    <Plus size={14} /> New Request
                  </Link>
                </div>

                {builds.length === 0 ? (
                  <div className="bg-white border border-gray-100 rounded-xl p-16 text-center">
                    <Hammer size={36} className="text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium mb-1">No build requests yet</p>
                    <Link href="/build" className="text-[#1A3BDB] text-sm hover:underline">Submit your first build →</Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {builds.map(build => (
                      <div key={build.id} className="bg-white border border-gray-100 rounded-xl p-6 hover:border-gray-200 hover:shadow-sm transition-all">
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h3 className="text-gray-900 font-semibold">{build.name}</h3>
                              <span className="text-xs text-[#1A3BDB] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full capitalize">{build.category}</span>
                              {build.mode && <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full capitalize">{build.mode}</span>}
                            </div>
                            <p className="text-gray-500 text-sm leading-relaxed">{build.description}</p>
                            {build.budget && <p className="text-gray-400 text-xs mt-1">Budget: {build.budget}</p>}
                          </div>
                          <StatusBadge status={build.status} />
                        </div>
                        {build.progress > 0 && (
                          <div className="mb-3">
                            <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                              <span>Build Progress</span><span>{build.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-100 h-2 rounded-full">
                              <div className="h-2 bg-[#1A3BDB] rounded-full transition-all" style={{ width: `${build.progress}%` }} />
                            </div>
                          </div>
                        )}
                        <p className="text-gray-300 text-xs">{new Date(build.created_at).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* SUPPORT */}
            {activeTab === 'support' && (
              <motion.div key="support" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="mb-6">
                  <h2 className="text-gray-900 font-semibold text-xl">Support</h2>
                  <p className="text-gray-400 text-sm mt-0.5">Need help with your project? We respond within 24 hours.</p>
                </div>
                {complaintSuccess ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center max-w-2xl">
                    <CheckCircle size={40} className="text-green-500 mx-auto mb-4" />
                    <h3 className="text-green-800 font-semibold text-lg mb-2">Request Submitted</h3>
                    <button onClick={() => setComplaintSuccess(false)} className="text-green-700 font-medium text-sm hover:underline">Submit another</button>
                  </div>
                ) : (
                  <div className="bg-white border border-gray-100 rounded-xl p-8 max-w-2xl">
                    <form onSubmit={handleComplaintSubmit} className="space-y-5">
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Subject *</label>
                        <input type="text" required value={complaintForm.subject}
                          onChange={e => setComplaintForm({ ...complaintForm, subject: e.target.value })}
                          placeholder="What do you need help with?"
                          className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Message *</label>
                        <textarea required rows={5} value={complaintForm.message}
                          onChange={e => setComplaintForm({ ...complaintForm, message: e.target.value })}
                          placeholder="Describe your issue..."
                          className={`${inputClass} resize-none`} />
                      </div>
                      <button type="submit" disabled={submitting}
                        className="bg-[#1A3BDB] text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50">
                        {submitting ? 'Submitting...' : 'Submit Request'}
                      </button>
                    </form>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

/* ── MAIN EXPORT ── */
export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [clientProfile, setClientProfile] = useState<ClientProfile | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [builds, setBuilds] = useState<Build[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('tmv_token');
    if (!token) { router.push('/login'); return; }
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const role = user?.role;

      const [paymentsRes, buildsRes] = await Promise.all([
        api.get('/payments/my').catch(() => ({ data: [] as any[] })),
        api.get('/build/my').catch(() => ({ data: [] as any[] })),
      ]);

      setPayments(paymentsRes.data || []);
      setBuilds(buildsRes.data || []);

      if (role === 'client') {
        const profileRes = await api.get('/clients/me').catch(() => ({ data: null }));
        setClientProfile(profileRes.data || null);
      } else {
        const profileRes = await api.get('/students/me').catch(() => ({ data: null }));
        setStudentProfile(profileRes.data || null);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#1A3BDB] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (user?.role === 'client') {
    return <ClientDashboard user={user} profile={clientProfile} builds={builds} />;
  }

  return <StudentDashboard user={user} profile={studentProfile} payments={payments} />;
}