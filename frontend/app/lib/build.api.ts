import api from './api';

export const submitBuild = async (data: {
  name: string;
  email: string;
  description: string;
  category: string;
  budget?: string;
  requirements?: string;
  mode?: string;
}) => {
  const res = await api.post('/build', data);
  return res.data;
};

export const getBuilds = async (page = 1, limit = 20) => {
  const res = await api.get(`/admin/builds?page=${page}&limit=${limit}`);
  return res.data;
};

export const getBuild = async (id: string) => {
  const res = await api.get(`/admin/builds/${id}`);
  return res.data;
};
 
export const getBuildMetrics = async () => {
  const res = await api.get('/admin/builds/metrics');
  return res.data;
};

export const getBuildPipeline = async () => {
  const res = await api.get('/admin/builds/pipeline');
  return res.data;
};

export const updateBuildStatus = async (
  id: string,
  status: string,
  admin_note?: string
) => {
  const res = await api.patch(`/admin/builds/${id}/status`, {
    status,
    admin_note,
  });
  return res.data;
};

export const assignBuilder = async (id: string, assigned_to: string) => {
  const res = await api.patch(`/admin/builds/${id}/assign`, {
    assigned_to,
  });
  return res.data;
};

export const updateProgress = async (id: string, progress: number) => {
  const res = await api.patch(`/admin/builds/${id}/progress`, {
    progress,
  });
  return res.data;
};