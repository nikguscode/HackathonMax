package com.nikguscode.orchestrator.service;

import com.nikguscode.openapi.model.QueueResponseDto;
import com.nikguscode.orchestrator.dao.queue.QueueDao;
import com.nikguscode.orchestrator.mapper.QueueDtoMapper;
import com.nikguscode.orchestrator.model.Queue;
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

    if (queues.isEmpty()) {
      return responseDto.queues(Collections.emptyList());
    }

    return responseDto.queues(queueDtoMapper.queuesToDto(queues));
  }
}