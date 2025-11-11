package com.nikguscode.orchestrator.controller;

import com.nikguscode.openapi.model.UserCreatingRequestDto;
import com.nikguscode.openapi.model.UserResponseDto;
import com.nikguscode.orchestrator.dao.user.UserDao;
import com.nikguscode.orchestrator.mapper.UserDtoMapper;
import com.nikguscode.orchestrator.model.User;
import com.nikguscode.orchestrator.service.UserService;
import java.time.OffsetDateTime;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Qualifier;
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
  public UserResponseDto getUserQueueInformation(@PathVariable Long maxId) {
    return userService.getUserQueueInformation(maxId);
  }

  @PutMapping("/users/{maxId}")
  public String editUser(@RequestBody UserCreatingRequestDto dto) {
    User user = userDtoMapper.dtoToUser(dto, OffsetDateTime.now());
    userDao.update(user);
    return "zaglushka";
  }

  @PostMapping("/users")
  public String addUser(@RequestBody UserCreatingRequestDto dto) {
    User user = userDtoMapper.dtoToUser(dto, OffsetDateTime.now());
    userDao.add(user);
    return "zaglushka";
  }

  @PutMapping("organizations/{organizationId}/users/{maxId}/role")
  public String updateUserRole(@PathVariable UUID organizationId, @PathVariable Long maxId) {
    return null;
  }
}