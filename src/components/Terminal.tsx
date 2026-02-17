import { useState, useEffect, useRef } from "react";
import { Input } from "./ui/input";

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
  const [matrixMode, setMatrixMode] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop =
        terminalRef.current.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleCommand = (input: string) => {
    const [cmd, ...args] = input
      .trim()
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

        <div className="flex items-center mt-2">
          <span className="text-primary mr-2">C:\&gt;</span>
          <Input
            ref={inputRef}
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border-none bg-transparent p-0 focus:ring-0 text-primary font-mono"
            style={{
              boxShadow: "none",
              outline: "none",
            }}
          />
          <span className="cursor w-2 h-4 ml-1">&nbsp;</span>
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