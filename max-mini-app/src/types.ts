export interface IOrganization {
  id: string;
  name: string;
  count: number;
}

export interface IQueue {
  id: string;
  name: string;
  count: number;
}

export interface IQueueUser {
  id: string;
  name: string;
}

export interface IModeratorQueue {
  id: string;
  name: string;
  employeeCount: number;
  currentQueue: number;
  totalServed: number;
}

export interface IModeratorOrganization {
  id: string;
  name: string;
  queues: IModeratorQueue[];
}