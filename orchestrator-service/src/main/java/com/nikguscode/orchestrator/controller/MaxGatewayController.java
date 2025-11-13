package com.nikguscode.orchestrator.controller;

import com.nikguscode.orchestrator.dto.MaxMiniAppInitDataDto;
import com.nikguscode.orchestrator.service.authentication.AuthenticationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/api/")
public class MaxGatewayController {
  private final AuthenticationService authenticationService;
  private final String test = "user=%7B%22id%22%3A93393315%2C%22first_name%22%3A%22asd%22%2C%22last_name%22%3A%22%22%2C%22username%22%3Anull%2C%22language_code%22%3A%22ru%22%2C%22photo_url%22%3Anull%7D&query_id=c5d584c5-8e2e-4fe3-93dc-8759ddc50cd9&auth_date=1762967181&hash=5473c9d44697c601b77bd4faa830fee7ec6e574eb79c2a1c78142c9c43da1c2f&chat=%7B%22id%22%3A33539850%2C%22type%22%3A%22DIALOG%22%7D&ip=92.43.191.51";

  public MaxGatewayController(
      @Qualifier("maxAuthenticationService") AuthenticationService authenticationService) {
    this.authenticationService = authenticationService;
  }

  @PostMapping("/users/{maxId}/mini-app")
  public ResponseEntity<Void> handleUserMiniAppAction(
      @PathVariable Long maxId, @RequestBody @Valid MaxMiniAppInitDataDto maxMiniAppInitDataDto) {
    authenticationService.authenticate(test, 2L);
    return ResponseEntity.status(HttpStatus.OK).build();
  }
}