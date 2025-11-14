package com.nikguscode.orchestrator.core.service.queue;

import org.springframework.stereotype.Service;

// свайп влево - обслужен
// добавить кнопку в статус пользователя, по

@Service
public class QueueProceedService {
  // получаем список QUEUE_ENTRY, которые либо SERVING, либо WAITING
  // классифицируем по id_queue
  // создаём структуру, которая хранит информацию об очереди и список её queue_entry
  // формируем коллекцию структур

  // смотрим два случая, если есть SERVING юзер, то выходим из метода
  // если нет SERVING юзера, то выбираем первого пользователя из WAITING (должны быть отсортированы по joined_at)
  // даём ему время на подход = arrivalGracePeriod, если не прибыл за это время, то меняем его QUEUE_ENTRY на MISSED
}