package com.nikguscode.orchestrator.core.mapper;

import com.nikguscode.openapi.model.QueueDto;
import com.nikguscode.openapi.model.QueueMemberDto;
import com.nikguscode.orchestrator.dao.result.QueueMemberRecord;
import com.nikguscode.orchestrator.core.model.Queue;
import java.util.List;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface QueueDtoMapper {
  List<QueueDto> queuesToDto(List<Queue> queues);

  List<QueueMemberDto> membersToDto(List<QueueMemberRecord> memberRecords);
}