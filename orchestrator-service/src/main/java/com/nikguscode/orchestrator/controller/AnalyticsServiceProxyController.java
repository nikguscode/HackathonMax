package com.nikguscode.orchestrator.controller;

import com.nikguscode.openapi.model.QueueGraphicsAverageWaitingTimeByTimeInnerDto;
import com.nikguscode.openapi.model.QueueGraphicsDto;
import com.nikguscode.openapi.model.QueueGraphicsMembersInQueueByTimeInnerDto;
import com.nikguscode.openapi.model.QueueGraphicsResponseDto;
import com.nikguscode.openapi.model.QueueMetricsDto;
import com.nikguscode.openapi.model.QueueMetricsResponseDto;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.UUID;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/api")
public class AnalyticsServiceProxyController {
  @GetMapping("/queues/{queueId}/metrics")
  public QueueMetricsResponseDto getQueueMetrics(@PathVariable UUID queueId) {
    return new QueueMetricsResponseDto().metrics(new QueueMetricsDto()
        .waitingTime(1f)
        .entriesInTheQueue(1)
        .numberOfServedMembers(1)
        .serviceTime(1f)
        .totalLeft(3)
        .maxInQueue(2)
        .minInQueue(1)
        .averageInQueue(3));
  }

//  private final Random random = new Random();
//  private static final int DATA_POINTS = 10; // Количество точек данных
//
//  @GetMapping("/queues/{queueId}/graphics")
//  public QueueGraphicsResponseDto getQueueGraphics(@PathVariable UUID queueId) {
//
//    OffsetDateTime now = OffsetDateTime.now(ZoneOffset.UTC);
//
//    // 1. Генерируем данные о количестве участников (целые числа)
//    List<QueueGraphicsMembersInQueueByTimeInnerDto> membersData =
//        generateMembersInQueueData(now, DATA_POINTS, 0, 15);
//
//    // 2. Генерируем данные о среднем времени ожидания (числа с плавающей точкой)
//    List<QueueGraphicsAverageWaitingTimeByTimeInnerDto> waitingTimeData =
//        generateAverageWaitingTimeData(now, DATA_POINTS, 0.5f, 15.0f);
//
//    QueueGraphicsDto graphicsDto = new QueueGraphicsDto();
//    graphicsDto.membersInQueueByTime(membersData);
//    graphicsDto.averageWaitingTimeByTime(waitingTimeData);
//
//    // Предполагается, что QueueGraphicsResponseDto имеет поле graphics типа QueueGraphicsDto
//    return new QueueGraphicsResponseDto().graphics(graphicsDto);
//  }
//
//  // --- Генерация данных для membersInQueueByTime (Count) ---
//  private List<QueueGraphicsMembersInQueueByTimeInnerDto> generateMembersInQueueData(
//      OffsetDateTime endTime,
//      int hoursBack,
//      int minCount,
//      int maxCount
//  ) {
//    List<QueueGraphicsMembersInQueueByTimeInnerDto> data = new ArrayList<>();
//
//    // Генерируем точки, отступая на 1 час назад
//    for (int i = hoursBack; i >= 0; i--) {
//      OffsetDateTime time = endTime.minusHours(i);
//      // Случайное целое число
//      int count = random.nextInt(maxCount - minCount + 1) + minCount;
//
//      QueueGraphicsMembersInQueueByTimeInnerDto entry =
//          new QueueGraphicsMembersInQueueByTimeInnerDto()
//              .time(time)
//              .count(count); // Поле 'count'
//
//      data.add(entry);
//    }
//    return data;
//  }
//
//  // --- Генерация данных для averageWaitingTimeByTime (WaitingTime) ---
//  private List<QueueGraphicsAverageWaitingTimeByTimeInnerDto> generateAverageWaitingTimeData(
//      OffsetDateTime endTime,
//      int hoursBack,
//      float minTime,
//      float maxTime
//  ) {
//    List<QueueGraphicsAverageWaitingTimeByTimeInnerDto> data = new ArrayList<>();
//
//    // Генерируем точки, отступая на 1 час назад
//    for (int i = hoursBack; i >= 0; i--) {
//      OffsetDateTime time = endTime.minusHours(i);
//
//      // Случайное значение с плавающей точкой
//      float waitingTime = minTime + random.nextFloat() * (maxTime - minTime);
//
//      // Округляем до одного знака для читаемости
//      waitingTime = Math.round(waitingTime * 10.0f) / 10.0f;
//
//      QueueGraphicsAverageWaitingTimeByTimeInnerDto entry =
//          new QueueGraphicsAverageWaitingTimeByTimeInnerDto()
//              .time(time)
//              .waitingTime(waitingTime); // Поле 'waitingTime'
//
//      data.add(entry);
//    }
//    return data;
//  }
}