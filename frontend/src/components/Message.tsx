import React from "react";
import { ChatMessage } from "../../my-generated-code/chat_pb";

export default function Message({ msg }: { msg: ChatMessage }) {
  return (
    <div className="flex">
      <p className="mr-1 font-bold">{msg.getUser()?.getUsername()}:</p>
      <div>{msg.getBody()}</div>
    </div>
  );
}
