package com.nikguscode.orchestrator.controller;

import com.nikguscode.openapi.model.UserCreatingRequestDto;
import com.nikguscode.openapi.model.UserResponseDto;
import com.nikguscode.orchestrator.dao.tables.user.UserDao;
import com.nikguscode.orchestrator.core.mapper.UserDtoMapper;
import com.nikguscode.orchestrator.core.model.User;
import com.nikguscode.orchestrator.core.service.user.UserService;
import java.time.OffsetDateTime;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/api")
public class UserController {
  private final UserDao userDao;
  private final UserDtoMapper userDtoMapper;
  private final UserService userService;

  public UserController(
      @Qualifier("jooqUserDao") UserDao userDao,
      UserDtoMapper userDtoMapper,
      UserService userService) {
    this.userDao = userDao;
    this.userDtoMapper = userDtoMapper;
    this.userService = userService;
  }

  @GetMapping("/users/{maxId}")
  public ResponseEntity<UserResponseDto> getUserQueueInformation(@PathVariable Long maxId) {
    var responseBody = userService.getUserQueueInformation(maxId);
    return ResponseEntity.ok(responseBody);
  }

  // 1. Добавить в user_roles
  // 2. Добавить в queue_staff
  // 3. Удалить все связанные с ним queue_entry и queue_entry_meta со статусом WAITING, SERVING
//  @PutMapping("/users/{maxId}/role")

  @PutMapping("/users/{maxId}")
  public ResponseEntity<Void> editUser(@RequestBody UserCreatingRequestDto dto) {
    User user = userDtoMapper.toUser(dto, OffsetDateTime.now());
    userDao.update(user);
    return ResponseEntity.ok().build();
  }

  @PostMapping("/users")
  public ResponseEntity<Void> addUser(@RequestBody UserCreatingRequestDto dto) {
    User user = userDtoMapper.toUser(dto, OffsetDateTime.now());
    userDao.add(user);
    return ResponseEntity.ok().build();
  }

  @PutMapping("organizations/{organizationId}/users/{maxId}/role")
  public String updateUserRole(@PathVariable UUID organizationId, @PathVariable Long maxId) {
    return null;
  }
}