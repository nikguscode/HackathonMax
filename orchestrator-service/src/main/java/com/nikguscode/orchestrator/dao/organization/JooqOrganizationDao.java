package com.nikguscode.orchestrator.dao.organization;

import static com.nikguscode.jooq.Tables.QUEUE;
import static com.nikguscode.jooq.Tables.QUEUE_STAFF;
import static com.nikguscode.jooq.enums.UserRole.MODERATOR;
import static com.nikguscode.jooq.enums.UserRole.EMPLOYEE;
import static com.nikguscode.jooq.tables.Organization.ORGANIZATION;
import static com.nikguscode.jooq.tables.UserRoles.USER_ROLES;

import com.nikguscode.openapi.model.UserRoleDto;
import com.nikguscode.orchestrator.dao.result.OrganizationRecord;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.impl.DSL;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JooqOrganizationDao implements OrganizationDao {
  private final DSLContext dsl;



  @Override
  public List<OrganizationRecord> findByMaxId(Long maxId) {
    var roleField = USER_ROLES.ROLE;

    var moderatorCount = DSL.selectCount()
        .from(QUEUE)
        .where(ORGANIZATION.ID.eq(QUEUE.ID_ORGANIZATION));

    var employeeCount = DSL.selectCount()
        .from(QUEUE)
        .join(QUEUE_STAFF).on(QUEUE_STAFF.ID_QUEUE.eq(QUEUE.ID))
        .where(
            QUEUE.ID_ORGANIZATION.eq(ORGANIZATION.ID)
                .and(QUEUE_STAFF.ID_MAX.eq(USER_ROLES.ID_MAX))
        );

    var countField = DSL.when(roleField.eq(MODERATOR), moderatorCount.asField())
        .when(roleField.eq(EMPLOYEE), employeeCount.asField())
        .else_(0)
        .as("amountOfQueues");

    return dsl
        .select(
            ORGANIZATION.ID,
            ORGANIZATION.NAME,
            roleField,
            countField
        )
        .from(ORGANIZATION)
        .join(USER_ROLES).on(USER_ROLES.ID_ORGANIZATION.eq(ORGANIZATION.ID))

        .where(
            USER_ROLES.ID_MAX.eq(maxId)
                .and(roleField.in(EMPLOYEE, MODERATOR))
        )

        .fetch(record -> new OrganizationRecord(
            record.get(ORGANIZATION.ID),
            record.get(ORGANIZATION.NAME),
            UserRoleDto.fromValue(record.get(roleField).toString()),
            record.get(countField, Integer.class)
        ));
  }
}