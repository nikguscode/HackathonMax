package com.nikguscode.orchestrator.controller;

import com.nikguscode.openapi.model.UserCreatingRequestDto;
import com.nikguscode.openapi.model.UserResponseDto;
import com.nikguscode.orchestrator.dao.organization.OrganizationDao;
import com.nikguscode.orchestrator.dao.queueentry.QueueEntryDao;
import com.nikguscode.orchestrator.dao.result.OrganizationRecord;
import com.nikguscode.orchestrator.dao.result.QueueEntryActiveRecord;
import com.nikguscode.orchestrator.dao.user.UserDao;
import com.nikguscode.orchestrator.mapper.UserDtoMapper;
import com.nikguscode.orchestrator.model.User;
import java.time.OffsetDateTime;
import java.util.List;
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
  private final OrganizationDao organizationDao;
  private final QueueEntryDao queueEntryDao;
  private final UserDtoMapper userDtoMapper;

  public UserController(
      @Qualifier("jooqUserDao") UserDao userDao,
      @Qualifier("jooqOrganizationDao") OrganizationDao organizationDao,
      @Qualifier("jooqQueueEntryDao") QueueEntryDao queueEntryDao,
      UserDtoMapper userDtoMapper) {
    this.userDao = userDao;
    this.organizationDao = organizationDao;
    this.queueEntryDao = queueEntryDao;
    this.userDtoMapper = userDtoMapper;
  }

  @GetMapping("/users/{maxId}")
  public UserResponseDto getUser(@PathVariable Long maxId) {
    List<OrganizationRecord> organizations = organizationDao.findByMaxId(maxId);
    List<QueueEntryActiveRecord> queueEntries = queueEntryDao.findActiveByMaxId(maxId);
    return userDtoMapper.dtoToResponse(organizations, queueEntries);
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