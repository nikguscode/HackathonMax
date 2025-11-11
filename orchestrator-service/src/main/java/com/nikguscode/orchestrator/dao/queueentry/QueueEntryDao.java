package com.nikguscode.orchestrator.dao.queueentry;

import com.nikguscode.orchestrator.dao.result.QueueEntryActiveRecord;
import java.util.List;
import java.util.UUID;

public interface QueueEntryDao {
  List<QueueEntryActiveRecord> findActiveByMaxId(Long maxId);

  QueueEntryActiveRecord findByEntryId(UUID entryId);

  void delete(UUID entryId);
}