import { useState } from 'react';
import { Folder, File, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';

interface FileItem {
  name: string;
  type: 'file' | 'folder';
  size?: string;
  date: string;
  content?: string;
  children?: FileItem[];
}

const fileSystem: FileItem = {
  name: 'C:',
  type: 'folder',
  date: '1985-03-15',
  children: [
    {
      name: 'SYSTEM',
      type: 'folder',
      date: '1985-03-15',
      children: [
        { name: 'CONFIG.SYS', type: 'file', size: '1.2KB', date: '1985-03-15', content: 'FILES=20\nBUFFERS=15\nDEVICE=HIMEM.SYS' },
        { name: 'AUTOEXEC.BAT', type: 'file', size: '856B', date: '1985-03-15', content: '@ECHO OFF\nPROMPT $P$G\nPATH=C:\\DOS;C:\\WINDOWS' },
        { name: 'COMMAND.COM', type: 'file', size: '47KB', date: '1985-03-15' },
      ]
    },
    {
      name: 'PROGRAMS',
      type: 'folder',
      date: '1985-04-20',
      children: [
        { name: 'WORDPROC.EXE', type: 'file', size: '124KB', date: '1985-04-20' },
        { name: 'CALC.EXE', type: 'file', size: '28KB', date: '1985-04-20' },
        { name: 'GAMES.EXE', type: 'file', size: '89KB', date: '1985-04-20' },
      ]
    },
    {
      name: 'DOCUMENTS',
      type: 'folder',
      date: '1985-05-10',
      children: [
        { name: 'LETTER.TXT', type: 'file', size: '2.1KB', date: '1985-05-10', content: 'Dear Friend,\n\nI hope this letter finds you well in this digital age of 1985...' },
        { name: 'NOTES.TXT', type: 'file', size: '1.5KB', date: '1985-05-12', content: 'Meeting notes:\n- Discuss new computer project\n- Review budget allocations\n- Plan for next quarter' },
        { name: 'BUDGET.WKS', type: 'file', size: '4.8KB', date: '1985-05-15' },
      ]
    },
    { name: 'README.TXT', type: 'file', size: '3.2KB', date: '1985-03-15', content: 'Welcome to RETRO-OS!\n\nThis is a simulated retro computing environment.\nExplore the file system and discover hidden files.\n\nHave fun!' },
  ]
};

export function FileExplorer() {
  const [currentPath, setCurrentPath] = useState<FileItem[]>([fileSystem]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  const currentFolder = currentPath[currentPath.length - 1];
  const files = currentFolder.children || [];

  const navigateToFolder = (folder: FileItem) => {
    setCurrentPath(prev => [...prev, folder]);
    setSelectedFile(null);
  };

  const navigateBack = () => {
    if (currentPath.length > 1) {
      setCurrentPath(prev => prev.slice(0, -1));
      setSelectedFile(null);
    }
  };

  const handleFileClick = (file: FileItem) => {
    if (file.type === 'folder') {
      navigateToFolder(file);
    } else {
      setSelectedFile(file);
    }
  };

  const currentPathString = currentPath.map(p => p.name).join('\\');

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-border p-2 bg-card">
        <div className="flex items-center gap-2 mb-2">
          <Button
            variant="outline"
            size="sm"
            onClick={navigateBack}
            disabled={currentPath.length <= 1}
            className="h-6 px-2"
          >
            <ArrowLeft className="w-3 h-3" />
          </Button>
          <span className="font-mono text-sm">{currentPathString}</span>
        </div>
        <div className="text-xs text-muted-foreground">
          {files.length} item(s)
        </div>
      </div>

      <div className="flex-1 flex">
        {/* File List */}
        <div className="w-1/2 border-r border-border">
          <div className="grid grid-cols-4 gap-2 p-2 text-xs border-b border-border bg-muted">
            <div>Name</div>
            <div>Type</div>
            <div>Size</div>
            <div>Date</div>
          </div>
          
          <div className="overflow-y-auto max-h-full">
            {files.map((file, index) => (
              <div
                key={index}
                className={`grid grid-cols-4 gap-2 p-2 text-xs hover:bg-accent cursor-pointer border-b border-border/50 ${
                  selectedFile === file ? 'bg-accent' : ''
                }`}
                onClick={() => handleFileClick(file)}
              >
                <div className="flex items-center gap-1 truncate">
                  {file.type === 'folder' ? (
                    <Folder className="w-3 h-3 text-primary" />
                  ) : (
                    <File className="w-3 h-3 text-muted-foreground" />
                  )}
                  <span className="font-mono">{file.name}</span>
                </div>
                <div className="font-mono">{file.type.toUpperCase()}</div>
                <div className="font-mono">{file.size || '-'}</div>
                <div className="font-mono">{file.date}</div>
              </div>
            ))}
          </div>
        </div>

        {/* File Content Viewer */}
        <div className="w-1/2 p-4">
          {selectedFile ? (
            <div className="h-full flex flex-col">
              <div className="mb-4">
                <h3 className="font-mono mb-1">{selectedFile.name}</h3>
                <div className="text-xs text-muted-foreground">
                  Size: {selectedFile.size} | Modified: {selectedFile.date}
                </div>
              </div>
              
              {selectedFile.content ? (
                <div className="flex-1 bg-card border border-border p-3 overflow-y-auto">
                  <pre className="font-mono text-xs whitespace-pre-wrap">
                    {selectedFile.content}
                  </pre>
                </div>
              ) : (
                <div className="flex-1 bg-card border border-border p-3 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <File className="w-8 h-8 mx-auto mb-2" />
                    <div className="text-sm">Binary file</div>
                    <div className="text-xs">Cannot display content</div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Folder className="w-12 h-12 mx-auto mb-4" />
                <div>Select a file to view its contents</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}