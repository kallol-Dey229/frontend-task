"use client";

import { useEffect, useState } from "react";
import { icons } from "./Icons";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
};

const navigationGroups = [
  {
    title: "Studio",
    items: [
      { label: "Image Studio", icon: icons.image, pro: true },
      { label: "Video Studio", icon: icons.video, pro: true },
      { label: "Compare models", icon: icons.compare },
    ],
  },
  {
    title: "Engagement",
    items: [
      { label: "Tasks", icon: icons.tasks },
      { label: "Job analysis", icon: icons.job },
      { label: "SOP Builder", icon: icons.tasks },
    ],
  },
  {
    title: "Workspace",
    items: [
      { label: "Chat", icon: icons.chat },
      { label: "History", icon: icons.history },
      { label: "Connectors", icon: icons.connectors },
    ],
  },
  {
    title: "Help & Support",
    items: [
      { label: "Support", icon: icons.help },
      { label: "Newsletter", icon: icons.mail },
      { label: "Subscriptions", icon: icons.store },
      { label: "API Platform", icon: icons.connectors },
      { label: "Discord", icon: icons.discord },
    ],
  },
];

export default function Sidebar({ isOpen, onClose, onNewChat }: SidebarProps) {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return true;

    try {
      return localStorage.getItem("echogpt-theme") !== "light";
    } catch {
      return true;
    }
  });
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("Chat");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);

    try {
      localStorage.setItem("echogpt-theme", dark ? "dark" : "light");
    } catch {
      // The theme still works when browser storage is unavailable.
    }
  }, [dark]);

  function startNewChat() {
    onNewChat();
    setActiveItem("Chat");
  }

  return (
    <>
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-black/50 z-20 md:hidden cursor-pointer"
          onClick={onClose}
          aria-label="Close navigation"
        />
      )}

      <aside
        className={`fixed md:static z-30 h-full w-64 shrink-0 flex flex-col gap-3.5 p-3
        bg-white border-r border-[#E4E0F0] dark:bg-[#17151F] dark:border-[#2B2736]
        transition-transform duration-200 ease-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        ${collapsed ? "md:hidden" : ""}`}
        aria-label="Primary navigation"
      >
        <div className="flex items-center gap-2.5 px-1.5 pt-1 pb-0.5">
          <div className="w-7.5 h-7.5 rounded-[9px] bg-linear-to-br from-[#7C5CFF] to-[#4B2FD0] text-white font-extrabold text-sm flex items-center justify-center shrink-0">
            E
          </div>
          <span className="font-bold text-[16px] tracking-tight">EchoGPT</span>
        </div>

        <button
          type="button"
          onClick={startNewChat}
          className="flex items-center justify-center gap-2 py-2.5 rounded-[9px] text-white text-sm font-semibold bg-[#6D3CF0] hover:bg-[#5B2CE0] dark:bg-[#7C5CFF] dark:hover:bg-[#6A47F5] transition-colors cursor-pointer"
        >
          {icons.plus} New chat
        </button>

        <nav className="flex-1 overflow-y-auto flex flex-col gap-4">
          {navigationGroups.map((group) => (
            <div key={group.title}>
              <h2 className="text-[11px] font-semibold text-[#6B6579] dark:text-[#9C96AC] ml-2 mb-1.5">
                {group.title}
              </h2>
              {group.items.map((item) => {
                const isActive = activeItem === item.label;

                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setActiveItem(item.label);
                      onClose();
                    }}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-[9px] text-[13.5px] transition-colors cursor-pointer ${
                      isActive
                        ? "bg-[#EDE6FF] text-[#6D3CF0] dark:bg-[#241D42] dark:text-[#7C5CFF]"
                        : "text-[#6B6579] dark:text-[#9C96AC] hover:bg-[#F1EEF9] hover:text-[#1B1726] dark:hover:bg-[#1E1B29] dark:hover:text-[#F1EEF9]"
                    }`}
                  >
                    <span className="shrink-0 opacity-90">{item.icon}</span>
                    {item.label}
                    {item.pro && (
                      <span className="ml-auto text-[9.5px] font-bold text-amber-500 border border-current rounded-[5px] px-1">
                        PRO
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="border-t border-[#E4E0F0] dark:border-[#2B2736] pt-2.5 flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveItem("Chat")}
            aria-label="Home"
            title="Home"
            className="w-8.5 h-8.5 rounded-[10px] flex items-center justify-center cursor-pointer text-[#6B6579] dark:text-[#9C96AC] hover:bg-[#F1EEF9] dark:hover:bg-[#1E1B29]"
          >
            {icons.home}
          </button>
          <button
            type="button"
            onClick={() => setActiveItem("Connectors")}
            aria-label="Connectors"
            title="Connectors"
            className="w-8.5 h-8.5 rounded-[10px] flex items-center justify-center cursor-pointer text-[#6B6579] dark:text-[#9C96AC] hover:bg-[#F1EEF9] dark:hover:bg-[#1E1B29]"
          >
            {icons.connectors}
          </button>
          <button
            type="button"
            onClick={() => setCollapsed(true)}
            aria-label="Collapse sidebar"
            className="hidden md:flex w-8.5 h-8.5 rounded-[10px] items-center justify-center cursor-pointer text-[#6B6579] dark:text-[#9C96AC] hover:bg-[#F1EEF9] dark:hover:bg-[#1E1B29]"
          >
            {icons.panel}
          </button>
          <button
            type="button"
            onClick={() => setDark((currentTheme) => !currentTheme)}
            aria-label="Toggle color theme"
            className="w-8.5 h-8.5 rounded-[10px] flex items-center justify-center cursor-pointer text-[#6B6579] dark:text-[#9C96AC] hover:bg-[#F1EEF9] dark:hover:bg-[#1E1B29]"
          >
            {icons.sun}
          </button>
          <button
            type="button"
            className="ml-auto text-[13px] font-semibold px-3 py-1.5 rounded-[9px] cursor-pointer bg-[#F1EEF9] dark:bg-[#1E1B29] hover:opacity-80 transition-opacity"
          >
            Sign in
          </button>
        </div>
      </aside>

      {collapsed && (
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          aria-label="Expand sidebar"
          className="hidden md:flex fixed left-2 top-3 z-20 w-9 h-9 rounded-[10px] items-center justify-center cursor-pointer bg-white border border-[#E4E0F0] text-[#6B6579] dark:bg-[#17151F] dark:border-[#2B2736] dark:text-[#9C96AC]"
        >
          {icons.menu}
        </button>
      )}
    </>
  );
}