package com.nikguscode.orchestrator.dao.queueentry;

import static com.nikguscode.jooq.tables.QueueEntry.QUEUE_ENTRY;

import com.nikguscode.orchestrator.model.QueueEntry;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JooqQueueEntryDao implements QueueEntryDao {
  private final DSLContext dsl;

  @Override
  public List<QueueEntry> findByMaxId(Long maxId) {
    return dsl
        .select(QUEUE_ENTRY.fields())
        .from(QUEUE_ENTRY)
        .where(QUEUE_ENTRY.ID_MAX.eq(maxId))
        .fetchInto(QueueEntry.class);
  }

  @Override
  public void delete(UUID entryId) {
    dsl.deleteFrom(QUEUE_ENTRY).where(QUEUE_ENTRY.ID.eq(entryId)).execute();
  }
}