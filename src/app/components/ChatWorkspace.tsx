"use client";

import { useEffect, useRef, useState } from "react";
import { icons } from "./Icons";

export type ChatMessage = {
  id: number;
  role: "user" | "bot";
  text: string;
};

type ChatWorkspaceProps = {
  messages: ChatMessage[];
  typing: boolean;
  onSend: (message: string) => void;
  onOpenSidebar: () => void;
};

const models = [
  { id: "echogpt", name: "EchoGPT", color: "#7C5CFF" },
  { id: "gpt5", name: "GPT-5", color: "#10A37F" },
  { id: "claude", name: "Claude", color: "#D97757" },
  { id: "gemini", name: "Gemini", color: "#4285F4" },
];

const suggestions = [
  {
    icon: icons.target,
    title: "Unlock your creative flow",
    body: "Receive custom prompts that reflect your writing style and help you push past creative blocks.",
    prompt: "Give me three punchy taglines for a productivity app.",
  },
  {
    icon: icons.job,
    title: "Build a resume that shines",
    body: "Craft a resume tailored to highlight your experience and match the job you want.",
    prompt: "Help me rewrite my resume summary for a product design role.",
  },
  {
    icon: icons.target,
    title: "Set a challenge that transforms you",
    body: "Create a personalized challenge based on your goals and habits.",
    prompt: "Set me a 7-day challenge to build a morning routine.",
  },
  {
    icon: icons.spark,
    title: "Write irresistible social content",
    body: "Generate catchy, clever captions for your photos or videos.",
    prompt: "Write three Instagram captions for a coffee shop's new seasonal latte.",
  },
];

export default function ChatWorkspace({ messages, typing, onSend, onOpenSidebar }: ChatWorkspaceProps) {
  const [selectedModel, setSelectedModel] = useState("echogpt");
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const activeModelName = models.find((model) => model.id === selectedModel)?.name ?? "EchoGPT";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (!textareaRef.current) return;

    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
  }, [input]);

  function sendMessage(message = input) {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    onSend(trimmedMessage);
    setInput("");
  }

  return (
    <main className="flex-1 flex flex-col min-w-0">
      <header className="flex items-center gap-2.5 px-4 md:px-5 py-3 border-b border-[#E4E0F0] dark:border-[#2B2736]">
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="Open navigation"
          className="md:hidden w-9 h-9 rounded-[10px] flex items-center justify-center cursor-pointer text-[#6B6579] dark:text-[#9C96AC]"
        >
          {icons.menu}
        </button>

        <div role="tablist" aria-label="Choose AI model" className="flex items-center gap-1 p-1 rounded-xl overflow-x-auto max-w-[52vw] md:max-w-none bg-[#F1EEF9] dark:bg-[#1E1B29]">
          {models.map((model) => (
            <button
              key={model.id}
              type="button"
              role="tab"
              aria-selected={selectedModel === model.id}
              onClick={() => setSelectedModel(model.id)}
              className={`flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 rounded-[9px] text-[13px] font-semibold transition-colors cursor-pointer ${
                selectedModel === model.id
                  ? "bg-white dark:bg-[#17151F] shadow-sm text-[#1B1726] dark:text-[#F1EEF9]"
                  : "text-[#6B6579] dark:text-[#9C96AC]"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: model.color }} />
              {model.name}
            </button>
          ))}
        </div>

        <div className="flex-1" />
        <span className="hidden sm:inline text-[11px] font-bold text-amber-500 border border-amber-500 rounded-full px-2 py-0.5">
          50 free queries left
        </span>
        <button type="button" className="text-[13.5px] font-semibold text-white px-4 py-2 rounded-[10px] cursor-pointer transition-colors bg-[#6D3CF0] hover:bg-[#5B2CE0] dark:bg-[#7C5CFF] dark:hover:bg-[#6A47F5]">
          Sign in
        </button>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 pt-5">
        <div className="max-w-175 mx-auto w-full">
          {messages.length === 0 && (
            <div className="text-center pt-[6vh]">
              <h1 className="text-2xl md:text-[28px] font-bold tracking-tight mb-1.5">Hello there 👋</h1>
              <p className="text-[15px] text-[#6B6579] dark:text-[#9C96AC] mb-7">
                Ask anything — {activeModelName} will route it to the best model.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.title}
                    type="button"
                    onClick={() => sendMessage(suggestion.prompt)}
                    className="text-left rounded-[14px] p-4 cursor-pointer transition-all hover:-translate-y-0.5 bg-white border border-[#E4E0F0] hover:border-[#6D3CF0] dark:bg-[#17151F] dark:border-[#2B2736] dark:hover:border-[#7C5CFF]"
                  >
                    <div className="w-7.5 h-7.5 rounded-lg flex items-center justify-center mb-2.5 bg-[#EDE6FF] text-[#6D3CF0] dark:bg-[#241D42] dark:text-[#7C5CFF]">
                      {suggestion.icon}
                    </div>
                    <h2 className="text-sm font-semibold mb-1">{suggestion.title}</h2>
                    <p className="text-[12.5px] text-[#6B6579] dark:text-[#9C96AC] leading-relaxed">
                      {suggestion.body}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4.5 py-1.5 pb-5" aria-live="polite">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-3 max-w-full ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-[11px] font-bold ${
                  message.role === "user"
                    ? "bg-[#F1EEF9] text-[#6B6579] dark:bg-[#1E1B29] dark:text-[#9C96AC]"
                    : "bg-linear-to-br from-[#7C5CFF] to-[#4B2FD0] text-white"
                }`}>
                  {message.role === "user" ? "You" : "E"}
                </div>
                <div className={`px-4 py-2.5 rounded-2xl text-[14.5px] leading-relaxed max-w-[78%] ${
                  message.role === "user"
                    ? "bg-[#6D3CF0] dark:bg-[#7C5CFF] text-white rounded-br-sm"
                    : "bg-white border border-[#E4E0F0] dark:bg-[#17151F] dark:border-[#2B2736] rounded-bl-sm"
                }`}>
                  {message.text}
                </div>
              </div>
            ))}
            {typing && <TypingIndicator />}
          </div>
        </div>
      </div>

      <div className="border-t px-4 pt-3 pb-[calc(16px+env(safe-area-inset-bottom))] border-[#E4E0F0] dark:border-[#2B2736]">
        <div className="max-w-175 mx-auto flex items-end gap-2 rounded-[18px] pl-3.5 pr-2 py-2 transition-colors bg-white border border-[#E4E0F0] focus-within:border-[#6D3CF0] dark:bg-[#17151F] dark:border-[#2B2736] dark:focus-within:border-[#7C5CFF]">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Ask a question…"
            aria-label="Message EchoGPT"
            className="flex-1 bg-transparent outline-none resize-none text-[14.5px] leading-relaxed py-2 max-h-35 cursor-text"
          />
          <button type="button" aria-label="Voice input" className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 cursor-pointer text-[#6B6579] dark:text-[#9C96AC] hover:bg-[#F1EEF9] dark:hover:bg-[#1E1B29]">
            {icons.mic}
          </button>
          <button
            type="button"
            onClick={() => sendMessage()}
            disabled={!input.trim()}
            aria-label="Send message"
            className="w-9 h-9 rounded-xl text-white shrink-0 flex items-center justify-center transition-colors bg-[#6D3CF0] hover:bg-[#5B2CE0] dark:bg-[#7C5CFF] dark:hover:bg-[#6A47F5] disabled:opacity-40 disabled:cursor-not-allowed enabled:cursor-pointer"
          >
            {icons.send}
          </button>
        </div>
        <p className="max-w-175 mx-auto text-center text-[11.5px] text-[#6B6579] dark:text-[#9C96AC] mt-2">
          EchoGPT can make mistakes. Verify important information.
        </p>
      </div>
    </main>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="w-7 h-7 rounded-lg bg-linear-to-br from-[#7C5CFF] to-[#4B2FD0] text-white flex items-center justify-center text-[11px] font-bold">
        E
      </div>
      <div className="px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 bg-white border border-[#E4E0F0] dark:bg-[#17151F] dark:border-[#2B2736]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#9C96AC] animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#9C96AC] animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#9C96AC] animate-bounce" />
      </div>
    </div>
  );
}