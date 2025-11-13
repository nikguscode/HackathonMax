package com.nikguscode.orchestrator.core.service;

import com.nikguscode.openapi.model.QueueDto;
import com.nikguscode.openapi.model.QueueMembersResponseDto;
import com.nikguscode.openapi.model.QueueResponseDto;
import com.nikguscode.orchestrator.core.mapper.QueueDtoMapper;
import com.nikguscode.orchestrator.core.model.Organization;
import com.nikguscode.orchestrator.dao.organization.OrganizationDao;
import com.nikguscode.orchestrator.dao.queue.QueueDao;
import com.nikguscode.orchestrator.dao.result.QueueMemberRecord;
import com.nikguscode.orchestrator.dao.result.QueueMetricsRecord;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

@Service
public class QueueService {
  private final OrganizationDao organizationDao;
  private final QueueDao queueDao;
  private final QueueDtoMapper queueDtoMapper;

  public QueueService(
      @Qualifier("jooqOrganizationDao") OrganizationDao organizationDao,
      @Qualifier("jooqQueueDao") QueueDao queueDao,
      QueueDtoMapper queueDtoMapper) {
    this.organizationDao = organizationDao;
    this.queueDao = queueDao;
    this.queueDtoMapper = queueDtoMapper;
  }

  public QueueResponseDto getQueues(UUID organizationId) {
    if (organizationId == null) {
      throw new RuntimeException("Organization id can't be null in QueueService#getQueues()");
    }

    Optional<Organization> organizationOpt = organizationDao.findByOrganizationId(organizationId);

    if (organizationOpt.isEmpty()) {
      throw new RuntimeException(
          "Organization optional can't be null in OrganizationService#getOrganizationQueues");
    }

    List<QueueMetricsRecord>
        queueRecords = queueDao.getQueuesWithMetricsByOrganizationId(organizationId);
    List<QueueDto> queueDtoList = queueDtoMapper.queueMetricRecordToDto(queueRecords);
    System.out.println(queueDtoList);

    return queueDtoMapper.mapToQueueResponse(organizationOpt.get(), queueDtoList);
  }

  public QueueMembersResponseDto getMembers(UUID queueId) {
    List<QueueMemberRecord> memberRecords = queueDao.findByQueueId(queueId);
    QueueMembersResponseDto responseDto = new QueueMembersResponseDto();

    if (memberRecords == null || memberRecords.isEmpty()) {
      return responseDto.members(Collections.emptyList());
    }

    return responseDto.members(queueDtoMapper.membersToDto(memberRecords));
  }
}