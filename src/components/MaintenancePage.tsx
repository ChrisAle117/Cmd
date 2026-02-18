import { useState, useEffect, useRef } from "react";
import {
  Github,
  Instagram,
  Linkedin,
  ExternalLink,
} from "lucide-react";

const maintenanceLines = [
  "SITE STATUS: WORK IN PROGRESS",
  "",
  "Hey there!",
  "You've stumbled into my digital workspace",
  "",
  "Currently tinkering with things behind the scenes...",
  "Probably chasing CG",
  "or getting distracted by yet another side project.",
  "But best guess, doom-scrolling brain-rots",
  "",
  "Check back soon - promise it'll be worth it!",
];

export function MaintenancePage() {
  const [currentLine, setCurrentLine] = useState(0);
  const [displayedLines, setDisplayedLines] = useState<
    string[]
  >([]);
  const [showContent, setShowContent] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Chat State
  const [currentInput, setCurrentInput] = useState("");
  const [chatHistory, setChatHistory] = useState<{ type: 'user' | 'bot' | 'system', text: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));
  const webhookUrl = "https://dockerfile-5rir.onrender.com/webhook/35ee142f-67f1-496a-8792-4d48b27090de/chat";

  const inputRef = useRef<HTMLInputElement>(null);
  const maintainanceContentRef = useRef<HTMLDivElement>(null);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to bottom on content change
  useEffect(() => {
    if (maintainanceContentRef.current) {
      maintainanceContentRef.current.scrollTop = maintainanceContentRef.current.scrollHeight;
    }
  }, [displayedLines, showContent, chatHistory, isLoading]);


  // Typewriter effect for maintenance message
  useEffect(() => {
    if (currentLine < maintenanceLines.length) {
      const timer = setTimeout(
        () => {
          setDisplayedLines((prev) => [
            ...prev,
            maintenanceLines[currentLine],
          ]);
          setCurrentLine((prev) => prev + 1);
        },
        currentLine === 0 ? 1000 : Math.random() * 300 + 150,
      );

      return () => clearTimeout(timer);
    } else {
      // Show contact section after message is complete
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentLine]);

  const sendMessageToWebhook = async (text: string) => {
    setIsLoading(true);
    setChatHistory((prev) => [...prev, { type: 'user', text }]);

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
      const botMessage = data.output || data.text || JSON.stringify(data);

      setChatHistory((prev) => [...prev, { type: 'bot', text: botMessage }]);
    } catch (error) {
      setChatHistory((prev) => [...prev, { type: 'system', text: "Error: Connection to AI server failed." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      const trimmedInput = currentInput.trim();
      if (!trimmedInput) return;

      // Directly send to webhook
      sendMessageToWebhook(trimmedInput);
      setCurrentInput('');
    }
  };

  const contactLinks = [
    {
      name: "GitHub",
      icon: Github,
      url: "https://github.com/ChrisAle117",
      color: "#22c55e", // green
    },
    {
      name: "Instagram",
      icon: Instagram,
      url: "https://www.instagram.com/chris_ale117/", // Update with actual handle if known, or generic
      color: "#e1306c", // Instagram pink/purple
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: "https://www.linkedin.com/in/quintana-ruiz-christopher-alexis-816386301/",
      color: "#06b6d4", // cyan
    },
  ];

  return (
    <div className="h-screen bg-black text-primary overflow-hidden">
      <div className="crt h-full m-4 flex flex-col">
        <div className="terminal-content flicker h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-2 border-b border-border mb-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="font-mono text-sm ml-4">
                Chells's Corner
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="font-mono">
                {currentTime.toLocaleTimeString()}
              </span>
              <span className="font-mono">
                {currentTime.toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div
            ref={maintainanceContentRef}
            className="flex-1 overflow-y-auto p-4 flex flex-col items-center"
            onClick={() => inputRef.current?.focus()}
          >
            <div className="w-full max-w-3xl">
              {/* Maintenance Message */}
              <div className="startup-text mb-8">
                {displayedLines.map((line, index) => (
                  <div key={index} className="mb-2 font-mono">
                    {index === 0 ? (
                      <div className="text-center text-xl text-red-400 mb-4">
                        {line}
                      </div>
                    ) : index === 2 ? (
                      <div className="text-2xl text-primary mb-2">
                        {line}
                      </div>
                    ) : index === 3 ? (
                      <div className="text-lg text-cyan-400 mb-4">
                        {line}
                      </div>
                    ) : (
                      <div className={line === "" ? "h-4" : ""}>
                        {line}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Contact Section */}
              {showContent && (
                <div className="animate-in fade-in duration-1000 mb-8">
                  <div className="border-t border-border pt-8">
                    <div className="text-center mb-8">
                      <h3 className="text-lg text-primary mb-2 font-mono">
                        // FIND_ME_HERE
                      </h3>
                      <p className="text-sm text-muted-foreground font-mono">
                        Hit me up if you want to chat about
                        code, projects, or random stuff
                      </p>
                    </div>

                    <div className="flex justify-center gap-6 flex-wrap mb-12">
                      {contactLinks.map((link, index) => (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex flex-col items-center p-3 border border-border rounded hover:bg-accent transition-all duration-200 hover:border-primary"
                          style={{
                            boxShadow: `0 0 10px ${link.color}20`,
                          }}
                        >
                          <link.icon
                            className="w-6 h-6 mb-2 transition-colors duration-200"
                            style={{ color: link.color }}
                          />
                          <span className="font-mono text-xs text-foreground group-hover:text-primary">
                            {link.name}
                          </span>
                          <ExternalLink className="w-2 h-2 mt-1 text-muted-foreground group-hover:text-primary" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Chat History */}
              {chatHistory.length > 0 && (
                <div className="mb-4 space-y-2 border-t border-border pt-4">
                  {chatHistory.map((msg, i) => (
                    <div key={i} className={`font-mono ${msg.type === 'user' ? 'text-cyan-400' : msg.type === 'system' ? 'text-muted-foreground' : 'text-primary'}`}>
                      {msg.type === 'user' ? '> ' : ''}{msg.text}
                    </div>
                  ))}
                </div>
              )}

              {/* Terminal Input Area */}
              {showContent && (
                <div
                  className="flex items-start mt-2 relative pb-8 font-mono"
                  onClick={() => inputRef.current?.focus()}
                >
                  <span className="mr-2 text-cyan-400 shrink-0">
                    Guest&gt;
                  </span>

                  {/* Línea de terminal - Simplified to standard input */}
                  <input
                    ref={inputRef}
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent border-none outline-none font-mono text-primary caret-primary p-0 m-0 w-full"
                    autoFocus
                    spellCheck={false}
                    autoComplete="off"
                  />

                  {/* Loading indicator */}
                  {isLoading && (
                    <span className="inline-block w-2 h-5 bg-primary ml-1 animate-pulse" />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Status Bar */}
          <div className="border-t border-border p-2 text-xs font-mono text-muted-foreground shrink-0">
            <div className="flex justify-between items-center">
              <span>STATUS: AI_ACTIVE</span>
              <span>
                UPTIME: {Math.floor(Date.now() / 1000)} sec
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}