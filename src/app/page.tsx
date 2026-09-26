"use client";

import { useState } from "react";
import ChatWorkspace, { type ChatMessage } from "./components/ChatWorkspace";
import Sidebar from "./components/Sidebar";

export default function EchoGPTPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);

  function sendMessage(message: string) {
    setMessages((currentMessages) => [
      ...currentMessages,
      { id: Date.now(), role: "user", text: message },
    ]);
    setTyping(true);

    setTimeout(() => {
      setTyping(false);
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: Date.now() + 1,
          role: "bot",
          text: "This is a prototype reply — wire this up to your model API to get a real response.",
        },
      ]);
    }, 900);
  }

  return (
    <div className="flex h-dvh overflow-hidden font-sans bg-[#F6F5FB] text-[#1B1726] dark:bg-[#0E0D13] dark:text-[#F1EEF9]">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNewChat={() => setMessages([])}
      />
      <ChatWorkspace
        messages={messages}
        typing={typing}
        onSend={sendMessage}
        onOpenSidebar={() => setSidebarOpen(true)}
      />
    </div>
  );
}