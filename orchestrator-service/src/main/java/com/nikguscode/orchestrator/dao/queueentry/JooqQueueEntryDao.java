package com.nikguscode.orchestrator.dao.queueentry;

import static com.nikguscode.jooq.tables.QueueEntry.QUEUE_ENTRY;

import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JooqQueueEntryDao implements QueueEntryDao {
  private final DSLContext dsl;

  @Override
  public void delete(UUID entryId) {
    dsl.deleteFrom(QUEUE_ENTRY).where(QUEUE_ENTRY.ID.eq(entryId)).execute();
  }
}