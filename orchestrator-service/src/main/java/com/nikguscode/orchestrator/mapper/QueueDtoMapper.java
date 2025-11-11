package com.nikguscode.orchestrator.mapper;

import com.nikguscode.openapi.model.QueueDto;
import com.nikguscode.orchestrator.model.Queue;
import java.util.List;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface QueueDtoMapper {
  List<QueueDto> queuesToDto(List<Queue> queues);
}