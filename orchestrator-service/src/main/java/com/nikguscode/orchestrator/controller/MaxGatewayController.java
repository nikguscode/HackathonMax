package com.nikguscode.orchestrator.controller;

import com.nikguscode.orchestrator.core.service.authentication.AuthenticationService;
import com.nikguscode.orchestrator.dto.MaxMiniAppInitDataDto;
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
  private final String test = "auth_date=1763043369&hash=d61fa30fa07b6fcca85ffb5fec619264b512e23d114a9c3ccb241f5f6013a0fa&chat=%7B%22id%22%3A10397275%2C%22type%22%3A%22DIALOG%22%7D&ip=77.222.96.158&user=%7B%22id%22%3A82866418%2C%22first_name%22%3A%22%D0%93%D0%BB%D0%B5%D0%B1%22%2C%22last_name%22%3A%22%22%2C%22username%22%3Anull%2C%22language_code%22%3A%22ru%22%2C%22photo_url%22%3A%22https%3A%2F%2Fi.oneme.ru%2Fi%3Fr%3DBTGBPUwtwgYUeoFhO7rESmr8NwHPQw18OCDFRXIdA0HLknXO8y_iY4o18qvYZJw5nhA%22%7D&query_id=8938fca0-c639-48ab-8159-bd96be752a59";

  public MaxGatewayController(
      @Qualifier("maxAuthenticationService") AuthenticationService authenticationService) {
    this.authenticationService = authenticationService;
  }

  @PostMapping("/users/{maxId}/mini-app")
  public ResponseEntity<Void> handleUserMiniAppAction(
      @PathVariable Long maxId, @RequestBody @Valid MaxMiniAppInitDataDto maxMiniAppInitDataDto) {
//    authenticationService.authenticate(test, 2L);

    if (maxId == null) {
      throw new RuntimeException("Max id in this request can't be null");
    }

    authenticationService.authenticate(maxMiniAppInitDataDto.getMiniAppInitData(), maxId);
    return ResponseEntity.status(HttpStatus.OK).build();
  }
}