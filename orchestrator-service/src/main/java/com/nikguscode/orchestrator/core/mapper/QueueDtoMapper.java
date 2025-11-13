package com.nikguscode.orchestrator.core.mapper;

import com.nikguscode.openapi.model.QueueCreatingRequestDto;
import com.nikguscode.openapi.model.QueueDto;
import com.nikguscode.openapi.model.QueueMemberDto;
import com.nikguscode.openapi.model.QueueResponseDto;
import com.nikguscode.orchestrator.core.model.Organization;
import com.nikguscode.orchestrator.core.model.Queue;
import com.nikguscode.orchestrator.core.model.QueueParams;
import com.nikguscode.orchestrator.dao.result.QueueMemberRecord;
import com.nikguscode.orchestrator.dao.result.QueueMetricsRecord;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface QueueDtoMapper {
  @Mapping(target = "organizationId", source = "organization.id")
  @Mapping(target = "organizationName", source = "organization.name")
  QueueResponseDto toQueueResponse(Organization organization, List<QueueDto> queues);

  @Mapping(target = "id", source = "queueId")
  @Mapping(target = "name", source = "dto.name")
  Queue toEntity(
      UUID queueId, UUID organizationId, QueueCreatingRequestDto dto, OffsetDateTime createdAt);

  @Mapping(target = "id", source = "paramsId")
  @Mapping(target = "arrivalGracePeriod", source = "dto.arrivalGracePeriod")
  @Mapping(target = "maxQueueSize", source = "dto.maxQueueSize")
  QueueParams toEntity(UUID paramsId, UUID queueId, QueueCreatingRequestDto dto);

  List<QueueDto> toQueueDto(List<QueueMetricsRecord> queues);

  List<QueueMemberDto> toQueueMemberDto(List<QueueMemberRecord> memberRecords);
}