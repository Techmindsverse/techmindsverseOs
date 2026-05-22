'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/app/lib/api';
import { useAuthStore } from '@/app/lib/store/auth.store';
import {
  LogOut,
  User,
  CreditCard,
  FolderOpen,
  AlertCircle,
  Home,
 BookOpen,
  Package,
  Bell,
  Activity,
} from 'lucide-react';

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

type Tab = 'overview' | 'payments' | 'projects' | 'complaints';

const tabs = [
  { key: 'overview', label: 'Overview', icon: Home },
  { key: 'payments', label: 'Payments', icon: CreditCard },
  { key: 'projects', label: 'Projects', icon: FolderOpen },
  { key: 'complaints', label: 'Support', icon: AlertCircle },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();

  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    file_url: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [complaintForm, setComplaintForm] = useState({
    subject: '',
    message: '',
  });

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
        api.get('/students/me').catch(() => ({ data: null })),
        api.get('/payments/my').catch(() => ({ data: [] })),
      ]);

      setProfile(profileRes.data);
      setPayments(paymentsRes.data || []);
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

      setProjectForm({
        title: '',
        description: '',
        file_url: '',
      });
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

      setComplaintForm({
        subject: '',
        message: '',
      });
    } catch {
      alert('Failed to submit complaint');
    } finally {
      setSubmitting(false);
    }
  };

  const statusColor = (status: string) => {
    if (status === 'approved') {
      return 'text-green-400 border-green-400/20 bg-green-400/10';
    }

    if (status === 'rejected') {
      return 'text-red-400 border-red-400/20 bg-red-400/10';
    }

    return 'text-yellow-400 border-yellow-400/20 bg-yellow-400/10';
  };

  const approvedPayments = payments.filter(
    (p) => p.status === 'approved',
  ).length;

  const pendingPayments = payments.filter(
    (p) => p.status === 'pending',
  ).length;

  const isActive =
    profile?.users?.status === 'active' ||
    profile?.users?.status === undefined;

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />

          <p className="text-white/30 text-sm">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col lg:flex-row overflow-x-hidden">

      {/* SIDEBAR */}
      <aside
        className="
        w-full lg:w-60
        border-b lg:border-b-0 lg:border-r border-white/5
        flex flex-col justify-between
        py-6 px-4
        lg:sticky top-0
        lg:h-screen
        shrink-0
        bg-black
        z-20
      "
      >
        <div>
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-7 h-7 bg-brand-blue rounded-sm flex items-center justify-center shrink-0">
              <span className="font-bebas text-white text-sm">T</span>
            </div>

            <span className="font-bebas tracking-widest text-sm text-white">
              TECHMINDSVERSE
            </span>
          </Link>

          {/* PROFILE */}
          <div className="border border-white/5 p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-brand-blue/20 border border-brand-blue/30 rounded-sm flex items-center justify-center shrink-0">
                <User size={14} className="text-brand-blue" />
              </div>

              <div className="min-w-0">
                <p className="text-white text-sm font-medium truncate">
                  {profile?.full_name ||
                    user?.email?.split('@')[0] ||
                    'User'}
                </p>

                <p className="text-white/30 text-xs truncate">
                  {user?.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="text-xs border border-brand-blue/30 text-brand-blue px-2 py-0.5 capitalize">
                {user?.role || 'student'}
              </span>

              <span
                className={`text-xs border px-2 py-0.5 capitalize ${
                  profile?.users?.status === 'active'
                    ? 'text-green-400 border-green-400/20'
                    : 'text-yellow-400 border-yellow-400/20'
                }`}
              >
                {profile?.users?.status || 'active'}
              </span>
            </div>
          </div>

          {/* NAV */}
          <nav className="space-y-1 overflow-x-auto lg:overflow-visible flex lg:block gap-2 lg:gap-0 pb-2 lg:pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as Tab)}
                className={`flex items-center gap-2 whitespace-nowrap lg:w-full px-3 py-2.5 text-sm transition rounded-sm ${
                  activeTab === tab.key
                    ? 'bg-brand-blue/10 border border-brand-blue/30 text-white'
                    : 'border border-transparent text-white/30 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </nav>

          {/* QUICK ACTIONS */}
          <div className="mt-6 space-y-1 hidden lg:block">
            <p className="text-white/20 text-xs uppercase tracking-widest px-3 mb-2">
              Quick Actions
            </p>

            <Link
              href="/dashboard/submit-payment"
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-white/30 hover:text-white hover:bg-white/5 transition rounded-sm border border-transparent"
            >
              <CreditCard size={13} />
              Submit Payment
            </Link>

            <Link
              href="/academy"
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-white/30 hover:text-white hover:bg-white/5 transition rounded-sm border border-transparent"
            >
              <BookOpen size={13} />
              Academy
            </Link>

            <Link
              href="/build"
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-white/30 hover:text-white hover:bg-white/5 transition rounded-sm border border-transparent"
            >
              <Package size={13} />
              Build Studio
            </Link>
          </div>
        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-white/20 hover:text-white text-sm transition px-3 mt-6 lg:mt-0"
        >
          <LogOut size={13} />
          Sign Out
        </button>
      </aside>

      {/* MAIN */}
      <main className="flex-1 overflow-x-hidden">

        {/* TOPBAR */}
        <div className="border-b border-white/5 px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 bg-black z-10">
          <div>
            <h2 className="font-bebas text-2xl tracking-wide">
              {tabs.find((t) => t.key === activeTab)?.label.toUpperCase()}
            </h2>

            <p className="text-white/20 text-xs">
              TechMindsVerse OS
            </p>
          </div>

          <span className="text-white/20 text-xs hidden md:block">
            Welcome back,{' '}
            {profile?.full_name?.split(' ')[0] ||
              user?.email?.split('@')[0] ||
              'there'}
          </span>
        </div>

        {/* CONTENT */}
        <div className="p-4 md:p-8">

          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">

              {profile?.users?.status &&
                profile.users.status !== 'active' && (
                  <div className="border border-yellow-500/30 bg-yellow-500/5 p-4 flex items-start gap-3">
                    <Bell
                      size={16}
                      className="text-yellow-400 shrink-0 mt-0.5"
                    />

                    <div>
                      <p className="text-yellow-400 text-sm font-medium">
                        Account Pending Activation
                      </p>

                      <p className="text-white/40 text-xs mt-1">
                        Check your email for the activation link,
                        or contact support.
                      </p>
                    </div>
                  </div>
                )}

              {/* STATS */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    label: 'Total Payments',
                    value: payments.length,
                    color: 'text-white',
                  },
                  {
                    label: 'Approved',
                    value: approvedPayments,
                    color: 'text-green-400',
                  },
                  {
                    label: 'Pending',
                    value: pendingPayments,
                    color: 'text-yellow-400',
                  },
                  {
                    label: 'Rejected',
                    value: payments.filter(
                      (p) => p.status === 'rejected',
                    ).length,
                    color: 'text-red-400',
                  },
                ].map((stat, i) => (
                  <div key={i} className="border border-white/5 p-5">
                    <p className="text-white/30 text-xs mb-2">
                      {stat.label}
                    </p>

                    <p className={`font-bebas text-4xl ${stat.color}`}>
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* PROFILE */}
              <div className="border border-white/5 p-6">
                <h3 className="font-bebas text-xl text-white mb-4 flex items-center gap-2">
                  <User
                    size={16}
                    className="text-brand-blue"
                  />
                  MY PROFILE
                </h3>

                {profile ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    {[
                      {
                        label: 'Full Name',
                        value: profile.full_name || '—',
                      },
                      {
                        label: 'Email',
                        value:
                          profile.users?.email ||
                          user?.email ||
                          '—',
                      },
                      {
                        label: 'Track',
                        value:
                          profile.track || 'Not assigned',
                      },
                      {
                        label: 'Account Status',
                        value:
                          profile.users?.status ||
                          'active',
                      },
                      {
                        label: 'Performance Score',
                        value:
                          profile.performance_score?.toString() ||
                          'Not scored yet',
                      },
                      {
                        label: 'Rank',
                        value:
                          profile.rank?.toString() ||
                          'Unranked',
                      },
                    ].map((item, i) => (
                      <div key={i}>
                        <p className="text-white/30 mb-1">
                          {item.label}
                        </p>

                        <p className="text-white capitalize">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-white/30 text-sm mb-2">
                      No student profile found.
                    </p>

                    <p className="text-white/20 text-xs">
                      Contact support if you enrolled and don't
                      see your profile.
                    </p>
                  </div>
                )}
              </div>

              {/* MODULES */}
              <div>
                <h3 className="font-bebas text-xl text-white mb-4">
                  ECOSYSTEM MODULES
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      icon: BookOpen,
                      label: 'Academy',
                      desc: 'Access your courses and learning materials',
                      href: '/academy',
                    },
                    {
                      icon: Package,
                      label: 'Build Studio',
                      desc: 'Submit and track your build requests',
                      href: '/build',
                    },
                    {
                      icon: Activity,
                      label: 'Projects',
                      desc: 'Submit and manage your projects',
                      action: () => setActiveTab('projects'),
                    },
                  ].map((module, i) => (
                    <div
                      key={i}
                      onClick={module.action}
                      className="border border-white/5 p-5 hover:border-brand-blue/30 cursor-pointer transition-colors"
                    >
                      <module.icon
                        size={20}
                        className="text-brand-blue mb-3"
                      />

                      <p className="text-white font-medium text-sm">
                        {module.label}
                      </p>

                      <p className="text-white/30 text-xs mt-1 leading-relaxed">
                        {module.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PAYMENTS */}
          {activeTab === 'payments' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="font-bebas text-2xl text-white">
                  MY PAYMENTS
                </h2>

                <Link
                  href="/dashboard/submit-payment"
                  className="bg-brand-blue text-white text-sm px-4 py-2 hover:bg-blue-600 transition w-full sm:w-auto text-center"
                >
                  + Submit Payment
                </Link>
              </div>

              {payments.length === 0 ? (
                <div className="border border-white/5 p-12 text-center">
                  <CreditCard
                    size={32}
                    className="text-white/10 mx-auto mb-4"
                  />

                  <p className="text-white/30 mb-4">
                    No payments submitted yet.
                  </p>

                  <Link
                    href="/dashboard/submit-payment"
                    className="text-brand-blue text-sm hover:underline"
                  >
                    Submit your first payment →
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="border border-white/5 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:border-white/10 transition"
                    >
                      <div>
                        <p className="text-white font-medium">
                          ₦{payment.amount.toLocaleString()}
                        </p>

                        <p className="text-white/30 text-xs mt-1">
                          Ref: {payment.reference}
                        </p>

                        <p className="text-white/20 text-xs">
                          {new Date(
                            payment.created_at,
                          ).toLocaleDateString()}
                        </p>

                        {payment.proof_image_url && (
                          <a
                            href={payment.proof_image_url}
                            target="_blank"
                            className="text-brand-blue text-xs mt-1 inline-block hover:underline"
                          >
                            View Proof →
                          </a>
                        )}
                      </div>

                      <span
                        className={`text-xs border px-3 py-1 capitalize w-fit ${statusColor(
                          payment.status,
                        )}`}
                      >
                        {payment.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}