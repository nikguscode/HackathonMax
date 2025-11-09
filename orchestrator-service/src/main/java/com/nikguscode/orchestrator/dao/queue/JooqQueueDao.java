package com.nikguscode.orchestrator.dao.queue;

import static com.nikguscode.jooq.tables.Queue.QUEUE;

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
        .selectFrom(QUEUE)
        .where(QUEUE.ID_ORGANIZATION.eq(organizationId))
        .fetchInto(Queue.class);
  }
}
