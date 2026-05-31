export type UserRole =
  | 'super_admin'
  | 'admin'
  | 'instructor'
  | 'student'
  | 'builder'
  | 'client'
  | 'member';

export type ModuleName =
  | 'academy'
  | 'build_studio'
  | 'community'
  | 'admin_panel'
  | 'marketplace'
  | 'hiring'
  | 'ai_tools';
  
// What each role can see in dashboard navigation
export const ROLE_NAV_ITEMS: Record<string, { key: string; label: string; href: string; icon: string }[]> = {
  student: [
    { key: 'overview', label: 'Overview', href: '/dashboard', icon: 'Home' },
    { key: 'academy', label: 'Academy', href: '/academy', icon: 'BookOpen' },
    { key: 'payments', label: 'Payments', href: '/dashboard/payments', icon: 'CreditCard' },
    { key: 'projects', label: 'Projects', href: '/dashboard/projects', icon: 'FolderOpen' },
    { key: 'support', label: 'Support', href: '/dashboard/support', icon: 'AlertCircle' },
  ],
  client: [
    { key: 'overview', label: 'Overview', href: '/dashboard', icon: 'Home' },
    { key: 'builds', label: 'My Builds', href: '/dashboard/builds', icon: 'Hammer' },
    { key: 'support', label: 'Support', href: '/dashboard/support', icon: 'AlertCircle' },
  ],
  builder: [
    { key: 'overview', label: 'Overview', href: '/dashboard', icon: 'Home' },
    { key: 'assigned', label: 'Assigned Work', href: '/dashboard/assigned', icon: 'Layers' },
    { key: 'builds', label: 'Builds', href: '/dashboard/builds', icon: 'Hammer' },
    { key: 'support', label: 'Support', href: '/dashboard/support', icon: 'AlertCircle' },
  ],
  instructor: [
    { key: 'overview', label: 'Overview', href: '/dashboard', icon: 'Home' },
    { key: 'students', label: 'My Students', href: '/dashboard/students', icon: 'Users' },
    { key: 'assignments', label: 'Assignments', href: '/dashboard/assignments', icon: 'FileText' },
    { key: 'academy', label: 'Academy', href: '/academy', icon: 'BookOpen' },
  ],
  admin: [
    { key: 'overview', label: 'Overview', href: '/admin', icon: 'LayoutDashboard' },
    { key: 'payments', label: 'Payments', href: '/admin', icon: 'CreditCard' },
    { key: 'students', label: 'Students', href: '/admin', icon: 'Users' },
    { key: 'builds', label: 'Builds', href: '/admin', icon: 'Package' },
    { key: 'announcements', label: 'Announcements', href: '/admin', icon: 'Bell' },
  ],
  super_admin: [
    { key: 'overview', label: 'Overview', href: '/admin', icon: 'LayoutDashboard' },
    { key: 'users', label: 'All Users', href: '/admin', icon: 'Users' },
    { key: 'roles', label: 'Role Management', href: '/admin/roles', icon: 'Shield' },
    { key: 'analytics', label: 'Analytics', href: '/admin/analytics', icon: 'BarChart2' },
    { key: 'platform', label: 'Platform Settings', href: '/admin/settings', icon: 'Settings' },
  ],
};

// Module → route map (which routes require which module)
export const MODULE_ROUTES: Record<ModuleName, string[]> = {
  academy: ['/academy', '/dashboard/projects', '/dashboard/assignments'],
  build_studio: ['/build', '/dashboard/builds', '/dashboard/assigned'],
  community: ['/community'],
  admin_panel: ['/admin'],
  marketplace: ['/marketplace'],
  hiring: ['/hiring'],
  ai_tools: ['/dashboard/ai'],
};

// Permission check functions
export function hasRole(userRoles: UserRole[], required: UserRole[]): boolean {
  if (userRoles.includes('super_admin') || userRoles.includes('admin')) return true;
  return required.some(r => userRoles.includes(r));
}

export function hasModule(userModules: ModuleName[], required: ModuleName): boolean {
  return userModules.includes(required);
}

export function canAccessRoute(
  userRoles: UserRole[],
  userModules: ModuleName[],
  route: string,
): boolean {
  // Admin always can
  if (userRoles.includes('admin') || userRoles.includes('super_admin')) return true;

  // Check if route requires a specific module
  for (const [module, routes] of Object.entries(MODULE_ROUTES)) {
    if (routes.some(r => route.startsWith(r))) {
      return userModules.includes(module as ModuleName);
    }
  }

  return true; // default allow
}

export function getDashboardRoute(primaryRole: UserRole): string {
  const routes: Record<UserRole, string> = {
    super_admin: '/admin',
    admin: '/admin',
    instructor: '/dashboard',
    student: '/dashboard',
    builder: '/dashboard',
    client: '/dashboard',
    member: '/dashboard',
  };
  return routes[primaryRole] || '/dashboard';
}