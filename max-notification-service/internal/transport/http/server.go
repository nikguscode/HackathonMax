package http

import (
	"log"
	"net/http"
	"strconv"
)

// Server представляет HTTP-сервер для обработки уведомлений и ответов участников.
type Server struct {
	// addr — адрес и порт, на котором будет слушать сервер.
	addr string

	// onStart вызывается при получении запроса на /notify с idMax.
	onStart func(idMax int64) error

	// onReply вызывается при получении запроса на /callback с idMax и ответом участника.
	onReply func(idMax int64, answer string)
}

// NewServer создаёт новый HTTP Server.
//
// Параметры:
//   - addr: адрес и порт, на котором будет работать сервер (например ":8080")
//   - onStart: функция обратного вызова для обработки уведомления /notify
//   - onReply: функция обратного вызова для обработки ответа участника /callback
//
// Возвращает:
//   - указатель на созданный Server
func NewServer(addr string,
	onStart func(idMax int64) error,
	onReply func(idMax int64, answer string)) *Server {

	return &Server{addr: addr, onStart: onStart, onReply: onReply}
}

// Start запускает HTTP-сервер и регистрирует маршруты:
//
// Маршруты:
//   - /notify: принимает idMax и вызывает onStart
//   - /callback: принимает idMax и answer, вызывает onReply
//   - /health: проверка доступности сервера, возвращает "ok"
//
// Возвращает:
//   - ошибку, если сервер не смог запуститься
func (s *Server) Start() error {
	http.HandleFunc("/notify", s.handleNotify)
	http.HandleFunc("/callback", s.handleCallback)

	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("ok"))
	})

	log.Println("HTTP listening on", s.addr)
	return http.ListenAndServe(s.addr, nil)
}

// handleNotify обрабатывает GET-запрос на /notify.
//
// Параметры запроса:
//   - id_max: идентификатор участника
//
// В случае ошибки возвращает HTTP статус 400 или 500.
func (s *Server) handleNotify(w http.ResponseWriter, r *http.Request) {
	raw := r.URL.Query().Get("id_max")
	idMax, err := strconv.ParseInt(raw, 10, 64)
	if err != nil {
		http.Error(w, "id_max invalid", 400)
		return
	}

	if err := s.onStart(idMax); err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	w.Write([]byte("ok"))
}

// handleCallback обрабатывает GET-запрос на /callback.
//
// Параметры запроса:
//   - id_max: идентификатор участника
//   - answer: ответ участника
//
// Вызывает onReply асинхронно в отдельной горутине.
func (s *Server) handleCallback(w http.ResponseWriter, r *http.Request) {
	raw := r.URL.Query().Get("id_max")
	answer := r.URL.Query().Get("answer")
	idMax, err := strconv.ParseInt(raw, 10, 64)
	if err != nil {
		http.Error(w, "id_max invalid", 400)
		return
	}

	go s.onReply(idMax, answer)
	w.Write([]byte("received"))
}
