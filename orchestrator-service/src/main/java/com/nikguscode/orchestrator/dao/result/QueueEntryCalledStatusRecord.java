package com.nikguscode.orchestrator.dao.result;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@AllArgsConstructor
@Getter
@ToString
public class QueueEntryCalledStatusRecord {
  private final UUID id;
  private final UUID queueId;
  private final Long maxId;
  private final LocalDateTime joinedAt;
}