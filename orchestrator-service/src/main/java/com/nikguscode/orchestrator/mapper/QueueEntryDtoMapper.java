package com.nikguscode.orchestrator.mapper;

import com.nikguscode.openapi.model.QueueEntryResponseDto;
import com.nikguscode.orchestrator.dao.result.QueueEntryActiveRecord;
import com.nikguscode.orchestrator.dao.result.QueueEntryRecord;
import org.mapstruct.Mapper;

@Mapper(
    componentModel = "spring",
    uses = {OrganizationDtoMapper.class, QueueEntryDtoMapper.class})
public interface QueueEntryDtoMapper {
  QueueEntryResponseDto queueActiveEntryToDto(QueueEntryActiveRecord queueActiveEntryRecord);
  QueueEntryResponseDto queueEntryToDto(QueueEntryRecord queueEntryRecord);
}