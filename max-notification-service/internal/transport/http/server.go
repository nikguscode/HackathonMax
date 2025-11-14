package http

import (
	"log"
	"net/http"
	"strconv"
)

type Server struct {
	addr    string
	onStart func(idMax int64) error
	onReply func(idMax int64, answer string)
}

func NewServer(addr string,
	onStart func(idMax int64) error,
	onReply func(idMax int64, answer string)) *Server {

	return &Server{addr: addr, onStart: onStart, onReply: onReply}
}

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
