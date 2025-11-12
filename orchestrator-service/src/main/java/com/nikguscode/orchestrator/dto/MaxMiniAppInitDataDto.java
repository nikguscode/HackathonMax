package com.nikguscode.orchestrator.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@AllArgsConstructor
@Getter
@ToString
public class MaxMiniAppInitDataDto {
  @NotBlank
  private final String miniAppInitData;
}