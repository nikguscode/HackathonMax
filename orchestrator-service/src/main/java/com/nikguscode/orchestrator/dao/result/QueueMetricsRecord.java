package com.nikguscode.orchestrator.dao.result;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.UUID;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class QueueMetricsRecord {
  private final UUID id;
  private final String name;
  private final Integer amountOfEmployees;
  private final Integer maxSizeOfTodayQueue;
  private final Integer amountOfServedPeople;

  @JsonCreator
  public QueueMetricsRecord(
      @JsonProperty("id") UUID id,
      @JsonProperty("name") String name,
      @JsonProperty("amountOfEmployees") Integer amountOfEmployees,
      @JsonProperty("maxSizeOfTodayQueue") Integer maxSizeOfTodayQueue,
      @JsonProperty("amountOfServedPeople") Integer amountOfServedPeople) {
    this.id = id;
    this.name = name;
    this.amountOfEmployees = amountOfEmployees;
    this.maxSizeOfTodayQueue = maxSizeOfTodayQueue;
    this.amountOfServedPeople = amountOfServedPeople;
  }
}