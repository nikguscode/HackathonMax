package com.nikguscode.orchestrator.controller;

import com.nikguscode.openapi.model.UserRequestDto;
import com.nikguscode.orchestrator.dao.user.UserDao;
import com.nikguscode.orchestrator.mapper.UserDtoMapper;
import com.nikguscode.orchestrator.model.User;
import java.time.OffsetDateTime;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
public class UserController {
  private final UserDao userDao;
  private final UserDtoMapper userDtoMapper;

  public UserController(
      @Qualifier("jooqUserDao") UserDao userDao,
      UserDtoMapper userDtoMapper) {
    this.userDao = userDao;
    this.userDtoMapper = userDtoMapper;
  }

  @GetMapping("/{maxId}")
  public String getUser(@PathVariable Long maxId) {
    System.out.println(userDao.get(maxId));
    return "zaglushka";
  }

  @PutMapping("/{maxId}")
  public String editUser(@RequestBody UserRequestDto dto) {
    User user = userDtoMapper.dtoToUser(dto, OffsetDateTime.now());
    userDao.update(user);
    return "zaglushka";
  }

  @PostMapping
  public String addUser(@RequestBody UserRequestDto dto) {
    User user = userDtoMapper.dtoToUser(dto, OffsetDateTime.now());
    userDao.add(user);
    return "zaglushka";
  }
}