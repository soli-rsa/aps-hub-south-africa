
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { QualificationSelector } from '@/components/QualificationSelector';
import { ApsCalculator } from '@/components/ApsCalculator';
import { UniversitySearch } from '@/components/UniversitySearch';
import { HelpGuide } from '@/components/HelpGuide';
import { Footer } from '@/components/Footer';

export type AppMode = 'aps' | 'university';

const Index = () => {
  const [currentMode, setCurrentMode] = useState<AppMode>('aps');
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    // Set page title
    document.title = 'School is Cool Educational Hub - APS Calculator & University Guide';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Header onToggleHelp={() => setShowHelp(!showHelp)} />
      
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            School is Cool Educational Hub
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Calculate your APS scores and find the perfect South African university for your future
          </p>
        </div>

        <QualificationSelector 
          currentMode={currentMode} 
          onModeChange={setCurrentMode} 
        />

        <div className="mt-8">
          {currentMode === 'aps' ? <ApsCalculator /> : <UniversitySearch />}
        </div>

        {showHelp && (
          <div className="mt-8">
            <HelpGuide onClose={() => setShowHelp(false)} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
