import type { IOrganization, IQueue } from './types.ts';

export const moderatorOrgs: IOrganization[] = [
  { id: 'org1', name: 'Название организации 1', count: 3 },
  { id: 'org2', name: 'Название организации 2', count: 1 },
];

export const userQueues: IQueue[] = [
  { id: 'q1', name: 'Название очереди (польз)', count: 5 },
  { id: 'q2', name: 'Название очереди (польз)', count: 1 },
];