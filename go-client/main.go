package main

import (
	"bufio"
	"context"
	"fmt"
	"go-client/chat"
	"io"
	"log"
	"os"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

var ctx = context.Background()
var grpcClient chat.ChatServiceClient

func main() {
	user := chat.User{
		Username: "",
	}
	reader := bufio.NewReader(os.Stdin)
	fmt.Println("Welcome to the grpc livechat application")
	fmt.Print("Enter your username: ")
	fmt.Scanf("%s", &user.Username)
	var conn *grpc.ClientConn
	conn, err := grpc.Dial(":8000", grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("err connecting to the server %s", err)
	}
	defer conn.Close()
	grpcClient = chat.NewChatServiceClient(conn)
	fmt.Println("any string you type in this console will be send after you hit enter")
	go func() {
		chatStream, err := grpcClient.JoinChat(ctx, &user)
		if err != nil {
			log.Fatalf("err occured %s", err)
		}
		for {
			msg, err := chatStream.Recv()
			if err == io.EOF {
				break
			} else if err != nil {
				log.Fatalf("err occured %s", err)
			}
			fmt.Println(msg.GetUser().GetUsername()+":", msg.GetBody())
		}
	}()
	for {
		msg, _ := reader.ReadString('\n')
		msg = msg[:len(msg)-1]
		if msg == "exit" {
			break
		}
		_, err := grpcClient.SendToChat(ctx, &chat.ChatMessage{
			User: &user,
			Body: msg,
		})
		if err != nil {
			log.Fatalf("err occured %s", err)
		}
	}

}
