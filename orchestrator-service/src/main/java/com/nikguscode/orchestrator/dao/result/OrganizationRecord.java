package com.nikguscode.orchestrator.dao.result;

import com.nikguscode.openapi.model.UserRoleDto;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@AllArgsConstructor
@Getter
@ToString
public class OrganizationRecord {
  private final UUID id;
  private final String name;
  private final UserRoleDto role;
  private final Integer amountOfQueues;
}