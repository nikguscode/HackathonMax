package com.nikguscode.orchestrator.controller;

import com.nikguscode.openapi.model.MiniAppInitResponseDto;
import com.nikguscode.orchestrator.core.mapper.MiniAppDtoMapper;
import com.nikguscode.orchestrator.core.service.authentication.AuthenticationService;
import com.nikguscode.orchestrator.dto.max.MaxMiniAppInitDataDto;
import com.nikguscode.orchestrator.dto.max.MaxUserDataDto;
import jakarta.validation.Valid;
import java.util.UUID;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/api/")
@Log4j2
public class MaxGatewayController {
  private final AuthenticationService authenticationService;
  private final MiniAppDtoMapper miniAppDtoMapper;

  public MaxGatewayController(
      @Qualifier("maxAuthenticationService") AuthenticationService authenticationService,
      MiniAppDtoMapper miniAppDtoMapper) {
    this.authenticationService = authenticationService;
    this.miniAppDtoMapper = miniAppDtoMapper;
  }

  @PostMapping("/users/{maxId}/mini-app")
  public ResponseEntity<MiniAppInitResponseDto> handleUserMiniAppAction(
      @PathVariable Long maxId, @RequestBody @Valid MaxMiniAppInitDataDto maxMiniAppInitDataDto) {
    final UUID authId = UUID.randomUUID();

    log.info("MaxId:{}", maxId);
    log.info("MiniAppInitData:{}", maxMiniAppInitDataDto);

    MaxUserDataDto maxUserDataDto =
        authenticationService.authenticate(authId, maxMiniAppInitDataDto.getMiniAppInitData());

    MiniAppInitResponseDto response =
        miniAppDtoMapper.userDataToMiniAppInitResponseDto(authId, maxUserDataDto);
    return ResponseEntity.ok(response);
  }
}