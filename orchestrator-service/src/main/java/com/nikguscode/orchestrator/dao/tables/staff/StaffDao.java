package com.nikguscode.orchestrator.dao.tables.staff;

import com.nikguscode.orchestrator.dao.result.StaffRecord;
import java.util.List;
import java.util.UUID;

public interface StaffDao {
  List<StaffRecord> findByQueueId(UUID queueId);
}