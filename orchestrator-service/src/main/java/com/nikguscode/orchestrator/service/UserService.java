package com.nikguscode.orchestrator.service;

import com.nikguscode.openapi.model.UserResponseDto;
import com.nikguscode.orchestrator.dao.organization.OrganizationDao;
import com.nikguscode.orchestrator.dao.queueentry.QueueEntryDao;
import com.nikguscode.orchestrator.dao.result.OrganizationRecord;
import com.nikguscode.orchestrator.dao.result.QueueEntryActiveRecord;
import com.nikguscode.orchestrator.mapper.UserDtoMapper;
import java.util.List;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

@Service
public class UserService {
  private final OrganizationDao organizationDao;
  private final QueueEntryDao queueEntryDao;
  private final UserDtoMapper userDtoMapper;

  public UserService(
      @Qualifier("jooqOrganizationDao") OrganizationDao organizationDao,
      @Qualifier("jooqQueueEntryDao") QueueEntryDao queueEntryDao,
      UserDtoMapper userDtoMapper) {
    this.organizationDao = organizationDao;
    this.queueEntryDao = queueEntryDao;
    this.userDtoMapper = userDtoMapper;
  }

  public UserResponseDto getUserQueueInformation(Long maxId) {
    List<OrganizationRecord> organizations = organizationDao.findByMaxId(maxId);
    List<QueueEntryActiveRecord> queueEntries = queueEntryDao.findActiveByMaxId(maxId);
    return userDtoMapper.dtoToResponse(organizations, queueEntries);
  }
}