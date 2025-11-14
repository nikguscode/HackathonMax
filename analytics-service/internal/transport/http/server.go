package http

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// Server оборачивает стандартный http.Server для удобного управления запуском и остановкой.
type Server struct {
	httpServer *http.Server
}

// NewServer создаёт новый HTTP сервер с указанным маршрутизатором и портом.
//
// Параметры:
//   - handler — Gin Engine с настроенными маршрутами.
//   - port — порт, на котором будет слушать сервер.
//
// Возвращает:
//   - указатель на Server с настроенными таймаутами:
//     ReadTimeout: 10s, WriteTimeout: 10s, IdleTimeout: 60s
func NewServer(handler *gin.Engine, port int) *Server {
	return &Server{
		httpServer: &http.Server{
			Addr:         fmt.Sprintf(":%d", port),
			Handler:      handler,
			ReadTimeout:  10 * time.Second,
			WriteTimeout: 10 * time.Second,
			IdleTimeout:  60 * time.Second,
		},
	}
}

// Start запускает HTTP сервер и блокирует выполнение до его остановки.
// Возвращает ошибку, если сервер завершился с ошибкой.
func (s *Server) Start() error {
	log.Printf("Starting HTTP server on %s", s.httpServer.Addr)
	return s.httpServer.ListenAndServe()
}

// Stop корректно останавливает сервер с использованием контекста для таймаута.
//
// Параметры:
//   - ctx — контекст для управления временем ожидания завершения работы сервера.
//
// Возвращает ошибку, если остановка сервера завершилась с ошибкой.
func (s *Server) Stop(ctx context.Context) error {
	log.Println("Stopping HTTP server...")
	return s.httpServer.Shutdown(ctx)
}
