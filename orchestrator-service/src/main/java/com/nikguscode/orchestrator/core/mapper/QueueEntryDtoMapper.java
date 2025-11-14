package com.nikguscode.orchestrator.core.mapper;

import com.nikguscode.jooq.enums.QueueEntryStatus;
import com.nikguscode.openapi.model.QueueEntryResponseDto;
import com.nikguscode.openapi.model.QueueEntryStatusDto;
import com.nikguscode.orchestrator.dao.result.QueueEntryActiveRecord;
import com.nikguscode.orchestrator.dao.result.QueueEntryRecord;
import org.mapstruct.Mapper;

@Mapper(
    componentModel = "spring",
    uses = {OrganizationDtoMapper.class, QueueEntryDtoMapper.class})
public interface QueueEntryDtoMapper {
  QueueEntryResponseDto queueActiveEntryToDto(QueueEntryActiveRecord queueActiveEntryRecord);

  QueueEntryResponseDto entryToDto(QueueEntryRecord queueEntryRecord);

  QueueEntryStatus toEnum(QueueEntryStatusDto dtoStatus);
}