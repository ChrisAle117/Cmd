import { useState, useEffect } from "react";

interface StartupSequenceProps {
  onComplete: () => void;
}

const bootMessages = [
  "Chells's Corner - Personal Terminal v1.0",
  "",
  "Collecting your cookies...",
  "Session cookies collected successfully",
  "Uploading Instagram cookies...",
  "Exporting Whatsapp chats...",
  "",
  "Just kidding!",
  "I don't actually collect anything",
  "",
  "Loading coffee.exe...",
  "Checking motivation levels... LOW",
  "Initializing procrastination protocols...",
  "All systems ready for productive procrastination!",
  "",
  "Press any key to continue",
];

export function StartupSequence({
  onComplete,
}: StartupSequenceProps) {
  const [currentLine, setCurrentLine] = useState(0);
  const [displayedLines, setDisplayedLines] = useState<
    string[]
  >([]);
  const [showCursor, setShowCursor] = useState(true);
  const [canContinue, setCanContinue] = useState(false);

  useEffect(() => {
    if (currentLine < bootMessages.length) {
      const timer = setTimeout(
        () => {
          setDisplayedLines((prev) => [
            ...prev,
            bootMessages[currentLine],
          ]);
          setCurrentLine((prev) => prev + 1);
        },
        currentLine === 0 ? 1000 : Math.random() * 500 + 200,
      );

      return () => clearTimeout(timer);
    } else {
      setCanContinue(true);
    }
  }, [currentLine]);

  useEffect(() => {
    const handleKeyPress = () => {
      if (canContinue) {
        onComplete();
      } else {
        // Skip to end
        setDisplayedLines(bootMessages);
        setCurrentLine(bootMessages.length);
        setCanContinue(true);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("click", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("click", handleKeyPress);
    };
  }, [canContinue, onComplete]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <div className="h-full flex flex-col justify-center items-start p-8 startup-text">
      <div className="mb-8">
        <div className="text-2xl mb-2">CHELL'S CORNER</div>
        <div className="text-sm text-muted-foreground">
          Personal Terminal - Maintenance Mode Active
        </div>
      </div>

      <div className="space-y-1 w-full">
        {displayedLines.map((line, index) => (
          <div key={index} className="font-mono">
            {line}
          </div>
        ))}
        {currentLine < bootMessages.length && (
          <div className="font-mono">
            {showCursor && (
              <span className="cursor w-2 h-4">&nbsp;</span>
            )}
          </div>
        )}
      </div>

      {canContinue && (
        <div className="mt-8 text-sm text-muted-foreground animate-pulse">
          Click anywhere or press any key to continue...
        </div>
      )}
    </div>
  );
}