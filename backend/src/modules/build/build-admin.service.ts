import { Injectable } from '@nestjs/common';
import { BuildService } from './build.service';

@Injectable()
export class BuildAdminService {
  constructor(private readonly buildService: BuildService) {}

  async getMetrics() {
    const builds = await this.buildService.findAll();

    return {
      total_builds: builds.length,
      pending: builds.filter(b => b.status === 'pending').length,
      reviewed: builds.filter(b => b.status === 'reviewed').length,
      accepted: builds.filter(b => b.status === 'accepted').length,
      in_progress: builds.filter(b => b.status === 'in_progress').length,
      completed: builds.filter(b => b.status === 'completed').length,
      rejected: builds.filter(b => b.status === 'rejected').length,
    };
  }

  async getPipeline() {
    const builds = await this.buildService.findAll();

    return {
      pending: builds.filter(b => b.status === 'pending'),
      reviewed: builds.filter(b => b.status === 'reviewed'),
      accepted: builds.filter(b => b.status === 'accepted'),
      in_progress: builds.filter(b => b.status === 'in_progress'),
      completed: builds.filter(b => b.status === 'completed'),
      rejected: builds.filter(b => b.status === 'rejected'),
    };
  }
}