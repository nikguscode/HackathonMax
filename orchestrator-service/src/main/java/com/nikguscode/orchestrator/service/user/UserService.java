package com.nikguscode.orchestrator.service.user;

import com.nikguscode.openapi.model.UserResponseDto;
import com.nikguscode.orchestrator.dao.organization.OrganizationDao;
import com.nikguscode.orchestrator.dao.queueentry.QueueEntryDao;
import com.nikguscode.orchestrator.dao.result.OrganizationRecord;
import com.nikguscode.orchestrator.dao.result.QueueEntryActiveRecord;
import com.nikguscode.orchestrator.dao.user.UserDao;
import com.nikguscode.orchestrator.dto.UserHashDto;
import com.nikguscode.orchestrator.mapper.UserDtoMapper;
import com.nikguscode.orchestrator.model.User;
import com.nikguscode.orchestrator.service.authentication.MaxHashVerifyService;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

@Service
public class UserService {
  private final UserDao userDao;
  private final OrganizationDao organizationDao;
  private final QueueEntryDao queueEntryDao;
  private final UserDtoMapper userDtoMapper;
  private final UserCachingService userCachingService;
  private final MaxHashVerifyService maxHashVerifyService;

  public UserService(
      @Qualifier("jooqUserDao") UserDao userDao,
      @Qualifier("jooqOrganizationDao") OrganizationDao organizationDao,
      @Qualifier("jooqQueueEntryDao") QueueEntryDao queueEntryDao,
      UserDtoMapper userDtoMapper,
      UserCachingService userCachingService,
      MaxHashVerifyService maxHashVerifyService) {
    this.userDao = userDao;
    this.organizationDao = organizationDao;
    this.queueEntryDao = queueEntryDao;
    this.userDtoMapper = userDtoMapper;
    this.userCachingService = userCachingService;
    this.maxHashVerifyService = maxHashVerifyService;
  }

  public UserResponseDto getUserQueueInformation(Long maxId) {
    List<OrganizationRecord> organizations = organizationDao.findByMaxId(maxId);
    List<QueueEntryActiveRecord> queueEntries = queueEntryDao.findActiveByMaxId(maxId);
    return userDtoMapper.dtoToResponse(organizations, queueEntries);
  }

  public UserHashDto getOrUpdateUserHashInformation(
      String maxMiniAppInitInformation, Long maxId, String maxHash) {
    if (maxId == null) {
      throw new RuntimeException("zaglushka");
    }

    UserHashDto userHashDto = userCachingService.getUserByMaxId(maxId);

    if (userHashDto == null) {
      return updateUserCache(maxMiniAppInitInformation, maxId, maxHash);
    }

    if (maxHash.equals(userHashDto.getMaxHash())) {
      return userHashDto;
    }

    return updateUserCache(maxMiniAppInitInformation, maxId, maxHash);
  }


  private UserHashDto updateUserCache(
      String maxMiniAppInitInformation, Long maxId, String maxHash) {
    if (!maxHashVerifyService.check(maxMiniAppInitInformation)) {
      throw new RuntimeException("заглушка, добавить исключение для некорректной аутентификации");
    }

    UserHashDto uncachedUserHashDto = loadUserFromDb(maxId, maxHash);
    userCachingService.saveOrUpdateUser(maxId, uncachedUserHashDto);
    return uncachedUserHashDto;
  }

  private UserHashDto loadUserFromDb(Long maxId, String maxHash) {
    Optional<User> userOpt = userDao.findByMaxId(maxId);

    if (userOpt.isEmpty()) {
      throw new RuntimeException();
    }

    return userDtoMapper.userToHashDto(userOpt.get(), maxHash);
  }
}