package service

import "encoding/json"

// данные об организации
type OrganizationInfo struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

// данные о очереди
type QueueInfo struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

// сериализует любую структуру в JSON
func ToJSON(v any) ([]byte, error) {
	return json.Marshal(v)
}

// возвращает форматированный JSON
func PrettyJSON(v any) (string, error) {
	data, err := json.MarshalIndent(v, "", "  ")
	if err != nil {
		return "", err
	}
	return string(data), nil
}
