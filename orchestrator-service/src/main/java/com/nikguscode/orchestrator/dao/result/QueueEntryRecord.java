package com.nikguscode.orchestrator.dao.result;

import com.nikguscode.jooq.enums.QueueEntryStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@AllArgsConstructor
@Getter
@ToString
public class QueueEntryRecord {
  private final String name;
  private final String login;
  private final Integer peopleInFront;
  private final QueueEntryStatus status;
}