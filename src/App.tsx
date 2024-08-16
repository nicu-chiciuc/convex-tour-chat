import {
  useQuery,
  useMutation,
  Authenticated,
  AuthLoading,
  Unauthenticated,
  useAction,
} from "convex/react";
import { api } from "../convex/_generated/api";
import { useEffect, useState } from "react";
import { faker } from "@faker-js/faker";
import { SignIn } from "./SignIn";
import { SignOut } from "./SignOut";

export default function App() {
  return (
    <>
      <AuthLoading>loading</AuthLoading>
      <Unauthenticated>
        <SignIn />
      </Unauthenticated>
      <Authenticated>
        <SignOut />
        <Content />
      </Authenticated>
    </>
  );
}

function Content() {
  const messages = useQuery(api.messages.list);
  const sendMessage = useMutation(api.messages.send);
  const likeMessage = useMutation(api.messages.like);
  const userInfo = useQuery(api.authInfo.currentUser);

  // const asdf = useH(api.)

  const userName = userInfo?.name ?? userInfo?.email ?? "Anonymous";

  const [newMessageText, setNewMessageText] = useState("");

  useEffect(() => {
    // Make sure scrollTo works on button click in Chrome
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 0);
  }, [messages]);

  return (
    <main className="chat">
      <header>
        <h1>Convex Chat</h1>
        <p>
          Connected as <strong>{userName}</strong>
        </p>
      </header>
      {messages?.map((message) => (
        <article
          key={message._id}
          className={message.author === userName ? "message-mine" : ""}
        >
          <div>{message.author}</div>

          <p>
            {message.body}
            <button
              onClick={async () => {
                await likeMessage({ liker: userName, messageId: message._id });
              }}
            >
              {message.likes ? <span>{message.likes}</span> : null} 🤍
            </button>
          </p>
        </article>
      ))}
      <SignIn />

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await sendMessage({ body: newMessageText, author: userName });
          setNewMessageText("");
        }}
      >
        <input
          value={newMessageText}
          onChange={async (e) => {
            const text = e.target.value;
            setNewMessageText(text);
          }}
          placeholder="Write a message…"
        />
        <button type="submit" disabled={!newMessageText}>
          Send
        </button>
      </form>

      <button
        onClick={async () => {
          fetch;
        }}
      />
    </main>
  );
}
