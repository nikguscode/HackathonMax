package com.nikguscode.orchestrator.dao.tables.queueentry;

import static com.nikguscode.jooq.tables.Queue.QUEUE;
import static com.nikguscode.jooq.tables.QueueEntry.QUEUE_ENTRY;
import static com.nikguscode.jooq.tables.QueueEntryMeta.QUEUE_ENTRY_META;
import static com.nikguscode.jooq.tables.User.USER;

import com.nikguscode.jooq.enums.QueueEntryStatus;
import com.nikguscode.orchestrator.core.model.QueueEntry;
import com.nikguscode.orchestrator.core.model.QueueEntryMeta;
import com.nikguscode.orchestrator.dao.result.QueueEntryActiveRecord;
import com.nikguscode.orchestrator.dao.result.QueueEntryRecord;
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
  public void create(QueueEntry queueEntry, QueueEntryMeta queueEntryMeta) {
    var queueEntryRecord = dsl.newRecord(QUEUE_ENTRY);
    var queueEntryMetaRecord = dsl.newRecord(QUEUE_ENTRY_META);

    queueEntryRecord.setId(queueEntry.getId());
    queueEntryRecord.setIdQueue(queueEntry.getQueueId());
    queueEntryRecord.setIdMax(queueEntry.getMaxId());
    queueEntryRecord.setStatus(QueueEntryStatus.valueOf(queueEntry.getStatus().toString()));

    queueEntryMetaRecord.setId(queueEntryMeta.getId());
    queueEntryMetaRecord.setIdQueueEntry(queueEntryMeta.getQueueEntryId());
    queueEntryMetaRecord.setJoinedAt(queueEntryMeta.getJoinedAt().toLocalDateTime());

    System.out.println(queueEntryRecord);
    System.out.println(queueEntryMetaRecord);
    queueEntryRecord.store();
    queueEntryMetaRecord.store();
  }

  @Override
  public void updateByEntryId(UUID queueEntryId, QueueEntryStatus status) {
    dsl.update(QUEUE_ENTRY)
        .set(QUEUE_ENTRY.STATUS, status)
        .where(QUEUE_ENTRY.ID.eq(queueEntryId))
        .execute();
  }

  @Override
  public List<QueueEntryActiveRecord> findActiveByMaxId(Long maxId) {
    var query = createRankedQueueEntriesQuery();
    var subquery = query.asTable("t_ranked");

    var cteIdMax = subquery.field(QUEUE_ENTRY.ID_MAX);
    var cteId = subquery.field(QUEUE_ENTRY.ID);
    var cteName = subquery.field(QUEUE.NAME);
    var cteStatus = subquery.field(QUEUE_ENTRY.STATUS);
    var cteRank = subquery.field("rank_in_queue", Integer.class);

    return dsl
        .select(cteId, cteName, cteRank, cteStatus)
        .from(subquery)
        .where(cteIdMax.eq(maxId))
        .fetch(
            record -> mapToQueueEntryActiveRecord(record, cteId, cteName, cteRank, cteStatus));
  }

  @Override
  public Optional<QueueEntryRecord> findByEntryId(UUID entryId) {
    var query = createRankedQueueEntriesQuery();
    var subquery = query.asTable("t_ranked");

    var cteId = subquery.field(QUEUE_ENTRY.ID);
    var cteName = subquery.field(QUEUE.NAME);
    var cteLogin = subquery.field(USER.USERNAME);
    var cteStatus = subquery.field(QUEUE_ENTRY.STATUS);
    var cteRank = subquery.field("rank_in_queue", Integer.class);

    return dsl
        .select(cteId, cteName, cteLogin, cteRank, cteStatus)
        .from(subquery)
        .where(cteId.eq(entryId))
        .fetchOptional(
            record -> mapToQueueEntryRecord(record, cteName, cteLogin, cteRank, cteStatus));
  }

  @Override
  public void delete(UUID entryId) {
    dsl.deleteFrom(QUEUE_ENTRY).where(QUEUE_ENTRY.ID.eq(entryId)).execute();
  }

  private SelectConditionStep<?> createRankedQueueEntriesQuery() {
    var statusPriorityExpression = DSL
        .when(QUEUE_ENTRY.STATUS.eq(QueueEntryStatus.SERVING), 0)
        .else_(1);

    var rankField = DSL.rank()
        .over()
        .partitionBy(QUEUE_ENTRY.ID_QUEUE)
        .orderBy(
            statusPriorityExpression.asc(),
            QUEUE_ENTRY_META.JOINED_AT.asc())
        .as("rank_in_queue");

    List<QueueEntryStatus> excludedStatuses = List.of(
        QueueEntryStatus.MISSED,
        QueueEntryStatus.CANCELED,
        QueueEntryStatus.SERVED);

    return dsl.select(
            QUEUE_ENTRY.ID,
            QUEUE_ENTRY.ID_MAX,
            QUEUE.NAME,
            QUEUE_ENTRY.STATUS,
            USER.USERNAME,
            USER.FIRST_NAME,
            rankField
        )
        .from(QUEUE_ENTRY)

        .join(QUEUE_ENTRY_META)
        .on(QUEUE_ENTRY_META.ID_QUEUE_ENTRY.eq(QUEUE_ENTRY.ID))

        .join(QUEUE)
        .on(QUEUE.ID.eq(QUEUE_ENTRY.ID_QUEUE))

        .join(USER)
        .on(USER.ID_MAX.eq(QUEUE_ENTRY.ID_MAX))

        .where(QUEUE_ENTRY.STATUS.notIn(excludedStatuses));
  }

  private QueueEntryActiveRecord mapToQueueEntryActiveRecord(
      Record record,
      Field<UUID> id,
      Field<String> name,
      Field<Integer> rankField,
      Field<QueueEntryStatus> status) {
    Integer rank = record.get(rankField, Integer.class);

    return new QueueEntryActiveRecord(
        record.get(id),
        record.get(name),
        rank != null ? rank - 1 : 0,
        record.get(status)
    );
  }

  private QueueEntryRecord mapToQueueEntryRecord(
      Record record,
      Field<String> name,
      Field<String> login,
      Field<Integer> rankField,
      Field<QueueEntryStatus> status) {
    Integer rank = record.get(rankField, Integer.class);

    return new QueueEntryRecord(
        record.get(name),
        record.get(login),
        rank != null ? rank - 1 : 0,
        record.get(status)
    );
  }
}