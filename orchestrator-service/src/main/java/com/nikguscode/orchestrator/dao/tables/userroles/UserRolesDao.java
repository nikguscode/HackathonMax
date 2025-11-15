package com.nikguscode.orchestrator.dao.tables.userroles;

import com.nikguscode.jooq.enums.UserRole;
import java.util.UUID;

public interface UserRolesDao {
  void insertRoleByQueueId(Long maxId, UUID queueId, UserRole userRole);
}