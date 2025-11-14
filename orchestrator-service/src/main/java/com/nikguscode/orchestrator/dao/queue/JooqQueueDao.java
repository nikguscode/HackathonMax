package com.nikguscode.orchestrator.dao.queue;

import static com.nikguscode.jooq.tables.Queue.QUEUE;
import static com.nikguscode.jooq.tables.QueueEntry.QUEUE_ENTRY;
import static com.nikguscode.jooq.tables.QueueEntryMeta.QUEUE_ENTRY_META;
import static com.nikguscode.jooq.tables.QueueParams.QUEUE_PARAMS;
import static com.nikguscode.jooq.tables.QueueStaff.QUEUE_STAFF;
import static com.nikguscode.jooq.tables.User.USER;

import com.nikguscode.jooq.enums.QueueEntryStatus;
import com.nikguscode.jooq.tables.records.QueueParamsRecord;
import com.nikguscode.jooq.tables.records.QueueRecord;
import com.nikguscode.orchestrator.core.model.Queue;
import com.nikguscode.orchestrator.core.model.QueueParams;
import com.nikguscode.orchestrator.dao.result.QueueMemberRecord;
import com.nikguscode.orchestrator.dao.result.QueueMetricsRecord;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.impl.DSL;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JooqQueueDao implements QueueDao {
  private final DSLContext dsl;

  @Override
  public void createQueue(Queue queue, QueueParams queueParams) {
    QueueRecord queueRecord = dsl.newRecord(QUEUE, queue);
    QueueParamsRecord queueParamsRecord = dsl.newRecord(QUEUE_PARAMS, queueParams);

    queueRecord.set(QUEUE.ID_ORGANIZATION, queue.getOrganizationId());
    queueParamsRecord.set(QUEUE_PARAMS.ID_QUEUE, queueParams.getQueueId());

    queueRecord.store();
    queueParamsRecord.store();
  }

  @Override
  public List<QueueMetricsRecord> getQueuesWithMetricsByOrganizationId(UUID organizationId) {
    var Q = QUEUE.as("Q");

    var amountOfEmployees = DSL
        .selectCount()
        .from(QUEUE_STAFF)
        .where(Q.ID.eq(QUEUE_STAFF.ID_QUEUE))
        .asField("amountOfEmployees");

    var maxSizeOfTodayQueueField = DSL.val(0).as("maxSizeOfTodayQueue");
    var amountOfServedPeopleField = DSL
        .selectCount()
        .from(QUEUE_ENTRY)

        .join(QUEUE_ENTRY_META)
        .on(QUEUE_ENTRY_META.ID_QUEUE_ENTRY.eq(QUEUE_ENTRY.ID))

        .where(
            Q.ID.eq(QUEUE_ENTRY.ID_QUEUE)
                .and(QUEUE_ENTRY.STATUS.eq(QueueEntryStatus.SERVED))
        )
        .asField("amountOfServedPeople");

    return dsl
        .select(
            Q.ID,
            Q.NAME,
            amountOfEmployees,
            maxSizeOfTodayQueueField,
            amountOfServedPeopleField
        )
        .from(Q)
        .where(Q.ID_ORGANIZATION.eq(organizationId))
        .fetchInto(QueueMetricsRecord.class);
  }

  @Override
  public List<QueueMemberRecord> findByQueueId(UUID queueId) {
    List<QueueEntryStatus> excludedStatuses =
        List.of(QueueEntryStatus.CANCELED, QueueEntryStatus.SERVED);

    return dsl
        .select(QUEUE_ENTRY.ID_MAX, QUEUE_ENTRY.ID, USER.FIRST_NAME)
        .from(QUEUE)

        .join(QUEUE_ENTRY)
        .on(QUEUE_ENTRY.ID_QUEUE.eq(QUEUE.ID))

        .join(USER)
        .on(USER.ID_MAX.eq(QUEUE_ENTRY.ID_MAX))

        .where(
            QUEUE_ENTRY.ID_QUEUE.eq(queueId)
                .and(QUEUE_ENTRY.STATUS.notIn(excludedStatuses)))
        .fetchInto(QueueMemberRecord.class);
  }
}
