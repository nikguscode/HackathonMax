package com.nikguscode.orchestrator.dao.result;

import com.nikguscode.openapi.model.QueueEntryStatusDto;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@AllArgsConstructor
@Getter
@ToString
public class QueueEntryActiveRecord {
  private final UUID id;
  private final String name;
  private final Integer peopleInFront;
  private final QueueEntryStatusDto status;
}