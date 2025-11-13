package com.nikguscode.orchestrator.core.service.user;

import com.nikguscode.openapi.model.UserResponseDto;
import com.nikguscode.orchestrator.dao.organization.OrganizationDao;
import com.nikguscode.orchestrator.dao.queueentry.QueueEntryDao;
import com.nikguscode.orchestrator.dao.result.OrganizationRecord;
import com.nikguscode.orchestrator.dao.result.QueueEntryActiveRecord;
import com.nikguscode.orchestrator.dao.user.UserDao;
import com.nikguscode.orchestrator.dto.MaxUserDataDto;
import com.nikguscode.orchestrator.dto.UserHashDto;
import com.nikguscode.orchestrator.core.mapper.UserDtoMapper;
import com.nikguscode.orchestrator.core.model.User;
import com.nikguscode.orchestrator.core.service.authentication.MaxHashVerifyService;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
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

  public boolean verifyUserAccess(UUID authId, String maxHash) {
    UserHashDto userHashDto = userCachingService.getUserByMaxId(authId);

    if (userHashDto == null) {
      return false;
    }

    if (userHashDto.getMaxHash() == null || userHashDto.getMaxHash().isBlank()) {
      return false;
    }

    return maxHash.equals(userHashDto.getMaxHash());
  }

  public UserHashDto getOrUpdateUserHashInformation(
      String maxMiniAppInitInformation, UUID authId, String maxHash) {
    if (maxMiniAppInitInformation == null || maxMiniAppInitInformation.isBlank()) {
      throw new RuntimeException("Max mini-app init information not found");
    }

    if (authId == null) {
      throw new RuntimeException("Auth id can't be null");
    }

    UserHashDto cachedUser = userCachingService.getUserByMaxId(authId);

    if (cachedUser != null) {
      if (maxHash.equals(cachedUser.getMaxHash())) {
        return cachedUser;
      }
    }

    System.out.println("Проверка токена: " + maxHashVerifyService.check(maxMiniAppInitInformation));

    if (!maxHashVerifyService.check(maxMiniAppInitInformation)) {
      throw new RuntimeException("Max hash did not pass validation");
    }

    return updateUserCache(maxMiniAppInitInformation, authId, maxHash);
  }

  private UserHashDto updateUserCache(
      String maxMiniAppInitInformation, UUID authId, String maxHash) {
    UserHashDto uncachedUserHashDto = loadUserFromDb(maxMiniAppInitInformation, maxHash);
    userCachingService.saveOrUpdateUser(authId, uncachedUserHashDto);
    return uncachedUserHashDto;
  }

  private UserHashDto loadUserFromDb(String maxMiniAppInitInformation, String maxHash) {
    MaxUserDataDto maxUserDataDto = maxUserDataExtractor.extract(maxMiniAppInitInformation);

    if (maxUserDataDto.getUser() == null || maxUserDataDto.getUser().getId() == null) {
      throw new RuntimeException("Max user data dto can't be null");
    }

    Optional<User> userOpt = userDao.findByMaxId(maxUserDataDto.getUser().getId());

    if (userOpt.isPresent()) {
      User user = userOpt.get();
      return userDtoMapper.userToHashDto(user, maxHash);
    }

    User user = userDtoMapper.userToMaxUserDataDto(maxUserDataDto.getUser(), OffsetDateTime.now());
    userDao.add(user);

    return userDtoMapper.userToHashDto(user, maxHash);
  }
}