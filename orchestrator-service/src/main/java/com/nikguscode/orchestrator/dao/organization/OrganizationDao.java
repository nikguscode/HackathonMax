package com.nikguscode.orchestrator.dao.organization;

import com.nikguscode.orchestrator.model.Organization;
import java.util.List;

public interface OrganizationDao {
  List<Organization> findByMaxId(Long maxId);
}