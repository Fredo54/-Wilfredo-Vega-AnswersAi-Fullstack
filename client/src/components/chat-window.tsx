import { Fragment, useEffect, useRef } from "react";
import { Message, ResponseState } from "../types";

export const ChatWindow = ({ messages }: { messages: Message[] }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div
      key={"chat-window"}
      className="flex flex-col justify-center items-center gap-y-4"
    >
      {messages &&
        messages.map((msg, index) => {
          return (
            <Fragment key={`chat-window-${index}-${msg.id}`}>
              <div className="w-full flex justify-end text-wrap">
                <p className="rounded-md  bg-green-500 p-4 mr-2">
                  {msg.message}
                </p>
              </div>
              <div className="w-full flex justify-start text-wrap">
                <p className="rounded-md bg-slate-800 p-4">
                  {msg.responseState === ResponseState.Pending
                    ? "thinking..."
                    : msg.response}
                </p>
              </div>
            </Fragment>
          );
        })}
      <div ref={messagesEndRef} />
    </div>
  );
};
