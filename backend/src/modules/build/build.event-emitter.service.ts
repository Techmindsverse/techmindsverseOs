import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class BuildEventEmitter {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  emitCreated(build: any) {
    this.eventEmitter.emit('build.created', build);
  }

  emitUpdated(build: any) {
    this.eventEmitter.emit('build.updated', build);
  }

  emitAssigned(build: any) {
    this.eventEmitter.emit('build.assigned', build);
  }
}