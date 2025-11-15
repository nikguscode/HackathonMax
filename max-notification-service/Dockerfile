# Stage 1: build
FROM golang:1.25.4-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o max-notification-service ./cmd/app/main.go

# Stage 2: runtime
FROM alpine:3.20

WORKDIR /app

COPY --from=builder /app/max-notification-service .

EXPOSE 8082

CMD ["./max-notification-service"]