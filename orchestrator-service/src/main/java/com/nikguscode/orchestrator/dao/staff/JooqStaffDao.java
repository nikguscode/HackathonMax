package com.nikguscode.orchestrator.dao.staff;

import static com.nikguscode.jooq.tables.QueueStaff.QUEUE_STAFF;
import static com.nikguscode.jooq.tables.User.USER;

import com.nikguscode.orchestrator.dao.result.StaffRecord;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JooqStaffDao implements StaffDao {
  private final DSLContext dsl;

  @Override
  public List<StaffRecord> findByQueueId(UUID queueId) {
    return dsl
        .select(QUEUE_STAFF.ID, USER.FIRST_NAME)
        .from(QUEUE_STAFF)

        .join(USER)
        .on(QUEUE_STAFF.ID_MAX.eq(USER.ID_MAX))

        .where(QUEUE_STAFF.ID_QUEUE.eq(queueId))

        .fetchInto(StaffRecord.class);
  }
}