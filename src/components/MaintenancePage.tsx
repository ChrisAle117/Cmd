import { useState, useEffect } from "react";
import {
  Github,
  Facebook,
  Linkedin,
  ExternalLink,
  Star,
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

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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

  const contactLinks = [
    {
      name: "GitHub",
      icon: Github,
      url: "https://github.com/ChrisAle117",
      color: "#22c55e", // green
    },
    {
      name: "Facebook",
      icon: Facebook,
      url: "https://www.facebook.com/christopher.quintanaruiz//",
      color: "#3b82f6", // blue
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: "https://www.linkedin.com/in/quintana-ruiz-christopher-alexis-816386301/",
      color: "#06b6d4", // cyan
    },
  ];

  return (
    <div className="h-screen bg-black text-primary">
      <div className="crt h-full m-4">
        <div className="terminal-content flicker h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-2 border-b border-border mb-8">
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

          {/* Main Content */}
          <div className="flex-1 flex flex-col justify-center items-center p-8">
            <div className="w-full max-w-3xl">
              {/* Maintenance Message */}
              <div className="startup-text mb-12">
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
                {currentLine < maintenanceLines.length && (
                  <span className="cursor w-2 h-4">&nbsp;</span>
                )}
              </div>

              {/* Contact Section */}
              {showContent && (
                <div className="animate-in fade-in duration-1000">
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

                    <div className="flex justify-center gap-6 flex-wrap">
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

                    {/* Footer */}
                    <div className="text-center mt-12 pt-8 border-t border-border">
                      <div className="font-mono text-xs text-muted-foreground">
                        <div className="mb-1">
                          © 2025 - Made with caffeine and
                          questionable life choices
                        </div>
                        <div>
                          Powered by 80s nostalgia and
                          procrastination
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Status Bar */}
          <div className="border-t border-border p-2 text-xs font-mono text-muted-foreground">
            <div className="flex justify-between items-center">
              <span>STATUS: MAINTENANCE_MODE</span>
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