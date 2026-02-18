import { useState, useEffect, useRef } from "react";


interface TerminalLine {
  type: "command" | "output" | "system";
  text: string;
  timestamp?: string;
}

const initialLines: TerminalLine[] = [
  {
    type: "system",
    text: "RETRO-OS v2.1.3 (c) 1985 Retro Computing Corp.",
  },
  { type: "system", text: "Memory: 640K Base, 384K Extended" },
  { type: "system", text: "System Ready." },
  { type: "system", text: "" },
  { type: "output", text: "Welcome to RETRO-TERMINAL" },
  {
    type: "output",
    text: 'Type "help" for available commands',
  },
  { type: "system", text: "" },
];

const commands = {
  help: {
    description: "Show available commands",
    output: [
      "Available commands:",
      "  help     - Show this help message",
      "  about    - About this terminal",
      "  ls       - List directory contents",
      "  date     - Show current date and time",
      "  clear    - Clear terminal screen",
      "  matrix   - Start matrix animation",
      "  whoami   - Display current user",
      "  echo     - Echo text back",
      "  calc     - Simple calculator (e.g., calc 2+2)",
      "  chat     - Enter AI Chat Mode",
    ],
  },
  about: {
    description: "About this terminal",
    output: [
      "RETRO-TERMINAL v1.0",
      "A nostalgic CRT-style terminal interface",
      "Built with modern web technologies",
      "Featuring authentic yellow phosphor display",
    ],
  },
  ls: {
    description: "List directory contents",
    output: [
      "drwxr-xr-x  2 user user  4096 Aug 24 2025 documents/",
      "drwxr-xr-x  2 user user  4096 Aug 24 2025 projects/",
      "-rw-r--r--  1 user user  1024 Aug 24 2025 readme.txt",
      "-rw-r--r--  1 user user  2048 Aug 24 2025 config.sys",
      "-rwxr-xr-x  1 user user  8192 Aug 24 2025 startup.exe",
    ],
  },
  date: {
    description: "Show current date and time",
    output: () => [new Date().toString()],
  },
  whoami: {
    description: "Display current user",
    output: ["retro_user@terminal-2004"],
  },
};

export function Terminal() {
  const [lines, setLines] =
    useState<TerminalLine[]>(initialLines);
  const [currentInput, setCurrentInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<
    string[]
  >([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isChatMode, setIsChatMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));
  const [matrixMode, setMatrixMode] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const webhookUrl = "https://dockerfile-5rir.onrender.com/webhook/35ee142f-67f1-496a-8792-4d48b27090de/chat";

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop =
        terminalRef.current.scrollHeight;
    }
  }, [lines, isLoading]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const sendMessageToWebhook = async (text: string) => {
    setIsLoading(true);
    setLines((prev) => [
      ...prev,
      {
        type: "command",
        text: `AI-CHAT> ${text}`,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "sendMessage",
          chatInput: text,
          sessionId: sessionId,
        }),
      });

      const data = await response.json();

      // Assuming standard n8n chat response structure, modify if needed based on actual response
      // Usually it returns an array of messages or a single text field
      const botMessage = data.output || data.text || JSON.stringify(data);

      setLines((prev) => [
        ...prev,
        {
          type: "output",
          text: botMessage,
        },
      ]);
    } catch (error) {
      setLines((prev) => [
        ...prev,
        {
          type: "system",
          text: "Error: Connection to AI server failed.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommand = (input: string) => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    // Chat function
    if (isChatMode) {
      if (trimmedInput.toLowerCase() === "exit") {
        setIsChatMode(false);
        setLines((prev) => [
          ...prev,
          { type: "system", text: "Exiting Chat Mode..." },
          { type: "system", text: "Returned to RETRO-OS." },
        ]);
        return;
      }

      sendMessageToWebhook(trimmedInput);
      return;
    }

    const [cmd, ...args] = trimmedInput
      .toLowerCase()
      .split(" ");
    const timestamp = new Date().toLocaleTimeString();

    // Add command to history
    setCommandHistory((prev) => [...prev, input]);
    setHistoryIndex(-1);

    // Add command line
    setLines((prev) => [
      ...prev,
      {
        type: "command",
        text: `C:\\> ${input}`,
        timestamp,
      },
    ]);

    // Process command
    if (cmd === "clear") {
      setLines([]);
      return;
    }

    if (cmd === "chat") {
      setIsChatMode(true);
      setLines((prev) => [
        ...prev,
        { type: "system", text: "Initializing AI Uplink..." },
        { type: "system", text: "Connection Established." },
        { type: "output", text: "Type 'exit' to return to system." },
      ]);
      return;
    }

    if (cmd === "matrix") {
      setMatrixMode(true);
      setLines((prev) => [
        ...prev,
        {
          type: "output",
          text: "Entering matrix mode... Press ESC to exit",
        },
      ]);
      return;
    }

    if (cmd === "echo") {
      setLines((prev) => [
        ...prev,
        {
          type: "output",
          text: args.join(" ") || "ECHO is on.",
        },
      ]);
      return;
    }

    if (cmd === "calc") {
      const expression = args.join("");
      try {
        // Simple calculator - only allow basic operations
        const result = Function(
          '"use strict"; return (' +
          expression.replace(/[^0-9+\-*/().]/g, "") +
          ")",
        )();
        setLines((prev) => [
          ...prev,
          {
            type: "output",
            text: `${expression} = ${result}`,
          },
        ]);
      } catch {
        setLines((prev) => [
          ...prev,
          {
            type: "output",
            text: "Invalid expression",
          },
        ]);
      }
      return;
    }

    if (cmd in commands) {
      const command = commands[cmd as keyof typeof commands];
      const output =
        typeof command.output === "function"
          ? command.output()
          : command.output;

      output.forEach((line: string) => {
        setLines((prev) => [
          ...prev,
          { type: "output", text: line },
        ]);
      });
    } else if (cmd) {
      setLines((prev) => [
        ...prev,
        {
          type: "output",
          text: `Bad command or file name: ${cmd}`,
        },
      ]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCommand(currentInput);
      setCurrentInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex =
          historyIndex === -1
            ? commandHistory.length - 1
            : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setCurrentInput("");
        } else {
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[newIndex]);
        }
      }
    } else if (e.key === "Escape" && matrixMode) {
      setMatrixMode(false);
      setLines((prev) => [
        ...prev,
        { type: "output", text: "Matrix mode disabled" },
      ]);
    }
  };

  if (matrixMode) {
    return (
      <MatrixAnimation onExit={() => setMatrixMode(false)} />
    );
  }

  return (
    <div
      ref={terminalRef}
      className="h-full overflow-y-auto p-4 cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="startup-text">
        {lines.map((line, index) => (
          <div key={index} className="mb-1">
            {line.type === "command" && (
              <span className="text-primary">{line.text}</span>
            )}
            {line.type === "output" && (
              <span className="text-foreground">
                {line.text}
              </span>
            )}
            {line.type === "system" && (
              <span className="text-muted-foreground">
                {line.text}
              </span>
            )}
          </div>
        ))}

        <div className="flex items-center mt-2 relative">
          <span className={`mr-2 font-mono ${isChatMode ? "text-cyan-400" : "text-primary"}`}>
            {isChatMode ? "AI-CHAT>" : "C:\\>"}
          </span>

          <div className="flex-1 flex items-center relative">
            <span className="whitespace-pre-wrap font-mono text-primary">{currentInput}</span>
            <span className={`cursor w-2 h-5 align-middle ${isLoading ? "animate-pulse" : ""}`}>
              {isLoading ? "█" : "\u00A0"}
            </span>

            <input
              ref={inputRef}
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="absolute inset-0 opacity-0 cursor-default h-full w-full"
              autoFocus
              spellCheck={false}
              autoComplete="off"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function MatrixAnimation({ onExit }: { onExit: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const columns = Math.floor(canvas.width / 20);
    const drops: number[] = Array(columns).fill(1);

    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()";

    function draw() {
      if (!ctx || !canvas) return;

      ctx.fillStyle = "rgba(26, 26, 13, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#ffff99";
      ctx.font = "15px monospace";

      for (let i = 0; i < drops.length; i++) {
        const text =
          chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * 20, drops[i] * 20);

        if (
          drops[i] * 20 > canvas.height &&
          Math.random() > 0.975
        ) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    const interval = setInterval(draw, 35);

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onExit();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [onExit]);

  return (
    <div className="fixed inset-0 bg-black">
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute top-4 right-4 text-primary">
        Press ESC to exit
      </div>
    </div>
  );
}