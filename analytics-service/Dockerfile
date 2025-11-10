# Stage 1: build
FROM golang:1.25.3-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o analytics_service ./cmd/app/main.go

# Stage 2: runtime
FROM alpine:3.20

WORKDIR /app

COPY --from=builder /app/analytics_service .
COPY .env .

EXPOSE 8081

CMD ["./analytics_service"]
