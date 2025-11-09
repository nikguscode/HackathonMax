package com.nikguscode.orchestrator.dao.queueentry;

import java.util.UUID;

public interface QueueEntryDao {
  void delete(UUID entryId);
}