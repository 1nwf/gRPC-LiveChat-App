import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { ChatServiceClient } from "../my-generated-code/chat_pb_service";
import { User } from "../my-generated-code/chat_pb";
import { ChatMessage } from "../my-generated-code/chat_pb";
import { useSelector } from "react-redux";
import { useAppSelector } from "../src/state/hooks";
import { useRouter } from "next/router";
import Message from "../src/components/Message";
const client = new ChatServiceClient("http://localhost:8080");
const Home: NextPage = () => {
  const router = useRouter();
  const username = useAppSelector((state) => state.user.username);
  useEffect(() => {
    console.log("username: ");
    if (!username || username === "") {
      router.push("/signIn");
    }
  }, [username]);
  const [chatMsgs, setChatMsgs] = useState<ChatMessage[]>([]);
  const [msg, setMsg] = useState("");

  const chatUser = new User();
  chatUser.setUsername(username);
  useEffect(() => {
    const chatStream = client.joinChat(chatUser);
    (() => {
      chatStream.on("data", (msg) => {
        console.log("reciver msg: " + msg.getBody());
        setChatMsgs((chatMsgs) => [...chatMsgs, msg]);
      });
    })();
    (() => {
      chatStream.on("end", (status) => {
        console.log("stream ended: ", status);
      });
    })();
  }, []);

  const loadMessages = () => {};
  const sendMessage = (e: any) => {
    e.preventDefault();
    const chatMsg = new ChatMessage();
    chatMsg.setBody(msg);
    chatMsg.setUser(chatUser);
    client.sendToChat(chatMsg, {}, (err, res) => {
      if (err) {
        console.log("error", err);
      } else {
        console.log("message send");
      }
    });
  };
  return (
    <div className="mx12">
      <h1>{username}</h1>
      <form>
        <input
          placeholder="type message"
          className="rounded-xl mr-2 border border-gray-400 p-2"
          type="text"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <button
          className="p-3 text-sm rounded-xl text-white bg-blue-500"
          onClick={sendMessage}
        >
          Send
        </button>
      </form>
      {chatMsgs.map((msg, idx) => (
        <div className="flex" key={idx}>
          <Message msg={msg} />
        </div>
      ))}
    </div>
  );
};
export default Home;
