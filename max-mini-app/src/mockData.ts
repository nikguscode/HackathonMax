import type { IOrganization, IQueue, IModeratorOrganization } from './types.ts';

export const moderatorOrgs: IOrganization[] = [
  { id: 'org1', name: 'Название организации 1', count: 3 },
  { id: 'org2', name: 'Название организации 2', count: 1 },
];

export const userQueues: IQueue[] = [
  { id: 'q1', name: 'Название очереди (польз)', count: 5 },
  { id: 'q2', name: 'Название очереди (польз)', count: 1 },
];

export const moderatorQueue: IQueue = {
  id: 'moderator',
  name: 'Управление очередью',
  count: 8,
};

export const moderatorOrganizations: IModeratorOrganization[] = [
  {
    id: 'mod-org1',
    name: 'Модератор',
    queues: [
      {
        id: 'mod-q1',
        name: 'Название очереди',
        employeeCount: 5,
        currentQueue: 12,
        totalServed: 156,
      },
      {
        id: 'mod-q2',
        name: 'Название очереди',
        employeeCount: 3,
        currentQueue: 8,
        totalServed: 89,
      },
    ],
  },
];