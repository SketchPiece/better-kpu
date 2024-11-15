import { useEffect, useRef, type ComponentProps } from "react";
import AssistantAvatar from "../assistant-avatar";
import { cn } from "@/lib/utils";
import { Icons } from "../icons";
import type { Message } from "ai/react";
import Markdown from "react-markdown";

interface AiChatProps {
  messages: Message[];
  input: string;
  setInput: (input: string) => void;
  append: (message: Omit<Message, "id">) => void;
}

export default function AiChat({
  messages,
  input,
  setInput,
  append,
}: AiChatProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="pt-5">
      <div
        ref={messagesContainerRef}
        className="flex max-h-[60vh] min-h-[60vh] flex-col gap-6 overflow-auto px-3 py-8"
      >
        <Message
          role="assistant"
          content={
            "Hello!\nI am KPU AI, your dedicated assistant for all things related to Kwantlen Polytechnic University.\nHow can I assist you today?"
          }
        />
        {messages.map((message) => (
          <Message
            key={message.id}
            role={message.role === "user" ? "user" : "assistant"}
            content={message.content}
          />
        ))}
      </div>
      <MessageInput
        submitActive={input.length > 0}
        onMessageSubmit={() => {
          setInput("");
          void append({ role: "user", content: input });
        }}
        onChange={(e) => setInput(e.target.value)}
        value={input}
        className="!mt-0"
      />
    </div>
  );
}

interface MessageInputProps extends ComponentProps<"input"> {
  onMessageSubmit?: () => void;
  submitActive?: boolean;
}

function MessageInput({
  onMessageSubmit,
  submitActive,
  className,
  ...props
}: MessageInputProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onMessageSubmit?.();
      }}
      className={cn("relative", className)}
    >
      <input
        type="text"
        placeholder="Message KPU AI"
        className="w-full rounded-full border-none bg-[#F0F0F0] px-5 py-3 text-sm font-medium transition-all placeholder:text-[#989898] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:bg-[#2E2E2E] dark:placeholder:text-[#747474] dark:focus:ring-offset-dark-background"
        {...props}
      />
      <div className="absolute right-2 top-0 grid h-full place-items-center">
        <button
          className={cn(
            "rounded-full bg-black transition-opacity",
            !submitActive && "opacity-30",
          )}
          type="submit"
        >
          <Icons.arrowSend className="text-white" />
        </button>
      </div>
    </form>
  );
}

interface MessageProps {
  role: "user" | "assistant";
  content: string;
}

function Message({ role, content }: MessageProps) {
  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="rounded-full bg-[#F0F0F0] px-5 py-2.5 text-sm">
          <Markdown>{content}</Markdown>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <div>
        <AssistantAvatar className="h-12 w-12" />
      </div>
      <div className="whitespace-pre-wrap pt-2 text-sm">
        <Markdown>{content}</Markdown>
      </div>
    </div>
  );
}
