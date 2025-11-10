package com.nikguscode.orchestrator.dao.queueentry;

import com.nikguscode.orchestrator.model.QueueEntry;
import java.util.List;
import java.util.UUID;

public interface QueueEntryDao {
  List<QueueEntry> findByMaxId(Long maxId);

  void delete(UUID entryId);
}