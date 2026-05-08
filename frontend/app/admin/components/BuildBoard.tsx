'use client';

import { useEffect, useState } from 'react';
import api from '@/app/lib/api';
import { io } from 'socket.io-client';

const statuses = [
  'pending',
  'reviewed',
  'accepted',
  'in_progress',
  'completed',
];

export default function BuildBoard() {
  const [builds, setBuilds] = useState<any[]>([]);

  // =====================
  // FETCH BUILDS
  // =====================
  const fetchBuilds = async () => {
    const res = await api.get('/admin/builds');
    setBuilds(res.data || []);
  };

  useEffect(() => {
    fetchBuilds();

    // =====================
    // SOCKET REALTIME
    // =====================
    const socket = io('http://localhost:5000');

    socket.on('build_updated', () => {
      fetchBuilds();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // =====================
  // GROUP BY STATUS
  // =====================
  const grouped = (status: string) =>
    builds.filter((b) => b.status === status);

  return (
    <div className="grid grid-cols-5 gap-4 overflow-x-auto">
      {statuses.map((status) => (
        <div key={status} className="bg-white/5 p-3 min-h-[500px]">
          <h2 className="text-white font-bold capitalize mb-3">
            {status}
          </h2>

          {grouped(status).map((build) => (
            <div
              key={build.id}
              className="bg-black border border-white/10 p-3 mb-3"
            >
              <p className="text-white font-medium">{build.name}</p>
              <p className="text-white/40 text-xs">{build.category}</p>
              <p className="text-white/30 text-xs mt-1">
                {build.description}
              </p>
              <p className="text-blue-400 text-xs mt-2">
                {build.progress}%
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}