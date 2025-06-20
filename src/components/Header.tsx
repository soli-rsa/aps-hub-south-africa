
import React from 'react';
import { HelpCircle, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onToggleHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleHelp }) => {
  return (
    <header className="bg-white shadow-sm border-b-2 border-blue-100">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center max-w-4xl">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-800 hidden sm:inline">
            School is Cool
          </span>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleHelp}
          className="flex items-center space-x-2 text-blue-600 border-blue-200 hover:bg-blue-50"
        >
          <HelpCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Help</span>
        </Button>
      </div>
    </header>
  );
};
