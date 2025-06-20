
import React from 'react';
import { X, HelpCircle, Calculator, School } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface HelpGuideProps {
  onClose: () => void;
}

export const HelpGuide: React.FC<HelpGuideProps> = ({ onClose }) => {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <HelpCircle className="h-5 w-5" />
          <span>Help Guide</span>
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Calculator className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-800">What is APS?</h3>
              <p className="text-sm text-gray-600 mt-1">
                APS (Admission Point Score) is a scoring system used by South African universities 
                to evaluate student applications. It's calculated based on your final NSC results, 
                with each subject level contributing points to your total score.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <School className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-800">How to Calculate APS</h3>
              <p className="text-sm text-gray-600 mt-1">
                Add the achievement levels of your best 6 subjects (excluding Life Orientation). 
                Each achievement level corresponds to points: Level 7 = 7 points, Level 6 = 6 points, etc. 
                The maximum APS score is 42 points.
              </p>
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-lg">
            <h4 className="font-semibold text-amber-800 mb-2">APS Score Guide</h4>
            <div className="text-sm text-amber-700 space-y-1">
              <p>• <strong>35-42:</strong> Excellent - Most programs available</p>
              <p>• <strong>30-34:</strong> Good - Many programs available</p>
              <p>• <strong>25-29:</strong> Average - Some programs available</p>
              <p>• <strong>Below 25:</strong> Limited program options</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Important Notes</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Each university has different APS requirements</li>
              <li>• Some programs require specific subjects</li>
              <li>• APS is just one admission criterion</li>
              <li>• Always check with universities for official requirements</li>
            </ul>
          </div>

          <div className="text-xs text-gray-500 italic">
            <p>
              <strong>Disclaimer:</strong> APS calculations provided are estimates. 
              Please consult universities and SAQA for official admission requirements and calculations.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
