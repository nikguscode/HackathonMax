package com.nikguscode.orchestrator.dao.queue;

import com.nikguscode.orchestrator.model.Queue;
import java.util.List;
import java.util.UUID;

public interface QueueDao {
  List<Queue> findByOrganizationId(UUID organizationId);
}