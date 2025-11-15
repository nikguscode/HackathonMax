package com.nikguscode.orchestrator.dao.tables.staff;

import com.nikguscode.orchestrator.dao.result.StaffRecord;
import java.util.List;
import java.util.UUID;

public interface StaffDao {
//  void addByQueueId(Long maxId, UUID queueId);

  List<StaffRecord> findByQueueId(UUID queueId);
}