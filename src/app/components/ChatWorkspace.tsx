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
  onNewChat: () => void;
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

export default function ChatWorkspace({ messages, typing, onSend, onOpenSidebar, onNewChat }: ChatWorkspaceProps) {
  const [selectedModel, setSelectedModel] = useState("echogpt");
  const [input, setInput] = useState("");
  const [activeMenu, setActiveMenu] = useState<"connectors" | "prompts" | "history" | null>(null);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const [attachmentName, setAttachmentName] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
    setAttachmentName("");
  }

  function selectAttachment(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) setAttachmentName(file.name);
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
        <div className="relative max-w-175 mx-auto rounded-[18px] bg-white border border-[#E4E0F0] dark:bg-[#17151F] dark:border-[#2B2736]">
          <div className="flex items-center gap-1.5 px-2.5 pt-2 pb-1">
            <div className="flex min-w-0 items-center gap-2 px-1.5 text-[13px] font-medium">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#6D3CF0] text-xs font-bold text-white dark:bg-[#7C5CFF]">E</span>
              <span>{activeModelName}</span>
              <span className="text-[#6B6579] dark:text-[#9C96AC]">⌄</span>
            </div>
            <span className="h-5 w-px bg-[#E4E0F0] dark:bg-[#2B2736]" />
            <input
              ref={fileInputRef}
              type="file"
              className="sr-only"
              onChange={selectAttachment}
              aria-label="Choose a file to attach"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Attach a file"
              title="Attach a file"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6B6579] hover:bg-[#F1EEF9] dark:text-[#9C96AC] dark:hover:bg-[#1E1B29]"
            >
              {icons.attach}
            </button>
            <button
              type="button"
              onClick={() => setActiveMenu(activeMenu === "connectors" ? null : "connectors")}
              aria-label="Open connectors"
              aria-expanded={activeMenu === "connectors"}
              title="Connectors"
              className={`flex h-8 w-8 items-center justify-center rounded-lg hover:bg-[#F1EEF9] dark:hover:bg-[#1E1B29] ${webSearchEnabled ? "text-[#6D3CF0] dark:text-[#9C82FF]" : "text-[#6B6579] dark:text-[#9C96AC]"}`}
            >
              {icons.connectors}
            </button>
            <button
              type="button"
              onClick={() => {
                setInput((currentInput) => currentInput || "Help me plan ");
                setActiveMenu(activeMenu === "prompts" ? null : "prompts");
                textareaRef.current?.focus();
              }}
              aria-label="Open prompt helper"
              aria-expanded={activeMenu === "prompts"}
              title="Prompt helper"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6D3CF0] hover:bg-[#F1EEF9] dark:text-[#9C82FF] dark:hover:bg-[#1E1B29]"
            >
              {icons.spark}
            </button>
            <div className="flex-1" />
            <button
              type="button"
              onClick={onNewChat}
              aria-label="Start a new chat"
              title="New chat"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6B6579] hover:bg-[#F1EEF9] dark:text-[#9C96AC] dark:hover:bg-[#1E1B29]"
            >
              {icons.plus}
            </button>
            <button
              type="button"
              onClick={() => setActiveMenu(activeMenu === "history" ? null : "history")}
              aria-label="Show recent prompts"
              aria-expanded={activeMenu === "history"}
              title="Recent prompts"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6B6579] hover:bg-[#F1EEF9] dark:text-[#9C96AC] dark:hover:bg-[#1E1B29]"
            >
              {icons.clock}
            </button>
          </div>

          {activeMenu === "connectors" && (
            <div className="absolute left-12 top-12 z-10 w-56 rounded-lg border border-[#E4E0F0] bg-white p-3 shadow-lg dark:border-[#2B2736] dark:bg-[#17151F]">
              <p className="mb-2 text-xs font-semibold">Connectors</p>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-[#6B6579] dark:text-[#C3BDCF]">
                <input type="checkbox" checked={webSearchEnabled} onChange={(event) => setWebSearchEnabled(event.target.checked)} />
                Web search
              </label>
            </div>
          )}
          {activeMenu === "prompts" && (
            <div className="absolute left-24 top-12 z-10 w-56 rounded-lg border border-[#E4E0F0] bg-white p-3 shadow-lg dark:border-[#2B2736] dark:bg-[#17151F]">
              <p className="mb-2 text-xs font-semibold">Prompt helper</p>
              <p className="text-xs leading-relaxed text-[#6B6579] dark:text-[#C3BDCF]">Tell EchoGPT what you want to plan, write, or learn. Add a goal and any important details.</p>
            </div>
          )}
          {activeMenu === "history" && (
            <div className="absolute right-2 top-12 z-10 w-64 rounded-lg border border-[#E4E0F0] bg-white p-3 shadow-lg dark:border-[#2B2736] dark:bg-[#17151F]">
              <p className="mb-2 text-xs font-semibold">Recent prompts</p>
              {messages.filter((message) => message.role === "user").slice(-3).reverse().map((message) => (
                <button
                  key={message.id}
                  type="button"
                  onClick={() => {
                    setInput(message.text);
                    setActiveMenu(null);
                    textareaRef.current?.focus();
                  }}
                  className="block w-full truncate rounded px-2 py-1.5 text-left text-xs text-[#6B6579] hover:bg-[#F1EEF9] dark:text-[#C3BDCF] dark:hover:bg-[#1E1B29]"
                >
                  {message.text}
                </button>
              ))}
              {!messages.some((message) => message.role === "user") && (
                <p className="text-xs text-[#6B6579] dark:text-[#9C96AC]">Your prompts will appear here.</p>
              )}
            </div>
          )}

          {attachmentName && (
            <div className="mx-3 flex items-center gap-2 border-t border-[#E4E0F0] px-1 py-2 text-xs dark:border-[#2B2736]">
              <span className="min-w-0 flex-1 truncate">Attached: {attachmentName}</span>
              <button type="button" aria-label="Remove attachment" onClick={() => setAttachmentName("")} className="rounded p-1 hover:bg-[#F1EEF9] dark:hover:bg-[#1E1B29]">
                {icons.close}
              </button>
            </div>
          )}

          <div className="mx-2 mb-2 flex items-end gap-2 rounded-[14px] border border-[#E4E0F0] px-3.5 py-2 focus-within:border-[#6D3CF0] dark:border-[#2B2736] dark:focus-within:border-[#7C5CFF]">
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