package com.nikguscode.orchestrator.service.user;

import com.nikguscode.openapi.model.UserResponseDto;
import com.nikguscode.orchestrator.dao.organization.OrganizationDao;
import com.nikguscode.orchestrator.dao.queueentry.QueueEntryDao;
import com.nikguscode.orchestrator.dao.result.OrganizationRecord;
import com.nikguscode.orchestrator.dao.result.QueueEntryActiveRecord;
import com.nikguscode.orchestrator.dao.user.UserDao;
import com.nikguscode.orchestrator.dto.MaxUserDataDto;
import com.nikguscode.orchestrator.dto.UserHashDto;
import com.nikguscode.orchestrator.mapper.UserDtoMapper;
import com.nikguscode.orchestrator.model.User;
import com.nikguscode.orchestrator.service.authentication.MaxHashVerifyService;
import java.time.OffsetDateTime;
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
  private final MaxUserDataExtractor maxUserDataExtractor;

  public UserService(
      @Qualifier("jooqUserDao") UserDao userDao,
      @Qualifier("jooqOrganizationDao") OrganizationDao organizationDao,
      @Qualifier("jooqQueueEntryDao") QueueEntryDao queueEntryDao,
      UserDtoMapper userDtoMapper,
      UserCachingService userCachingService,
      MaxHashVerifyService maxHashVerifyService,
      MaxUserDataExtractor maxUserDataExtractor) {
    this.userDao = userDao;
    this.organizationDao = organizationDao;
    this.queueEntryDao = queueEntryDao;
    this.userDtoMapper = userDtoMapper;
    this.userCachingService = userCachingService;
    this.maxHashVerifyService = maxHashVerifyService;
    this.maxUserDataExtractor = maxUserDataExtractor;
  }

  public UserResponseDto getUserQueueInformation(Long maxId) {
    List<OrganizationRecord> organizations = organizationDao.findByMaxId(maxId);
    List<QueueEntryActiveRecord> queueEntries = queueEntryDao.findActiveByMaxId(maxId);
    return userDtoMapper.dtoToResponse(organizations, queueEntries);
  }

  public boolean verifyUserAccess(Long maxId, String maxHash) {
    UserHashDto userHashDto = userCachingService.getUserByMaxId(maxId);

    if (userHashDto == null) {
      return false;
    }

    if (userHashDto.getMaxHash() == null || userHashDto.getMaxHash().isBlank()) {
      return false;
    }

    return maxHash.equals(userHashDto.getMaxHash());
  }

  public UserHashDto getOrUpdateUserHashInformation(
      String maxMiniAppInitInformation, Long maxId, String maxHash) {
    if (maxId == null) {
      throw new RuntimeException("zaglushka");
    }

    UserHashDto cachedUser = userCachingService.getUserByMaxId(maxId);

    if (cachedUser != null) {
      if (maxHash.equals(cachedUser.getMaxHash())) {
        return cachedUser;
      }
    }

    if (!maxHashVerifyService.check(maxMiniAppInitInformation)) {
      throw new RuntimeException("заглушка, добавить исключение для некорректной аутентификации");
    }

    return updateUserCache(maxMiniAppInitInformation, maxId, maxHash);
  }

  private UserHashDto updateUserCache(
      String maxMiniAppInitInformation, Long maxId, String maxHash) {
    UserHashDto uncachedUserHashDto = loadUserFromDb(maxMiniAppInitInformation, maxId, maxHash);
    userCachingService.saveOrUpdateUser(maxId, uncachedUserHashDto);
    return uncachedUserHashDto;
  }

  private UserHashDto loadUserFromDb(String maxMiniAppInitInformation, Long maxId, String maxHash) {
    Optional<User> userOpt = userDao.findByMaxId(maxId);

    if (userOpt.isPresent()) {
      User user = userOpt.get();
      return userDtoMapper.userToHashDto(user, maxHash);
    }

    MaxUserDataDto maxUserDataDto = maxUserDataExtractor.extract(maxMiniAppInitInformation);
    User user = userDtoMapper.userToMaxUserDataDto(maxUserDataDto.getUser(), OffsetDateTime.now());
    userDao.add(user);

    return userDtoMapper.userToHashDto(user, maxHash);
  }
}