package com.nikguscode.orchestrator.dao.queueentry;

import static com.nikguscode.jooq.tables.Queue.QUEUE;
import static com.nikguscode.jooq.tables.QueueEntry.QUEUE_ENTRY;
import static com.nikguscode.jooq.tables.QueueEntryMeta.QUEUE_ENTRY_META;

import com.nikguscode.jooq.enums.QueueStatus;
import com.nikguscode.openapi.model.QueueEntryStatusDto;
import com.nikguscode.orchestrator.dao.result.QueueEntryActiveRecord;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.Field;
import org.jooq.Record;
import org.jooq.SelectConditionStep;
import org.jooq.impl.DSL;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JooqQueueEntryDao implements QueueEntryDao {
  private final DSLContext dsl;

  @Override
  public List<QueueEntryActiveRecord> findActiveByMaxId(Long maxId) {
    var query = createRankedQueueEntriesQuery();
    var subquery = query.asTable("t_ranked");

    var cteId = subquery.field(QUEUE_ENTRY.ID);
    var cteName = subquery.field(QUEUE.NAME);
    var cteStatus = subquery.field(QUEUE_ENTRY.STATUS);
    var cteRank = subquery.field("rank_in_queue", Integer.class);
    var cteIdMax = subquery.field(QUEUE_ENTRY.ID_MAX);

    return dsl
        .select(cteId, cteName, cteRank, cteStatus)
        .from(subquery)
        .where(cteIdMax.eq(maxId))
        .fetch(record -> mapToRecord(record, cteRank, cteStatus, cteId, cteName));
  }

  @Override
  public Optional<QueueEntryActiveRecord> findByEntryId(UUID entryId) {
    var query = createRankedQueueEntriesQuery();
    var subquery = query.asTable("t_ranked");

    var cteId = subquery.field(QUEUE_ENTRY.ID);
    var cteName = subquery.field(QUEUE.NAME);
    var cteStatus = subquery.field(QUEUE_ENTRY.STATUS);
    var cteRank = subquery.field("rank_in_queue", Integer.class);

    return dsl
        .select(cteId, cteName, cteRank, cteStatus)
        .from(subquery)
        .where(cteId.eq(entryId))
        .fetchOptional(
            record -> mapToRecord(record, cteRank, cteStatus, cteId, cteName));
  }

  @Override
  public void delete(UUID entryId) {
    dsl.deleteFrom(QUEUE_ENTRY).where(QUEUE_ENTRY.ID.eq(entryId)).execute();
  }

  private SelectConditionStep<?> createRankedQueueEntriesQuery() {
    var statusPriorityExpression = DSL
        .when(QUEUE_ENTRY.STATUS.eq(QueueStatus.SERVING), 0)
        .else_(1);

    var rankField = DSL.rank()
        .over()
        .partitionBy(QUEUE_ENTRY.ID_QUEUE)
        .orderBy(
            statusPriorityExpression.asc(),
            QUEUE_ENTRY_META.JOINED_AT.asc())
        .as("rank_in_queue");

    List<QueueStatus> excludedStatuses = List.of(
        QueueStatus.MISSED,
        QueueStatus.CANCELED,
        QueueStatus.SERVED);

    return dsl.select(
            QUEUE_ENTRY.ID,
            QUEUE_ENTRY.ID_MAX,
            QUEUE.NAME,
            QUEUE_ENTRY.STATUS,
            rankField
        )
        .from(QUEUE_ENTRY)
        .join(QUEUE_ENTRY_META)
        .on(QUEUE_ENTRY_META.ID_QUEUE_ENTRY.eq(QUEUE_ENTRY.ID))
        .join(QUEUE)
        .on(QUEUE.ID.eq(QUEUE_ENTRY.ID_QUEUE))
        .where(
            QUEUE_ENTRY.STATUS.notIn(excludedStatuses));
  }

  private QueueEntryActiveRecord mapToRecord(
      Record record,
      Field<Integer> rankField,
      Field<QueueStatus> statusField,
      Field<UUID> idField,
      Field<String> nameField) {
    Integer rank = record.get(rankField, Integer.class);
    QueueEntryStatusDto statusDto =
        QueueEntryStatusDto.fromValue(record.get(statusField).toString());

    return new QueueEntryActiveRecord(
        record.get(idField),
        record.get(nameField),
        rank != null ? rank - 1 : 0,
        statusDto
    );
  }
}