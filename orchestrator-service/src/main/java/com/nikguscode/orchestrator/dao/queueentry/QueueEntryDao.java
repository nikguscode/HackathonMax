package com.nikguscode.orchestrator.dao.queueentry;

import com.nikguscode.orchestrator.dao.result.QueueEntryActiveRecord;
import com.nikguscode.orchestrator.dao.result.QueueEntryRecord;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface QueueEntryDao {
  List<QueueEntryActiveRecord> findActiveByMaxId(Long maxId);

  Optional<QueueEntryRecord> findByEntryId(UUID entryId);

  void delete(UUID entryId);
}