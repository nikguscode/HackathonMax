package com.nikguscode.orchestrator.dao.queue;

import com.nikguscode.orchestrator.dao.result.QueueMemberRecord;
import com.nikguscode.orchestrator.core.model.Queue;
import java.util.List;
import java.util.UUID;

public interface QueueDao {
  List<Queue> findByOrganizationId(UUID organizationId);

  List<QueueMemberRecord> findByQueueId(UUID queueId);
}