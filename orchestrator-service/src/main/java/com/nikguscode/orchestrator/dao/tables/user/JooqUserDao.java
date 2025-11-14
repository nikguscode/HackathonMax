package com.nikguscode.orchestrator.dao.tables.user;

import static com.nikguscode.jooq.tables.User.USER;

import com.nikguscode.jooq.tables.records.UserRecord;
import com.nikguscode.orchestrator.core.model.User;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JooqUserDao implements UserDao {
  private final DSLContext dsl;

  @Override
  public Optional<User> findByMaxId(Long maxId) {
    return dsl.selectFrom(USER).where(USER.ID_MAX.eq(maxId)).fetchOptionalInto(User.class);
  }

  @Override
  public User add(User user) {
    try {
      UserRecord userRecord = dsl.newRecord(USER, user);
      userRecord.store();
      return user;
    } catch (DuplicateKeyException e) {
      throw new RuntimeException("заглушка");
    }
  }

  @Override
  public void update(User user) {
    UserRecord userRecord = dsl.newRecord(USER, user);
    userRecord.update();
  }
}