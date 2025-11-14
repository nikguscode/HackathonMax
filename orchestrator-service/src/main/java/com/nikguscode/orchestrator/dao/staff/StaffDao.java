package com.nikguscode.orchestrator.dao.staff;

import com.nikguscode.orchestrator.dao.result.StaffRecord;
import java.util.List;
import java.util.UUID;

public interface StaffDao {
  List<StaffRecord> findByQueueId(UUID queueId);
}