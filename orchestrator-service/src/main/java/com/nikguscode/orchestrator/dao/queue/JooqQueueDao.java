package com.nikguscode.orchestrator.dao.queue;

import static com.nikguscode.jooq.tables.Queue.QUEUE;
import static com.nikguscode.jooq.tables.QueueEntry.QUEUE_ENTRY;
import static com.nikguscode.jooq.tables.User.USER;

import com.nikguscode.orchestrator.dao.result.QueueMemberRecord;
import com.nikguscode.orchestrator.model.Queue;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JooqQueueDao implements QueueDao {
  private final DSLContext dsl;

  @Override
  public List<Queue> findByOrganizationId(UUID organizationId) {
    return dsl
        .select(QUEUE.fields())
        .from(QUEUE)

        .where(QUEUE.ID_ORGANIZATION.eq(organizationId))
        .fetchInto(Queue.class);
  }

  @Override
  public List<QueueMemberRecord> findByQueueId(UUID queueId) {
    return dsl
        .select(QUEUE_ENTRY.ID_MAX, QUEUE_ENTRY.ID, USER.USERNAME)
        .from(QUEUE)

        .join(QUEUE_ENTRY)
        .on(QUEUE_ENTRY.ID_QUEUE.eq(QUEUE.ID))

        .join(USER)
        .on(USER.ID_MAX.eq(QUEUE_ENTRY.ID_MAX))

        .where(QUEUE_ENTRY.ID_QUEUE.eq(queueId))
        .fetchInto(QueueMemberRecord.class);
  }
}
