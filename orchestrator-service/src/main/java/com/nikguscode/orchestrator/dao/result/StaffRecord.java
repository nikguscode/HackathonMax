package com.nikguscode.orchestrator.dao.result;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.UUID;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class StaffRecord {
  private final UUID staffId;
  private final String username;

  @JsonCreator

  public StaffRecord(
      @JsonProperty("staffId") UUID staffId,
      @JsonProperty("username") String username) {
    this.staffId = staffId;
    this.username = username;
  }
}