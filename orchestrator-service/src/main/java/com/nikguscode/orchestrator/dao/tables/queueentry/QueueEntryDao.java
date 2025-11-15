package com.nikguscode.orchestrator.dao.tables.queueentry;

import com.nikguscode.jooq.enums.QueueEntryStatus;
import com.nikguscode.orchestrator.core.model.QueueEntry;
import com.nikguscode.orchestrator.core.model.QueueEntryMeta;
import com.nikguscode.orchestrator.dao.result.QueueEntryActiveRecord;
import com.nikguscode.orchestrator.dao.result.QueueEntryRecord;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface QueueEntryDao {
  void create(QueueEntry queueEntry, QueueEntryMeta queueEntryMeta);

  void updateByEntryId(UUID queueEntryId, QueueEntryStatus status);

  void delete(UUID entryId);

  List<QueueEntryActiveRecord> findActiveByMaxId(Long maxId);

  List<QueueEntryActiveRecord> findActiveEntriesForQueue(UUID entryId);

  Optional<QueueEntryRecord> findByEntryId(UUID entryId);
}