'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/app/lib/api';
import { useAuthStore } from '@/app/lib/store/auth.store';
import {
  LogOut, LayoutDashboard, CreditCard, Users,
  FolderOpen, AlertCircle, MessageSquare, Package,
  Activity, CheckCircle, XCircle, ChevronRight, RefreshCw
} from 'lucide-react';

type Tab = 'overview' | 'payments' | 'students' | 'projects' | 'complaints' | 'contacts' | 'builds' | 'activity';

interface Metrics {
  total_users: number;
  active_students: number;
  pending_payments: number;
  approved_payments: number;
  total_revenue: number;
  active_builds: number;
  completed_builds: number;
  pending_builds: number;
  open_complaints: number;
  total_projects: number;
}

export default function AdminPage() {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [data, setData] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedBuild, setSelectedBuild] = useState<any | null>(null);
  const [buildLogs, setBuildLogs] = useState<any[]>([]);

  const tabs = [
    { key: 'overview', label: 'Overview', icon: LayoutDashboard },
    { key: 'payments', label: 'Payments', icon: CreditCard },
    { key: 'students', label: 'Students', icon: Users },
    { key: 'projects', label: 'Projects', icon: FolderOpen },
    { key: 'complaints', label: 'Complaints', icon: AlertCircle },
    { key: 'contacts', label: 'Contacts', icon: MessageSquare },
    { key: 'builds', label: 'Builds', icon: Package },
    { key: 'activity', label: 'Activity', icon: Activity },
  ];

  const endpointMap: Record<Tab, string> = {
    overview: '/admin/metrics',
    payments: '/admin/payments',
    students: '/admin/students',
    projects: '/admin/projects',
    complaints: '/admin/complaints',
    contacts: '/admin/contacts',
    builds: '/admin/builds',
    activity: '/admin/activity',
  };

  useEffect(() => {
    const token = localStorage.getItem('tmv_token');
    if (!token) { router.push('/login'); return; }
  }, []);

  useEffect(() => {
    fetchTab(activeTab);
  }, [activeTab]);

  const fetchTab = useCallback(async (tab: Tab) => {
    setLoading(true);
    setSelectedBuild(null);
    try {
      const res = await api.get(endpointMap[tab]);
      if (tab === 'overview') {
        setMetrics(res.data);
      } else {
        setData(res.data?.data || res.data || []);
      }
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      await api.patch(`/admin/payments/${id}/approve`, {});
      fetchTab('payments');
    } catch { alert('Failed to approve payment'); }
    finally { setActionLoading(null); }
  };

  const handleReject = async (id: string) => {
    setActionLoading(id);
    try {
      await api.patch(`/admin/payments/${id}/reject`, {});
      fetchTab('payments');
    } catch { alert('Failed to reject payment'); }
    finally { setActionLoading(null); }
  };

  const handleBuildStatusUpdate = async (id: string, status: string) => {
    setActionLoading(id);
    try {
      await api.patch(`/build/${id}/status`, { status });
      fetchTab('builds');
    } catch { alert('Failed to update build status'); }
    finally { setActionLoading(null); }
  };

  const handleProgressUpdate = async (id: string, progress: number) => {
    try {
      await api.patch(`/build/${id}/progress`, { progress });
      fetchTab('builds');
    } catch { alert('Failed to update progress'); }
  };

  const openBuildDetail = async (build: any) => {
    setSelectedBuild(build);
    try {
      const res = await api.get(`/build/${build.id}/logs`);
      setBuildLogs(res.data || []);
    } catch { setBuildLogs([]); }
  };

  const handleLogout = () => { clearAuth(); router.push('/login'); };

  const statusColor = (status: string) => {
    if (!status) return 'text-white/40 border-white/10 bg-transparent';
    if (['approved', 'active', 'completed', 'resolved', 'delivered'].includes(status))
      return 'text-green-400 border-green-400/20 bg-green-400/10';
    if (['rejected', 'failed'].includes(status))
      return 'text-red-400 border-red-400/20 bg-red-400/10';
    if (['in_progress', 'planning', 'testing'].includes(status))
      return 'text-blue-400 border-blue-400/20 bg-blue-400/10';
    if (['reviewing'].includes(status))
      return 'text-purple-400 border-purple-400/20 bg-purple-400/10';
    return 'text-yellow-400 border-yellow-400/20 bg-yellow-400/10';
  };

  return (
    <div className="min-h-screen bg-black text-white flex">

      {/* SIDEBAR */}
      <aside className="
  w-full md:w-56 shrink-0
  border-b md:border-b-0 md:border-r border-white/5
  md:sticky md:top-0 md:h-screen
  flex md:flex-col justify-between
  py-4 md:py-6 px-4
  bg-black z-20
  overflow-x-auto md:overflow-visible
">
        <div>
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 bg-brand-blue rounded-sm flex items-center justify-center">
                <span className="font-bebas text-white text-xs">T</span>
              </div>
              <span className="font-bebas tracking-widest text-sm">TMV ADMIN OS</span>
            </div>
            <p className="text-white/20 text-xs pl-8">{user?.email}</p>
          </div>
          <nav className="flex md:flex-col gap-1 md:space-y-1 overflow-x-auto md:overflow-visible pb-1 md:pb-0">
  {tabs.map(tab => (
    <button
      key={tab.key}
      onClick={() => setActiveTab(tab.key as Tab)}
      className={`flex items-center gap-2 shrink-0 md:w-full px-3 py-2 text-sm transition rounded-sm whitespace-nowrap ${
        activeTab === tab.key
          ? 'bg-brand-blue/10 border border-brand-blue/30 text-white'
          : 'border border-transparent text-white/30 hover:text-white hover:bg-white/5'
      }`}
    >
      <tab.icon size={13} />
      <span className="hidden md:inline">{tab.label}</span>
    </button>
  ))}
</nav>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-white/20 hover:text-white text-sm transition px-3"
        >
          <LogOut size={13} /> Logout
        </button>
      </aside>

      {/* MAIN */}
      <main className="flex-1 overflow-auto">

        {/* TOP BAR */}
        <div className="border-b border-white/5 px-8 py-4 flex items-center justify-between sticky top-0 bg-black z-10">
          <div>
            <h2 className="font-bebas text-2xl tracking-wide">{activeTab.toUpperCase()}</h2>
            <p className="text-white/20 text-xs">TechMindsVerse Control System</p>
          </div>
          <button
            onClick={() => fetchTab(activeTab)}
            className="flex items-center gap-2 text-white/30 hover:text-white text-xs border border-white/10 px-3 py-1.5 transition"
          >
            <RefreshCw size={12} /> Refresh
          </button>
        </div>

        <div className="p-8">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <p className="text-white/20 text-sm">Loading...</p>
            </div>
          ) : (
            <>

              {/* OVERVIEW */}
              {activeTab === 'overview' && metrics && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {[
                      { label: 'Total Users', value: metrics.total_users, color: 'text-white' },
                      { label: 'Active Students', value: metrics.active_students, color: 'text-green-400' },
                      { label: 'Pending Payments', value: metrics.pending_payments, color: 'text-yellow-400' },
                      { label: 'Open Complaints', value: metrics.open_complaints, color: 'text-red-400' },
                      { label: 'Total Projects', value: metrics.total_projects, color: 'text-white' },
                    ].map((stat, i) => (
                      <div key={i} className="border border-white/5 p-5 hover:border-white/10 transition">
                        <p className="text-white/30 text-xs mb-2">{stat.label}</p>
                        <p className={`font-bebas text-4xl ${stat.color}`}>{stat.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Revenue (Approved)', value: `₦${metrics.total_revenue.toLocaleString()}`, color: 'text-green-400' },
                      { label: 'Active Builds', value: metrics.active_builds, color: 'text-brand-blue' },
                      { label: 'Completed Builds', value: metrics.completed_builds, color: 'text-green-400' },
                      { label: 'Pending Builds', value: metrics.pending_builds, color: 'text-yellow-400' },
                    ].map((stat, i) => (
                      <div key={i} className="border border-white/5 p-5 hover:border-white/10 transition">
                        <p className="text-white/30 text-xs mb-2">{stat.label}</p>
                        <p className={`font-bebas text-3xl ${stat.color}`}>{stat.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border border-white/5 p-5">
                      <h3 className="font-bebas text-lg text-white mb-1">APPROVED PAYMENTS</h3>
                      <p className="font-bebas text-4xl text-green-400">{metrics.approved_payments}</p>
                    </div>
                    <div className="border border-white/5 p-5">
                      <h3 className="font-bebas text-lg text-white mb-1">PENDING PAYMENTS</h3>
                      <p className="font-bebas text-4xl text-yellow-400">{metrics.pending_payments}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* PAYMENTS */}
              {activeTab === 'payments' && (
                <div className="space-y-3">
                  {data.length === 0 ? (
                    <p className="text-white/20 text-sm">No payments found.</p>
                  ) : data.map((payment: any) => (
                    <div key={payment.id} className="border border-white/5 p-5 hover:border-white/10 transition">
                      <div className="flex items-start justify-between flex-wrap gap-4">
                        <div>
                          <p className="text-white font-medium">₦{Number(payment.amount).toLocaleString()}</p>
                          <p className="text-white/40 text-sm mt-1">{payment.users?.email || '—'}</p>
                          <p className="text-white/20 text-xs mt-1">Ref: {payment.reference}</p>
                          <p className="text-white/20 text-xs">{new Date(payment.created_at).toLocaleString()}</p>
                          {payment.proof_image_url && (
                            <a href={payment.proof_image_url} target="_blank" className="text-brand-blue text-xs mt-2 inline-block hover:underline">
                              View Proof →
                            </a>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
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
                                <CheckCircle size={11} /> Approve
                              </button>
                              <button
                                onClick={() => handleReject(payment.id)}
                                disabled={actionLoading === payment.id}
                                className="flex items-center gap-1 text-xs bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-1 hover:bg-red-500/20 transition disabled:opacity-50"
                              >
                                <XCircle size={11} /> Reject
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* STUDENTS */}
              {activeTab === 'students' && (
                <div className="space-y-3">
                  {data.length === 0 ? (
                    <p className="text-white/20 text-sm">No students found.</p>
                  ) : data.map((student: any) => (
                    <div key={student.id} className="border border-white/5 p-5 hover:border-white/10 transition">
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                          <p className="text-white font-medium">{student.full_name || 'No name'}</p>
                          <p className="text-white/40 text-sm">{student.users?.email}</p>
                          <p className="text-white/20 text-xs mt-1 capitalize">
                            Track: {student.track || 'Not assigned'} · Score: {student.performance_score ?? '—'}
                          </p>
                        </div>
                        <span className={`text-xs border px-3 py-1 capitalize ${statusColor(student.users?.status)}`}>
                          {student.users?.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* PROJECTS */}
              {activeTab === 'projects' && (
                <div className="space-y-3">
                  {data.length === 0 ? (
                    <p className="text-white/20 text-sm">No projects found.</p>
                  ) : data.map((project: any) => (
                    <div key={project.id} className="border border-white/5 p-5 hover:border-white/10 transition">
                      <div className="flex items-start justify-between flex-wrap gap-4">
                        <div>
                          <p className="text-white font-medium">{project.title}</p>
                          <p className="text-white/40 text-sm mt-1">{project.description}</p>
                          <p className="text-white/20 text-xs mt-2">By: {project.students?.full_name || '—'}</p>
                          {project.file_url && (
                            <a href={project.file_url} target="_blank" className="text-brand-blue text-xs mt-1 inline-block hover:underline">
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
                </div>
              )}

              {/* COMPLAINTS */}
              {activeTab === 'complaints' && (
                <div className="space-y-3">
                  {data.length === 0 ? (
                    <p className="text-white/20 text-sm">No complaints found.</p>
                  ) : data.map((complaint: any) => (
                    <div key={complaint.id} className="border border-white/5 p-5 hover:border-white/10 transition">
                      <div className="flex items-start justify-between flex-wrap gap-4">
                        <div>
                          <p className="text-white font-medium">{complaint.subject}</p>
                          <p className="text-white/40 text-sm mt-1">{complaint.message}</p>
                          <p className="text-white/20 text-xs mt-2">{complaint.users?.email}</p>
                          <p className="text-white/20 text-xs">{new Date(complaint.created_at).toLocaleString()}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`text-xs border px-3 py-1 capitalize ${statusColor(complaint.status)}`}>
                            {complaint.status}
                          </span>
                          {complaint.category && (
                            <span className="text-white/20 text-xs">{complaint.category}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* CONTACTS */}
              {activeTab === 'contacts' && (
                <div className="space-y-3">
                  {data.length === 0 ? (
                    <p className="text-white/20 text-sm">No contacts found.</p>
                  ) : data.map((contact: any) => (
                    <div key={contact.id} className="border border-white/5 p-5 hover:border-white/10 transition">
                      <p className="text-white font-medium">{contact.name}</p>
                      <p className="text-white/40 text-sm">{contact.email}</p>
                      <p className="text-brand-blue text-sm mt-1">{contact.subject}</p>
                      <p className="text-white/40 text-sm mt-2 leading-relaxed">{contact.message}</p>
                      <p className="text-white/20 text-xs mt-2">{new Date(contact.created_at).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* BUILDS */}
              {activeTab === 'builds' && !selectedBuild && (
                <div className="space-y-3">
                  {data.length === 0 ? (
                    <p className="text-white/20 text-sm">No builds found.</p>
                  ) : data.map((build: any) => (
                    <div key={build.id} className="border border-white/5 p-5 hover:border-white/10 transition">
                      <div className="flex items-start justify-between flex-wrap gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 flex-wrap mb-2">
                            <p className="text-white font-medium">{build.name}</p>
                            <span className="text-xs text-brand-blue border border-brand-blue/20 px-2 py-0.5 capitalize">
                              {build.category}
                            </span>
                            {build.mode && (
                              <span className="text-xs text-white/30 border border-white/10 px-2 py-0.5 capitalize">
                                {build.mode}
                              </span>
                            )}
                          </div>
                          <p className="text-white/40 text-sm">{build.email}</p>
                          <p className="text-white/30 text-sm mt-1 line-clamp-2">{build.description}</p>
                          {build.budget && (
                            <p className="text-white/20 text-xs mt-1">Budget: {build.budget}</p>
                          )}
                          {build.progress > 0 && (
                            <div className="mt-3">
                              <div className="flex justify-between text-xs text-white/30 mb-1">
                                <span>Progress</span>
                                <span>{build.progress}%</span>
                              </div>
                              <div className="w-full bg-white/5 h-1">
                                <div
                                  className="h-1 bg-brand-blue transition-all"
                                  style={{ width: `${build.progress}%` }}
                                />
                              </div>
                            </div>
                          )}
                          <p className="text-white/20 text-xs mt-2">
                            {new Date(build.created_at).toLocaleString()}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <span className={`text-xs border px-3 py-1 capitalize ${statusColor(build.status)}`}>
                            {build.status}
                          </span>

                          <div className="flex flex-wrap gap-1 justify-end">
                            {build.status === 'submitted' && (
                              <button
                                onClick={() => handleBuildStatusUpdate(build.id, 'reviewing')}
                                disabled={actionLoading === build.id}
                                className="text-xs border border-white/10 text-white/40 px-2 py-1 hover:border-brand-blue hover:text-brand-blue transition disabled:opacity-50"
                              >
                                Start Review
                              </button>
                            )}
                            {build.status === 'reviewing' && (
                              <>
                                <button
                                  onClick={() => handleBuildStatusUpdate(build.id, 'planning')}
                                  disabled={actionLoading === build.id}
                                  className="text-xs border border-blue-500/30 text-blue-400 px-2 py-1 hover:bg-blue-500/10 transition disabled:opacity-50"
                                >
                                  Move to Planning
                                </button>
                                <button
                                  onClick={() => handleBuildStatusUpdate(build.id, 'rejected')}
                                  disabled={actionLoading === build.id}
                                  className="text-xs border border-red-500/30 text-red-400 px-2 py-1 hover:bg-red-500/10 transition disabled:opacity-50"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {build.status === 'planning' && (
                              <button
                                onClick={() => handleBuildStatusUpdate(build.id, 'in_progress')}
                                disabled={actionLoading === build.id}
                                className="text-xs border border-blue-500/30 text-blue-400 px-2 py-1 hover:bg-blue-500/10 transition disabled:opacity-50"
                              >
                                Start Build
                              </button>
                            )}
                            {build.status === 'in_progress' && (
                              <>
                                <select
                                  onChange={e => handleProgressUpdate(build.id, Number(e.target.value))}
                                  defaultValue={build.progress}
                                  className="text-xs bg-black border border-white/10 text-white/40 px-2 py-1"
                                >
                                  {[0,10,20,30,40,50,60,70,80,90,100].map(v => (
                                    <option key={v} value={v}>{v}%</option>
                                  ))}
                                </select>
                                <button
                                  onClick={() => handleBuildStatusUpdate(build.id, 'testing')}
                                  disabled={actionLoading === build.id}
                                  className="text-xs border border-yellow-500/30 text-yellow-400 px-2 py-1 hover:bg-yellow-500/10 transition disabled:opacity-50"
                                >
                                  Move to Testing
                                </button>
                              </>
                            )}
                            {build.status === 'testing' && (
                              <>
                                <button
                                  onClick={() => handleBuildStatusUpdate(build.id, 'completed')}
                                  disabled={actionLoading === build.id}
                                  className="text-xs border border-green-500/30 text-green-400 px-2 py-1 hover:bg-green-500/10 transition disabled:opacity-50"
                                >
                                  Mark Completed
                                </button>
                                <button
                                  onClick={() => handleBuildStatusUpdate(build.id, 'in_progress')}
                                  disabled={actionLoading === build.id}
                                  className="text-xs border border-white/10 text-white/40 px-2 py-1 hover:border-white/30 transition disabled:opacity-50"
                                >
                                  Back to Build
                                </button>
                              </>
                            )}
                            {build.status === 'completed' && (
                              <button
                                onClick={() => handleBuildStatusUpdate(build.id, 'delivered')}
                                disabled={actionLoading === build.id}
                                className="text-xs border border-green-500/30 text-green-400 px-2 py-1 hover:bg-green-500/10 transition disabled:opacity-50"
                              >
                                Mark Delivered
                              </button>
                            )}
                          </div>

                          <button
                            onClick={() => openBuildDetail(build)}
                            className="flex items-center gap-1 text-xs text-white/20 hover:text-white transition mt-1"
                          >
                            View Logs <ChevronRight size={11} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* BUILD DETAIL */}
              {activeTab === 'builds' && selectedBuild && (
                <div>
                  <button
                    onClick={() => setSelectedBuild(null)}
                    className="flex items-center gap-2 text-white/30 hover:text-white text-sm mb-6 transition"
                  >
                    ← Back to Builds
                  </button>
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="border border-white/5 p-6">
                      <h3 className="font-bebas text-xl text-white mb-4">CLIENT INFO</h3>
                      <div className="space-y-2 text-sm">
                        {[
                          { label: 'Name', value: selectedBuild.name },
                          { label: 'Email', value: selectedBuild.email },
                          { label: 'Category', value: selectedBuild.category },
                          { label: 'Budget', value: selectedBuild.budget || '—' },
                          { label: 'Mode', value: selectedBuild.mode || '—' },
                        ].map((item, i) => (
                          <div key={i} className="flex justify-between">
                            <span className="text-white/30">{item.label}</span>
                            <span className="text-white capitalize">{item.value}</span>
                          </div>
                        ))}
                        <div className="flex justify-between">
                          <span className="text-white/30">Status</span>
                          <span className={`text-xs border px-2 py-0.5 capitalize ${statusColor(selectedBuild.status)}`}>
                            {selectedBuild.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="border border-white/5 p-6">
                      <h3 className="font-bebas text-xl text-white mb-4">PROJECT DETAILS</h3>
                      <p className="text-white/50 text-sm leading-relaxed">{selectedBuild.description}</p>
                      {selectedBuild.requirements && (
                        <>
                          <h4 className="font-bebas text-sm text-white/40 mt-4 mb-2">REQUIREMENTS</h4>
                          <p className="text-white/40 text-sm leading-relaxed">{selectedBuild.requirements}</p>
                        </>
                      )}
                      <div className="mt-4">
                        <div className="flex justify-between text-xs text-white/30 mb-1">
                          <span>Progress</span>
                          <span>{selectedBuild.progress || 0}%</span>
                        </div>
                        <div className="w-full bg-white/5 h-1.5">
                          <div
                            className="h-1.5 bg-brand-blue"
                            style={{ width: `${selectedBuild.progress || 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="border border-white/5 p-6">
                    <h3 className="font-bebas text-xl text-white mb-4">BUILD TIMELINE</h3>
                    {buildLogs.length === 0 ? (
                      <p className="text-white/20 text-sm">No activity logged yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {buildLogs.map((log: any, i: number) => (
                          <div key={log.id} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className="w-2 h-2 rounded-full bg-brand-blue mt-1 shrink-0" />
                              {i < buildLogs.length - 1 && (
                                <div className="w-px flex-1 bg-white/5 mt-1" />
                              )}
                            </div>
                            <div className="pb-4">
                              <p className="text-white text-sm font-medium">{log.action}</p>
                              {log.message && <p className="text-white/40 text-xs mt-0.5">{log.message}</p>}
                              <p className="text-white/20 text-xs mt-1">{new Date(log.created_at).toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ACTIVITY */}
              {activeTab === 'activity' && (
                <div className="space-y-2">
                  {data.length === 0 ? (
                    <p className="text-white/20 text-sm">No activity recorded yet.</p>
                  ) : data.map((activity: any) => (
                    <div key={activity.id} className="border border-white/5 px-5 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-blue shrink-0" />
                        <div>
                          <span className="text-white text-sm">{activity.action}</span>
                          {activity.users?.email && (
                            <span className="text-white/30 text-xs ml-2">— {activity.users.email}</span>
                          )}
                        </div>
                      </div>
                      <span className="text-white/20 text-xs">
                        {new Date(activity.created_at).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}

            </>
          )}
        </div>
      </main>
    </div>
  );
}