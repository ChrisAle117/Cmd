import { useState } from 'react';
import { StartupSequence } from './components/StartupSequence';
import { MaintenancePage } from './components/MaintenancePage';

export default function App() {
  const [showStartup, setShowStartup] = useState(true);

  if (showStartup) {
    return (
      <div className="h-screen bg-black text-primary">
        <div className="crt h-full m-4">
          <div className="terminal-content flicker h-full">
            <StartupSequence onComplete={() => setShowStartup(false)} />
          </div>
        </div>
      </div>
    );
  }

  return <MaintenancePage />;
}