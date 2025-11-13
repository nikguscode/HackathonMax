package com.nikguscode.orchestrator.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class MaxMiniAppInitDataDto {
  @NotBlank
  private final String miniAppInitData;

  @JsonCreator
  public MaxMiniAppInitDataDto(@JsonProperty("miniAppInitData") String miniAppInitData) {
    this.miniAppInitData = miniAppInitData;
  }
}