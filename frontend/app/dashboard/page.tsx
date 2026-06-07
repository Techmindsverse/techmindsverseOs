'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/app/lib/api';
import { useAuthStore } from '@/app/lib/store/auth.store';
import { useTheme } from '@/app/components/ThemeProvider';
import {
  Home, CreditCard, FolderOpen, AlertCircle,
  LogOut, BookOpen, Package, Bell,
  Activity, Hammer, User, Plus,
  CheckCircle, Clock, XCircle, ArrowRight,
  ChevronRight,
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
  id: string; full_name: string; phone?: string; track?: string;
  performance_score?: number; rank?: number;
  users?: { email: string; status: string; role: string };
}
interface ClientProfile {
  id: string; full_name: string; company?: string; phone?: string;
  users?: { email: string; status: string; role: string };
}
interface Build {
  id: string; name: string; email: string; category: string;
  description: string; status: string; progress: number;
  budget?: string; mode?: string; created_at: string;
}

/* ── Status badge ── */
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    approved:   'status-success',
    active:     'status-success',
    completed:  'status-success',
    delivered:  'status-success',
    pending:    'status-warning',
    submitted:  'status-info',
    reviewing:  'status-info',
    in_progress:'status-info',
    planning:   'status-info',
    testing:    'status-warning',
    rejected:   'status-error',
    failed:     'status-error',
  };
  const cls = map[status] || 'status-warning';
  return (
    <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${cls}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}

/* ── Metric card ── */
function MetricCard({ label, value, color = '' }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="dash-card rounded-xl p-4 sm:p-5">
      <p className="text-secondary text-xs font-medium uppercase tracking-wider mb-2">{label}</p>
      <p className={`text-3xl font-bebas ${color || 'text-primary'}`}>{value}</p>
    </div>
  );
}

/* ── Input class ── */
const inp = 'w-full tmv-input rounded-lg text-sm';

/* ── SIDEBAR (desktop only) ── */
function Sidebar({
  role, activeTab, setActiveTab, profile, user, onLogout, tabs,
}: any) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const accent = isDark ? '#1A3BDB' : '#1A3BDB';

  return (
    <aside className="w-60 shrink-0 dash-sidebar flex flex-col h-screen sticky top-0 hidden lg:flex">
      {/* Brand */}
      <div className={`px-5 py-4 border-b border-surface`}>
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#1A3BDB] rounded-sm flex items-center justify-center">
            <span className="font-bebas text-white text-sm">T</span>
          </div>
          <div>
            <p className="font-bebas tracking-widest text-sm text-primary leading-none">TECHMINDSVERSE</p>
            <p className="text-secondary text-[10px] mt-0.5 uppercase tracking-wider">
              {role === 'client' ? 'Client Portal' : 'Student OS'}
            </p>
          </div>
        </Link>
      </div>

      {/* Profile */}
      <div className="px-4 py-3 border-b border-surface">
        <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
          <div className="w-9 h-9 bg-[#1A3BDB] rounded-lg flex items-center justify-center shrink-0">
            <span className="font-bebas text-white text-base">
              {(profile?.full_name || user?.email || 'U')[0].toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-primary text-sm font-semibold truncate">
              {profile?.full_name || user?.email?.split('@')[0]}
            </p>
            <p className="text-secondary text-xs truncate">{user?.email}</p>
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
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all
                ${active ? 'dash-nav-item active' : 'dash-nav-item'}`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="ml-auto bg-[#1A3BDB] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-4 mt-2 border-t border-surface">
          <p className="text-secondary text-[10px] uppercase tracking-widest px-3 mb-2 font-semibold">
            Quick Access
          </p>
          {role !== 'client' && (
            <Link href="/academy" className="dash-nav-item flex items-center gap-3 px-3 py-2 rounded-lg text-sm">
              <BookOpen size={14} /><span>Academy</span>
            </Link>
          )}
          <Link href="/build" className="dash-nav-item flex items-center gap-3 px-3 py-2 rounded-lg text-sm">
            <Package size={14} /><span>Build Studio</span>
          </Link>
        </div>
      </nav>

      <div className="px-4 py-4 border-t border-surface">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-secondary hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 transition-all"
        >
          <LogOut size={14} /> Sign Out
        </button>
      </div>
    </aside>
  );
}

/* ── MOBILE TAB BAR ── */
function MobileTabBar({ tabs, activeTab, setActiveTab }: any) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const maxVisible = Math.min(tabs.length, 5);
  const visibleTabs = tabs.slice(0, maxVisible);

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 lg:hidden
      ${isDark ? 'bg-black/95 border-t border-white/8' : 'bg-white border-t border-gray-100 shadow-lg'}
      pb-safe`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className={`grid h-16`} style={{ gridTemplateColumns: `repeat(${maxVisible}, 1fr)` }}>
        {visibleTabs.map((tab: any) => {
          const Icon = tab.icon;
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex flex-col items-center justify-center gap-1 transition-colors relative
                ${active
                  ? 'text-[#1A3BDB]'
                  : isDark ? 'text-white/30 hover:text-white/60' : 'text-gray-400 hover:text-gray-600'
                }`}
            >
              {tab.badge && (
                <span className="absolute top-2 right-[calc(50%-12px)] w-4 h-4 bg-[#1A3BDB] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
              <Icon size={18} />
              <span className="text-[10px] font-medium">{tab.label}</span>
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#1A3BDB] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── MOBILE HEADER ── */
function MobileHeader({ title, subtitle, user, profile, onLogout }: any) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`lg:hidden flex items-center justify-between px-4 py-3 border-b sticky top-0 z-40
      ${isDark ? 'bg-black/95 border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}
    >
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 bg-[#1A3BDB] rounded-sm flex items-center justify-center">
          <span className="font-bebas text-white text-sm">T</span>
        </div>
        <div>
          <p className={`font-semibold text-sm leading-none ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</p>
          <p className="text-secondary text-[10px] mt-0.5">{subtitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-[#1A3BDB] rounded-lg flex items-center justify-center">
          <span className="font-bebas text-white text-sm">
            {(profile?.full_name || user?.email || 'U')[0].toUpperCase()}
          </span>
        </div>
      </div>
    </div>
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
  const { theme } = useTheme();

  const approved = payments.filter(p => p.status === 'approved').length;
  const pending  = payments.filter(p => p.status === 'pending').length;

  const tabs = [
    { key: 'overview',  label: 'Home',     icon: Home },
    { key: 'payments',  label: 'Payments', icon: CreditCard, badge: pending || undefined },
    { key: 'projects',  label: 'Projects', icon: FolderOpen },
    { key: 'support',   label: 'Support',  icon: AlertCircle },
  ];

  const onLogout = () => { clearAuth(); router.push('/login'); };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true);
    try { await api.post('/projects/submit', projectForm); setProjectSuccess(true); setProjectForm({ title: '', description: '', file_url: '' }); }
    catch { alert('Failed to submit'); } finally { setSubmitting(false); }
  };

  const handleComplaintSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true);
    try { await api.post('/complaints/create', complaintForm); setComplaintSuccess(true); setComplaintForm({ subject: '', message: '' }); }
    catch { alert('Failed to submit'); } finally { setSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-root flex">
      <Sidebar role="student" activeTab={activeTab} setActiveTab={setActiveTab}
        profile={profile} user={user} onLogout={onLogout} tabs={tabs} />

      <div className="flex-1 min-w-0 flex flex-col">
        <MobileHeader title="Dashboard" subtitle="Student Portal" user={user} profile={profile} onLogout={onLogout} />

        {/* Desktop top bar */}
        <div className="hidden lg:flex items-center justify-between px-8 py-4 bg-surface border-b border-surface sticky top-0 z-10">
          <div>
            <h1 className="text-primary font-semibold text-lg">
              {tabs.find(t => t.key === activeTab)?.label}
            </h1>
            <p className="text-secondary text-xs">TechMindsVerse Student Portal</p>
          </div>
          <Link href="/dashboard/submit-payment"
            className="bg-[#1A3BDB] text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2"
          >
            <Plus size={14} /> Submit Payment
          </Link>
        </div>

        {/* Content — extra bottom padding for mobile tab bar */}
        <main className="flex-1 overflow-x-hidden px-4 sm:px-6 lg:px-8 py-5 sm:py-6 pb-24 lg:pb-8">
          <AnimatePresence mode="wait">

            {/* OVERVIEW */}
            {activeTab === 'overview' && (
              <motion.div key="o" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">

                {/* Welcome banner */}
                <div className="rounded-2xl bg-gradient-to-br from-[#1A3BDB] to-blue-700 p-5 sm:p-6 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <p className="text-blue-200 text-sm mb-1">Welcome back</p>
                  <h2 className="font-bebas text-2xl sm:text-3xl leading-none">
                    {(profile?.full_name || user?.email?.split('@')[0] || 'Student').toUpperCase()}
                  </h2>
                  <p className="text-blue-200 text-xs mt-2">
                    {profile?.users?.status === 'active' ? '✓ Account active' : '⏳ Check email for activation link'}
                  </p>
                </div>

                {/* Activation warning */}
                {profile?.users?.status && profile.users.status !== 'active' && (
                  <div className="status-info rounded-xl p-4 flex items-start gap-3">
                    <Bell size={15} className="shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold">Account Pending Activation</p>
                      <p className="text-xs mt-0.5 opacity-80">Check your email for the activation link sent by admin.</p>
                    </div>
                  </div>
                )}

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <MetricCard label="Total Payments" value={payments.length} />
                  <MetricCard label="Approved" value={approved} color="text-green-600" />
                  <MetricCard label="Pending" value={pending} color="text-yellow-600" />
                  <MetricCard label="Rejected" value={payments.filter(p => p.status === 'rejected').length} color="text-red-500" />
                </div>

                {/* Profile */}
                <div className="dash-card rounded-xl p-5">
                  <h3 className="text-primary font-semibold text-sm flex items-center gap-2 mb-4">
                    <User size={15} className="text-[#1A3BDB]" /> Profile
                  </h3>
                  {profile ? (
                    <div className="space-y-3">
                      {[
                        { l: 'Name', v: profile.full_name },
                        { l: 'Email', v: profile.users?.email || user?.email },
                        { l: 'Track', v: profile.track || 'Not assigned' },
                        { l: 'Status', v: profile.users?.status || 'active', isStatus: true },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between py-2 border-b border-surface last:border-0">
                          <span className="text-secondary text-sm">{item.l}</span>
                          {item.isStatus
                            ? <StatusBadge status={item.v} />
                            : <span className="text-primary text-sm font-medium text-right max-w-[60%] truncate">{item.v}</span>
                          }
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-secondary text-sm">No profile found. Contact support.</p>
                  )}
                </div>

                {/* Ecosystem */}
                <div>
                  <h3 className="text-primary font-semibold text-sm mb-3">Ecosystem Access</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { icon: BookOpen, label: 'Academy', desc: 'Access courses', href: '/academy' },
                      { icon: Package, label: 'Build Studio', desc: 'Submit build', href: '/build' },
                      { icon: FolderOpen, label: 'Projects', desc: 'Submit projects', action: () => setActiveTab('projects') },
                    ].map((m, i) => (
                      <div key={i} onClick={m.action}
                        className="dash-card rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:shadow-md transition-all active:scale-[0.98]"
                      >
                        <div className="w-9 h-9 bg-blue-50 dark:bg-[#1A3BDB]/15 rounded-lg flex items-center justify-center shrink-0">
                          <m.icon size={16} className="text-[#1A3BDB]" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-primary text-sm font-medium">{m.label}</p>
                          <p className="text-secondary text-xs">{m.desc}</p>
                        </div>
                        <ChevronRight size={14} className="text-secondary ml-auto shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mobile: quick action */}
                <div className="lg:hidden">
                  <Link href="/dashboard/submit-payment"
                    className="flex items-center justify-center gap-2 w-full bg-[#1A3BDB] text-white font-semibold py-4 rounded-xl hover:bg-blue-700 transition-all text-sm"
                  >
                    <Plus size={16} /> Submit Payment
                  </Link>
                </div>
              </motion.div>
            )}

            {/* PAYMENTS */}
            {activeTab === 'payments' && (
              <motion.div key="p" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-primary font-semibold text-lg">My Payments</h2>
                  <Link href="/dashboard/submit-payment"
                    className="bg-[#1A3BDB] text-white text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1.5"
                  >
                    <Plus size={12} /> Submit
                  </Link>
                </div>
                {payments.length === 0 ? (
                  <div className="dash-card rounded-xl p-12 text-center">
                    <CreditCard size={32} className="text-secondary mx-auto mb-3 opacity-30" />
                    <p className="text-secondary text-sm mb-4">No payments yet</p>
                    <Link href="/dashboard/submit-payment"
                      className="text-[#1A3BDB] text-sm font-medium hover:underline"
                    >Submit payment →</Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {payments.map(p => (
                      <div key={p.id} className="dash-card rounded-xl p-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 bg-blue-50 dark:bg-[#1A3BDB]/15 rounded-lg flex items-center justify-center shrink-0">
                            <CreditCard size={15} className="text-[#1A3BDB]" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-primary font-semibold text-sm">₦{p.amount.toLocaleString()}</p>
                            <p className="text-secondary text-xs truncate">Ref: {p.reference}</p>
                            <p className="text-secondary text-xs">{new Date(p.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <StatusBadge status={p.status} />
                          {p.proof_image_url && (
                            <a href={p.proof_image_url} target="_blank"
                              className="text-[#1A3BDB] text-xs hover:underline"
                            >Proof</a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* PROJECTS */}
            {activeTab === 'projects' && (
              <motion.div key="pr" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <h2 className="text-primary font-semibold text-lg mb-1">Submit Project</h2>
                <p className="text-secondary text-sm mb-5">Share your project for instructor review.</p>
                {projectSuccess ? (
                  <div className="status-success rounded-xl p-6 text-center">
                    <CheckCircle size={36} className="mx-auto mb-3" />
                    <p className="font-semibold mb-1">Project Submitted!</p>
                    <p className="text-sm opacity-80 mb-4">Your instructor will review it shortly.</p>
                    <button onClick={() => setProjectSuccess(false)} className="text-sm font-medium hover:underline">
                      Submit another →
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleProjectSubmit} className="space-y-4 max-w-2xl">
                    <div>
                      <label className="text-secondary text-xs font-medium block mb-1.5">Project Title *</label>
                      <input type="text" required value={projectForm.title}
                        onChange={e => setProjectForm({ ...projectForm, title: e.target.value })}
                        placeholder="e.g. E-commerce Platform"
                        className={inp} />
                    </div>
                    <div>
                      <label className="text-secondary text-xs font-medium block mb-1.5">Description *</label>
                      <textarea required rows={4} value={projectForm.description}
                        onChange={e => setProjectForm({ ...projectForm, description: e.target.value })}
                        placeholder="Describe your project and technologies used..."
                        className={`${inp} resize-none`} />
                    </div>
                    <div>
                      <label className="text-secondary text-xs font-medium block mb-1.5">Repository / Live URL</label>
                      <input type="url" value={projectForm.file_url}
                        onChange={e => setProjectForm({ ...projectForm, file_url: e.target.value })}
                        placeholder="https://github.com/..."
                        className={inp} />
                    </div>
                    <button type="submit" disabled={submitting}
                      className="w-full sm:w-auto bg-[#1A3BDB] text-white font-semibold px-8 py-3.5 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 text-sm"
                    >
                      {submitting ? 'Submitting...' : 'Submit Project'}
                    </button>
                  </form>
                )}
              </motion.div>
            )}

            {/* SUPPORT */}
            {activeTab === 'support' && (
              <motion.div key="s" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <h2 className="text-primary font-semibold text-lg mb-1">Support</h2>
                <p className="text-secondary text-sm mb-5">We respond within 24 hours.</p>
                {complaintSuccess ? (
                  <div className="status-success rounded-xl p-6 text-center">
                    <CheckCircle size={36} className="mx-auto mb-3" />
                    <p className="font-semibold mb-1">Request Submitted</p>
                    <button onClick={() => setComplaintSuccess(false)} className="text-sm font-medium hover:underline mt-3">
                      Submit another →
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleComplaintSubmit} className="space-y-4 max-w-2xl">
                    <div>
                      <label className="text-secondary text-xs font-medium block mb-1.5">Subject *</label>
                      <input type="text" required value={complaintForm.subject}
                        onChange={e => setComplaintForm({ ...complaintForm, subject: e.target.value })}
                        placeholder="What is this regarding?"
                        className={inp} />
                    </div>
                    <div>
                      <label className="text-secondary text-xs font-medium block mb-1.5">Message *</label>
                      <textarea required rows={5} value={complaintForm.message}
                        onChange={e => setComplaintForm({ ...complaintForm, message: e.target.value })}
                        placeholder="Describe your issue..."
                        className={`${inp} resize-none`} />
                    </div>
                    <button type="submit" disabled={submitting}
                      className="w-full sm:w-auto bg-[#1A3BDB] text-white font-semibold px-8 py-3.5 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 text-sm"
                    >
                      {submitting ? 'Submitting...' : 'Submit Request'}
                    </button>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile tab bar */}
      <MobileTabBar tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
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

  const activeBuilds    = builds.filter(b => ['reviewing', 'planning', 'in_progress', 'testing'].includes(b.status)).length;
  const completedBuilds = builds.filter(b => ['completed', 'delivered'].includes(b.status)).length;

  const tabs = [
    { key: 'overview', label: 'Home',   icon: Home },
    { key: 'builds',   label: 'Builds', icon: Hammer, badge: activeBuilds || undefined },
    { key: 'support',  label: 'Support',icon: AlertCircle },
  ];

  const onLogout = () => { clearAuth(); router.push('/login'); };

  const handleComplaintSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true);
    try { await api.post('/complaints/create', complaintForm); setComplaintSuccess(true); setComplaintForm({ subject: '', message: '' }); }
    catch { alert('Failed to submit'); } finally { setSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-root flex">
      <Sidebar role="client" activeTab={activeTab} setActiveTab={setActiveTab}
        profile={profile} user={user} onLogout={onLogout} tabs={tabs} />

      <div className="flex-1 min-w-0 flex flex-col">
        <MobileHeader title="Client Portal" subtitle="TechMindsVerse" user={user} profile={profile} onLogout={onLogout} />

        <div className="hidden lg:flex items-center justify-between px-8 py-4 bg-surface border-b border-surface sticky top-0 z-10">
          <div>
            <h1 className="text-primary font-semibold text-lg">{tabs.find(t => t.key === activeTab)?.label}</h1>
            <p className="text-secondary text-xs">Client Workspace</p>
          </div>
          <Link href="/build"
            className="bg-[#1A3BDB] text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2"
          >
            <Plus size={14} /> New Build
          </Link>
        </div>

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-5 sm:py-6 pb-24 lg:pb-8 overflow-x-hidden">
          <AnimatePresence mode="wait">

            {activeTab === 'overview' && (
              <motion.div key="o" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
                <div className="rounded-2xl bg-gradient-to-br from-[#1A3BDB] to-blue-700 p-5 sm:p-6 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <p className="text-blue-200 text-sm mb-1">Client Portal</p>
                  <h2 className="font-bebas text-2xl sm:text-3xl leading-none">
                    {(profile?.full_name || user?.email?.split('@')[0] || 'Client').toUpperCase()}
                  </h2>
                  <p className="text-blue-200 text-xs mt-2">
                    {builds.length === 0
                      ? 'No builds yet — submit your first idea'
                      : `${activeBuilds} active · ${completedBuilds} completed`}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <MetricCard label="Total" value={builds.length} />
                  <MetricCard label="Active" value={activeBuilds} color="text-[#1A3BDB]" />
                  <MetricCard label="Done" value={completedBuilds} color="text-green-600" />
                </div>

                {builds.length === 0 ? (
                  <div className="dash-card rounded-xl p-10 text-center">
                    <Hammer size={32} className="text-secondary mx-auto mb-3 opacity-30" />
                    <p className="text-secondary text-sm mb-4">No builds submitted yet</p>
                    <Link href="/build"
                      className="bg-[#1A3BDB] text-white text-sm font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-all inline-flex items-center gap-2"
                    >
                      Submit Build <ArrowRight size={14} />
                    </Link>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-primary font-semibold text-sm">Recent Builds</h3>
                      <button onClick={() => setActiveTab('builds')} className="text-[#1A3BDB] text-xs font-medium hover:underline">
                        View all →
                      </button>
                    </div>
                    <div className="space-y-3">
                      {builds.slice(0, 3).map(b => (
                        <div key={b.id} className="dash-card rounded-xl p-4">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="min-w-0">
                              <p className="text-primary font-medium text-sm truncate">{b.name}</p>
                              <p className="text-secondary text-xs capitalize">{b.category}</p>
                            </div>
                            <StatusBadge status={b.status} />
                          </div>
                          {b.progress > 0 && (
                            <div>
                              <div className="flex justify-between text-xs text-secondary mb-1">
                                <span>Progress</span><span>{b.progress}%</span>
                              </div>
                              <div className="w-full bg-muted h-1.5 rounded-full">
                                <div className="h-1.5 bg-[#1A3BDB] rounded-full" style={{ width: `${b.progress}%` }} />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Link href="/build"
                  className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-surface text-secondary hover:border-[#1A3BDB] hover:text-[#1A3BDB] py-4 rounded-xl transition-all text-sm font-medium"
                >
                  <Plus size={16} /> New Build Request
                </Link>
              </motion.div>
            )}

            {activeTab === 'builds' && (
              <motion.div key="b" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-primary font-semibold text-lg">My Builds</h2>
                  <Link href="/build"
                    className="bg-[#1A3BDB] text-white text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1.5"
                  >
                    <Plus size={12} /> New
                  </Link>
                </div>
                {builds.length === 0 ? (
                  <div className="dash-card rounded-xl p-12 text-center">
                    <Hammer size={32} className="text-secondary mx-auto mb-3 opacity-30" />
                    <p className="text-secondary text-sm mb-4">No builds yet</p>
                    <Link href="/build" className="text-[#1A3BDB] text-sm font-medium hover:underline">Submit first →</Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {builds.map(b => (
                      <div key={b.id} className="dash-card rounded-xl p-5">
                        <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <p className="text-primary font-semibold text-sm">{b.name}</p>
                              <span className="text-xs text-[#1A3BDB] bg-blue-50 dark:bg-[#1A3BDB]/15 px-2 py-0.5 rounded-full capitalize">{b.category}</span>
                            </div>
                            <p className="text-secondary text-sm line-clamp-2">{b.description}</p>
                            {b.budget && <p className="text-secondary text-xs mt-1">Budget: {b.budget}</p>}
                          </div>
                          <StatusBadge status={b.status} />
                        </div>
                        {b.progress > 0 && (
                          <div className="mb-2">
                            <div className="flex justify-between text-xs text-secondary mb-1">
                              <span>Progress</span><span>{b.progress}%</span>
                            </div>
                            <div className="w-full bg-muted h-2 rounded-full">
                              <div className="h-2 bg-[#1A3BDB] rounded-full transition-all" style={{ width: `${b.progress}%` }} />
                            </div>
                          </div>
                        )}
                        <p className="text-secondary text-xs">{new Date(b.created_at).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'support' && (
              <motion.div key="s" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <h2 className="text-primary font-semibold text-lg mb-1">Support</h2>
                <p className="text-secondary text-sm mb-5">Need help with your build? We respond within 24 hours.</p>
                {complaintSuccess ? (
                  <div className="status-success rounded-xl p-6 text-center">
                    <CheckCircle size={36} className="mx-auto mb-3" />
                    <p className="font-semibold mb-1">Request Submitted</p>
                    <button onClick={() => setComplaintSuccess(false)} className="text-sm font-medium hover:underline mt-3">Submit another →</button>
                  </div>
                ) : (
                  <form onSubmit={handleComplaintSubmit} className="space-y-4 max-w-2xl">
                    <div>
                      <label className="text-secondary text-xs font-medium block mb-1.5">Subject *</label>
                      <input type="text" required value={complaintForm.subject}
                        onChange={e => setComplaintForm({ ...complaintForm, subject: e.target.value })}
                        className={inp} />
                    </div>
                    <div>
                      <label className="text-secondary text-xs font-medium block mb-1.5">Message *</label>
                      <textarea required rows={5} value={complaintForm.message}
                        onChange={e => setComplaintForm({ ...complaintForm, message: e.target.value })}
                        className={`${inp} resize-none`} />
                    </div>
                    <button type="submit" disabled={submitting}
                      className="w-full sm:w-auto bg-[#1A3BDB] text-white font-semibold px-8 py-3.5 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 text-sm"
                    >
                      {submitting ? 'Submitting...' : 'Submit Request'}
                    </button>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      <MobileTabBar tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

/* ── MAIN ── */
export default function DashboardPage() {
  const router = useRouter();
  const { user, isHydrated } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [clientProfile, setClientProfile] = useState<ClientProfile | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [builds, setBuilds] = useState<Build[]>([]);

  useEffect(() => {
    if (!isHydrated) return;
    const token = localStorage.getItem('tmv_token');
    if (!token) { router.replace('/login'); return; }
    load();
  }, [isHydrated]);

  const load = async () => {
    try {
      const role = user?.role;
      const [paymentsRes, buildsRes] = await Promise.all([
        api.get('/payments/my').catch(() => ({ data: [] as any[] })),
        api.get('/build/my').catch(() => ({ data: [] as any[] })),
      ]);
      setPayments(paymentsRes.data || []);
      setBuilds(buildsRes.data || []);

      if (role === 'client') {
        const r = await api.get('/clients/me').catch(() => ({ data: null }));
        setClientProfile(r.data);
      } else {
        const r = await api.get('/students/me').catch(() => ({ data: null }));
        setStudentProfile(r.data);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isHydrated || loading) {
    return (
      <div className="min-h-screen bg-root flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#1A3BDB] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-secondary text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (user?.role === 'client') return <ClientDashboard user={user} profile={clientProfile} builds={builds} />;
  return <StudentDashboard user={user} profile={studentProfile} payments={payments} />;
}