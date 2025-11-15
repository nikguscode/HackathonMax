package service

import (
	"context"
	"fmt"
	"log"
	"net/http"

	"max-notification-service/internal/transport/maxbot"
)

// NotificationService предоставляет сервис для уведомлений через бота
// и отправки результатов обратно на backend.
type NotificationService struct {
	// bot является экземпляром maxbot.Bot для отправки уведомлений.
	bot *maxbot.Bot

	// BackendURL содержит адрес backend сервиса для callback.
	BackendURL string
}

// NewNotificationService создаёт новый экземпляр NotificationService.
//
// Параметры:
//   - bot: указатель на объект maxbot.Bot
//   - backURL: URL backend сервиса для callback
//
// Возвращает:
//   - указатель на созданный NotificationService
func NewNotificationService(bot *maxbot.Bot, backURL string) *NotificationService {
	return &NotificationService{
		bot:        bot,
		BackendURL: backURL,
	}
}

// StartNotify отправляет уведомление через бота.
//
// Этот метод используется для маршрута /notify.
//
// Параметры:
//   - idMax: идентификатор пользователя в системе MAX
//
// Возвращает:
//   - ошибку, если отправка уведомления завершилась неудачей
func (s *NotificationService) StartNotify(idMax int64) error {
	log.Printf("StartNotify called with idMax=%d", idMax)
	return s.bot.SendComeOverRequest(context.Background(), idMax)
}

// MemberAnswer обрабатывает ответ участника и отправляет его на backend.
//
// Этот метод используется для маршрута /callback.
//
// Параметры:
//   - idMax: идентификатор пользователя в системе MAX
//   - answer: ответ пользователя
func (s *NotificationService) MemberAnswer(idMax int64, answer string) {
	log.Printf("MemberAnswer: idMax=%d, answer=%s", idMax, answer)

	url := fmt.Sprintf("http://%s/callback?id_max=%d&answer=%s", s.BackendURL, idMax, answer)
	resp, err := http.Get(url)
	if err != nil {
		log.Printf("Failed to send: %v", err)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		log.Printf("Returned error status: %s", resp.Status)
	} else {
		log.Printf("Sent successfully: %s", url)
	}
}
