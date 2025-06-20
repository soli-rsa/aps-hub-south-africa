
import React from 'react';
import { Calculator, Search } from 'lucide-react';
import { AppMode } from '@/pages/Index';

interface QualificationSelectorProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

export const QualificationSelector: React.FC<QualificationSelectorProps> = ({
  currentMode,
  onModeChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        What would you like to do?
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => onModeChange('aps')}
          className={`p-6 rounded-lg border-2 transition-all duration-200 min-h-[120px] ${
            currentMode === 'aps'
              ? 'border-blue-500 bg-blue-50 shadow-md'
              : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
          }`}
        >
          <div className="flex flex-col items-center space-y-3">
            <Calculator className={`h-8 w-8 ${currentMode === 'aps' ? 'text-blue-600' : 'text-gray-500'}`} />
            <div className="text-center">
              <h3 className="font-semibold text-gray-800">Calculate APS Score</h3>
              <p className="text-sm text-gray-600 mt-1">
                Calculate your Admission Point Score for university applications
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={() => onModeChange('university')}
          className={`p-6 rounded-lg border-2 transition-all duration-200 min-h-[120px] ${
            currentMode === 'university'
              ? 'border-green-500 bg-green-50 shadow-md'
              : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
          }`}
        >
          <div className="flex flex-col items-center space-y-3">
            <Search className={`h-8 w-8 ${currentMode === 'university' ? 'text-green-600' : 'text-gray-500'}`} />
            <div className="text-center">
              <h3 className="font-semibold text-gray-800">Find Universities</h3>
              <p className="text-sm text-gray-600 mt-1">
                Search and save your favorite South African universities
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};
