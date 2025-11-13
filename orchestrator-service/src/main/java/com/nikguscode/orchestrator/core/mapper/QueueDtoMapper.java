package com.nikguscode.orchestrator.core.mapper;

import com.nikguscode.openapi.model.QueueDto;
import com.nikguscode.openapi.model.QueueMemberDto;
import com.nikguscode.openapi.model.QueueResponseDto;
import com.nikguscode.orchestrator.core.model.Organization;
import com.nikguscode.orchestrator.dao.result.QueueMemberRecord;
import com.nikguscode.orchestrator.dao.result.QueueMetricsRecord;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface QueueDtoMapper {
  @Mapping(target = "organizationId", source = "organization.id")
  @Mapping(target = "organizationName", source = "organization.name")
  QueueResponseDto mapToQueueResponse(Organization organization, List<QueueDto> queues);

  List<QueueDto> queueMetricRecordToDto(List<QueueMetricsRecord> queues);

  List<QueueMemberDto> membersToDto(List<QueueMemberRecord> memberRecords);
}