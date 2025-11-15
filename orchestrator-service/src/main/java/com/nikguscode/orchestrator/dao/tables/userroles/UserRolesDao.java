package com.nikguscode.orchestrator.dao.tables.userroles;

import java.util.UUID;

public interface UserRolesDao {
  void insertRoleByQueueId(Long maxId, UUID queueId);
}