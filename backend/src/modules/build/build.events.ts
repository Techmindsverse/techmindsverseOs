export class BuildCreatedEvent {
  constructor(public readonly build: any) {}
}

export class BuildUpdatedEvent {
  constructor(public readonly build: any) {}
}

export class BuildAssignedEvent {
  constructor(public readonly build: any) {}
}