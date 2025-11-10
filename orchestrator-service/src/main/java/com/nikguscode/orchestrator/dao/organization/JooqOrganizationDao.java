package com.nikguscode.orchestrator.dao.organization;

import static com.nikguscode.jooq.tables.Organization.ORGANIZATION;
import static com.nikguscode.jooq.tables.UserRoles.USER_ROLES;

import com.nikguscode.orchestrator.model.Organization;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JooqOrganizationDao implements OrganizationDao {
  private final DSLContext dsl;

  @Override
  public List<Organization> findByMaxId(Long maxId) {
    return dsl
        .select(ORGANIZATION.fields())
        .from(ORGANIZATION)
        .join(USER_ROLES)
        .on(ORGANIZATION.ID.eq(USER_ROLES.ID_ORGANIZATION))
        .where(USER_ROLES.ID_MAX.eq(maxId))
        .fetchInto(Organization.class);
  }
}