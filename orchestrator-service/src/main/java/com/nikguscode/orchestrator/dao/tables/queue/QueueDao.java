package com.nikguscode.orchestrator.dao.tables.queue;

import com.nikguscode.orchestrator.core.model.Queue;
import com.nikguscode.orchestrator.core.model.QueueParams;
import com.nikguscode.orchestrator.dao.result.QueueMemberRecord;
import com.nikguscode.orchestrator.dao.result.QueueMetricsRecord;
import java.util.List;
import java.util.UUID;

public interface QueueDao {
  void createQueue(Queue queue, QueueParams queueParams);

  List<QueueMetricsRecord> getQueuesWithMetricsByOrganizationId(UUID organizationId);

  List<QueueMemberRecord> findByQueueId(UUID queueId);
}