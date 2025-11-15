package com.nikguscode.orchestrator.core.service.queue;

import com.nikguscode.openapi.model.QueueCreatingRequestDto;
import com.nikguscode.openapi.model.QueueDto;
import com.nikguscode.openapi.model.QueueMembersResponseDto;
import com.nikguscode.openapi.model.QueueResponseDto;
import com.nikguscode.openapi.model.QueueStaffDto;
import com.nikguscode.openapi.model.QueueStaffResponseDto;
import com.nikguscode.orchestrator.core.mapper.QueueDtoMapper;
import com.nikguscode.orchestrator.core.mapper.UserDtoMapper;
import com.nikguscode.orchestrator.core.model.Organization;
import com.nikguscode.orchestrator.core.model.Queue;
import com.nikguscode.orchestrator.core.model.QueueParams;
import com.nikguscode.orchestrator.dao.tables.organization.OrganizationDao;
import com.nikguscode.orchestrator.dao.tables.queue.QueueDao;
import com.nikguscode.orchestrator.dao.result.QueueMemberRecord;
import com.nikguscode.orchestrator.dao.result.QueueMetricsRecord;
import com.nikguscode.orchestrator.dao.result.StaffRecord;
import com.nikguscode.orchestrator.dao.tables.staff.StaffDao;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class QueueService {
  private final OrganizationDao organizationDao;
  private final QueueDao queueDao;
  private final StaffDao staffDao;
  private final QueueDtoMapper queueDtoMapper;
  private final UserDtoMapper userDtoMapper;

  public QueueService(
      @Qualifier("jooqOrganizationDao") OrganizationDao organizationDao,
      @Qualifier("jooqQueueDao") QueueDao queueDao,
      @Qualifier("jooqStaffDao") StaffDao staffDao,
      QueueDtoMapper queueDtoMapper,
      UserDtoMapper userDtoMapper) {
    this.organizationDao = organizationDao;
    this.queueDao = queueDao;
    this.staffDao = staffDao;
    this.queueDtoMapper = queueDtoMapper;
    this.userDtoMapper = userDtoMapper;
  }

  @Transactional
  public void createQueue(UUID organizationId, QueueCreatingRequestDto dto) {
    final UUID queueId = UUID.randomUUID();
    final UUID paramsId = UUID.randomUUID();
    OffsetDateTime currentDateTime = OffsetDateTime.now(ZoneId.of("Europe/London"));

    Queue queue = queueDtoMapper.toEntity(queueId, organizationId, dto, currentDateTime);
    QueueParams queueParams = queueDtoMapper.toEntity(paramsId, queue.getId(), dto);

    queueDao.createQueue(queue, queueParams);
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
    List<QueueDto> queueDtoList = queueDtoMapper.toQueueDto(queueRecords);
    System.out.println(queueDtoList);

    return queueDtoMapper.toQueueResponse(organizationOpt.get(), queueDtoList);
  }

  public QueueStaffResponseDto getStaff(UUID queueId) {
    List<StaffRecord> staffRecords = staffDao.findByQueueId(queueId);

    if (staffRecords.isEmpty()) {
      return new QueueStaffResponseDto();
    }

    List<QueueStaffDto> queueStaffList = userDtoMapper.toStaffDto(staffRecords);
    return new QueueStaffResponseDto().staff(queueStaffList);
  }

  public QueueMembersResponseDto getMembers(UUID queueId) {
    List<QueueMemberRecord> memberRecords = queueDao.findByQueueId(queueId);
    QueueMembersResponseDto responseDto = new QueueMembersResponseDto();

    if (memberRecords == null || memberRecords.isEmpty()) {
      return responseDto.members(Collections.emptyList());
    }

    return responseDto.members(queueDtoMapper.toQueueMemberDto(memberRecords));
  }
}