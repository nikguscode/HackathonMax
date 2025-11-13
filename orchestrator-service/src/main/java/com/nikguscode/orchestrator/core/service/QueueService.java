package com.nikguscode.orchestrator.core.service;

import com.nikguscode.openapi.model.QueueMembersResponseDto;
import com.nikguscode.openapi.model.QueueResponseDto;
import com.nikguscode.orchestrator.dao.queue.QueueDao;
import com.nikguscode.orchestrator.dao.result.QueueMemberRecord;
import com.nikguscode.orchestrator.core.mapper.QueueDtoMapper;
import com.nikguscode.orchestrator.core.model.Queue;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

@Service
public class QueueService {
  private final QueueDao queueDao;
  private final QueueDtoMapper queueDtoMapper;

  public QueueService(
      @Qualifier("jooqQueueDao") QueueDao queueDao,
      QueueDtoMapper queueDtoMapper) {
    this.queueDao = queueDao;
    this.queueDtoMapper = queueDtoMapper;
  }

  public QueueResponseDto getQueues(UUID organizationId) {
    List<Queue> queues = queueDao.findByOrganizationId(organizationId);
    QueueResponseDto responseDto = new QueueResponseDto();

    if (queues == null || queues.isEmpty()) {
      return responseDto.queues(Collections.emptyList());
    }

    return responseDto.queues(queueDtoMapper.queuesToDto(queues));
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