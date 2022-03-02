package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net"

	"gogrpc/chat"

	"github.com/go-redis/redis/v8"
	"google.golang.org/grpc"
)

type ChatServer struct {
	chat.UnimplementedChatServiceServer
}

type Message struct {
	Username string `json:"username"`
	Body     string `json:"body"`
}

func (msg *Message) UnmarshalBinary(data []byte) error {
	if err := json.Unmarshal(data, &msg); err != nil {
		return err
	}
	return nil
}

func (msg *Message) MarshalBinary() ([]byte, error) {
	return json.Marshal(msg)
}

var redisOptions = &redis.Options{
	Addr:     "localhost:6379",
	Password: "",
	DB:       0,
}
var redisClient = redis.NewClient(redisOptions)
var redisPub = redis.NewClient(redisOptions)

func (s *ChatServer) SayHello(ctx context.Context, in *chat.Message) (*chat.Message, error) {
	log.Printf("recieved message body from client %s", in.Body)
	body := "recieved " + in.Body
	return &chat.Message{Body: body}, nil
}

const redisChannel = "chatMsg"

func (s *ChatServer) SendToChat(ctx context.Context, in *chat.ChatMessage) (*chat.Empty, error) {
	if err := redisPub.Publish(ctx, redisChannel, in).Err(); err != nil {
		return &chat.Empty{}, err
	}
	fmt.Println("published message")
	return &chat.Empty{}, nil
}

func (s *ChatServer) JoinChat(user *chat.User, stream chat.ChatService_JoinChatServer) error {

	redisSub := redisClient.Subscribe(context.Background(), redisChannel)
	defer redisSub.Close()
	for msg := range redisSub.Channel() {
		var message chat.ChatMessage
		if err := json.Unmarshal([]byte(msg.Payload), &message); err != nil {
			panic(err)
		}
		cmsg := &chat.ChatMessage{
			Body: message.Body,
			User: message.User,
		}
		if err := stream.Send(cmsg); err != nil {
			fmt.Println("failed to send message")
			log.Fatal(err)
		}
	}
	return nil
}

func main() {
	lis, err := net.Listen("tcp", ":8000")
	if err != nil {
		log.Fatalf("failed  to listen %v", err)
	}
	s := ChatServer{}
	grpcServer := grpc.NewServer()
	chat.RegisterChatServiceServer(grpcServer, &s)
	if err := grpcServer.Serve(lis); err != nil {
		log.Fatal("gRPC server failed to listed on port :8000")
	}
}
