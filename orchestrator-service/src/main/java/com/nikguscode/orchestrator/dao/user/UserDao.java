package com.nikguscode.orchestrator.dao.user;

import com.nikguscode.orchestrator.model.User;
import java.util.Optional;

public interface UserDao {
  Optional<User> findByMaxId(Long maxId);

  void add(User user);

  void update(User user);
}