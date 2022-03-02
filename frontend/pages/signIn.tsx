import React, { useState } from "react";
import { useRouter } from "next/router";
import { useAppDispatch } from "../src/state/hooks";
import { setUserName } from "../src/state/slices/userSlice";
export default function SignIn() {
  const dipatch = useAppDispatch();
  const [username, setUsername] = useState("");
  const router = useRouter();
  const [err, setErr] = useState("");
  const joinChat = (e: any) => {
    e.preventDefault();
    if (!username) {
      setErr("username is required");
      return;
    }
    setErr("");
    dipatch(setUserName(username));
    router.push("/");
  };
  return (
    <div>
      <form>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button type="submit" onClick={joinChat}>
          Join Chat!
        </button>
      </form>
      {err && <p className="text-red-400">{err}</p>}
    </div>
  );
}
