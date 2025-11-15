package com.nikguscode.orchestrator.dao.tables.userroles;

import static com.nikguscode.jooq.tables.Queue.QUEUE;
import static com.nikguscode.jooq.tables.UserRoles.USER_ROLES;

import com.nikguscode.jooq.enums.UserRole;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JooqUserRolesDao implements UserRolesDao {
  private final DSLContext dsl;

  @Override
  public void insertRoleByQueueId(Long maxId, UUID queueId) {
    var organizationIdOpt = dsl
        .select(QUEUE.ID_ORGANIZATION)
        .from(QUEUE)
        .where(QUEUE.ID.eq(queueId))
        .fetchOptional(QUEUE.ID_ORGANIZATION);

    if (organizationIdOpt.isEmpty()) {
      throw new RuntimeException("Organization id not found");
    }

    UUID organizationId = organizationIdOpt.get();

    dsl
        .insertInto(USER_ROLES)
        .set(USER_ROLES.ID, UUID.randomUUID())
        .set(USER_ROLES.ID_MAX, maxId)
        .set(USER_ROLES.ID_ORGANIZATION, organizationId)
        .set(USER_ROLES.ROLE, UserRole.CLIENT)
        .execute();
  }
}