import { create } from 'zustand';
import {
  getBuilds,
  getBuild,
  updateBuildStatus,
  assignBuilder,
  updateProgress,
  getBuildMetrics,
  getBuildPipeline,
} from '../build.api';

interface BuildStore {
  builds: any[];
  selectedBuild: any;
  metrics: any;
  pipeline: any;
  loading: boolean;

  fetchBuilds: () => Promise<void>;
  fetchBuild: (id: string) => Promise<void>;
  changeStatus: (id: string, status: string, note?: string) => Promise<void>;
  assign: (id: string, userId: string) => Promise<void>;
  updateProgress: (id: string, progress: number) => Promise<void>;
  fetchMetrics: () => Promise<void>;
  fetchPipeline: () => Promise<void>;
}

export const useBuildStore = create<BuildStore>((set) => ({
  builds: [],
  selectedBuild: null,
  metrics: null,
  pipeline: null,
  loading: false,

  fetchBuilds: async () => {
    set({ loading: true });
    const res = await getBuilds();
    set({ builds: res.data, loading: false });
  },

  fetchBuild: async (id) => {
    const res = await getBuild(id);
    set({ selectedBuild: res });
  },

  changeStatus: async (id, status, note) => {
    await updateBuildStatus(id, status, note);
  },

  assign: async (id, userId) => {
    await assignBuilder(id, userId);
  },

  updateProgress: async (id, progress) => {
    await updateProgress(id, progress);
  },

  fetchMetrics: async () => {
    const res = await getBuildMetrics();
    set({ metrics: res });
  },

  fetchPipeline: async () => {
    const res = await getBuildPipeline();
    set({ pipeline: res });
  },
}));