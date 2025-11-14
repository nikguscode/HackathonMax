package com.nikguscode.orchestrator.dao.tables.organization;

import com.nikguscode.orchestrator.core.model.Organization;
import com.nikguscode.orchestrator.dao.result.OrganizationRecord;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface OrganizationDao {
  Optional<Organization> findByOrganizationId(UUID organizationId);

  List<OrganizationRecord> findByMaxId(Long maxId);
}