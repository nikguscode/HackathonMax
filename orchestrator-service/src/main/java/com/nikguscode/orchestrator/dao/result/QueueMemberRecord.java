package com.nikguscode.orchestrator.dao.result;

import com.nikguscode.jooq.enums.QueueEntryStatus;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@AllArgsConstructor
@Getter
@ToString
public class QueueMemberRecord {
  private final Long maxId;
  private final UUID queueEntryId;
  private final String username;
  private final QueueEntryStatus status;
}