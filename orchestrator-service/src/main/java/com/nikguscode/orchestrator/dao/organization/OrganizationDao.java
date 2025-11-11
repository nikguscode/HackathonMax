package com.nikguscode.orchestrator.dao.organization;

import com.nikguscode.orchestrator.dao.result.OrganizationRecord;
import java.util.List;

public interface OrganizationDao {
  List<OrganizationRecord> findByMaxId(Long maxId);
}