package client

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

type TelegramClient struct {
	token   string
}

func NewTelegramClient(token string) *TelegramClient {
	return &TelegramClient{
		token:   token,
	}
}

func (c *TelegramClient) SendMessage(chatID int64, text string) error {
	url := fmt.Sprintf("https://api.telegram.org/bot%s/sendMessage", c.token)
	message := map[string]interface{}{
		"chat_id": chatID,
		"text":    text,
	}
	payload, err := json.Marshal(message)
	if err != nil {
		return fmt.Errorf("error marshalling message: %v", err)
	}

	resp, err := http.Post(url, "application/json", bytes.NewBuffer(payload))
	if err != nil {
		return fmt.Errorf("error sending request: %v", err)
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("error reading response body: %v", err)
	}

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("error sending message: %s, response: %s", resp.Status, body)
	}

	return nil
}

