
import React, { useState, useEffect } from 'react';
import { Calculator, Download, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ApsCalculatorService } from '@/services/ApsCalculatorService';
import { NSC_SUBJECTS } from '@/constants/constants';

export const ApsCalculator: React.FC = () => {
  const [subjects, setSubjects] = useState<Array<{ subject: string; level: number }>>([]);
  const [apsScore, setApsScore] = useState<number>(0);

  const addSubject = () => {
    if (subjects.length < 7) {
      setSubjects([...subjects, { subject: '', level: 0 }]);
    }
  };

  const removeSubject = (index: number) => {
    const newSubjects = subjects.filter((_, i) => i !== index);
    setSubjects(newSubjects);
  };

  const updateSubject = (index: number, field: 'subject' | 'level', value: string | number) => {
    const newSubjects = [...subjects];
    newSubjects[index] = { ...newSubjects[index], [field]: value };
    setSubjects(newSubjects);
  };

  const calculateAPS = () => {
    const validSubjects = subjects.filter(s => s.subject && s.level > 0);
    const score = ApsCalculatorService.calculateAPS(validSubjects);
    setApsScore(score);
  };

  useEffect(() => {
    // Initialize with one empty subject
    if (subjects.length === 0) {
      setSubjects([{ subject: '', level: 0 }]);
    }
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calculator className="h-5 w-5" />
          <span>APS Calculator</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {subjects.map((subject, index) => (
            <div key={index} className="flex space-x-2 items-center">
              <Select
                value={subject.subject}
                onValueChange={(value) => updateSubject(index, 'subject', value)}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {NSC_SUBJECTS.map((subjectName) => (
                    <SelectItem key={subjectName} value={subjectName}>
                      {subjectName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select
                value={subject.level.toString()}
                onValueChange={(value) => updateSubject(index, 'level', parseInt(value))}
              >
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7].map((level) => (
                    <SelectItem key={level} value={level.toString()}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {subjects.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeSubject(index)}
                  className="text-red-600"
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={addSubject}
            disabled={subjects.length >= 7}
            variant="outline"
            size="sm"
          >
            Add Subject
          </Button>
          <Button onClick={calculateAPS} className="flex items-center space-x-2">
            <Calculator className="h-4 w-4" />
            <span>Calculate APS</span>
          </Button>
        </div>

        {apsScore > 0 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800">
              Your APS Score: {apsScore}
            </h3>
            <p className="text-sm text-blue-600 mt-1">
              Based on {subjects.filter(s => s.subject && s.level > 0).length} subjects
            </p>
            
            <div className="flex space-x-2 mt-3">
              <Button size="sm" variant="outline" className="flex items-center space-x-1">
                <Save className="h-4 w-4" />
                <span>Save</span>
              </Button>
              <Button size="sm" variant="outline" className="flex items-center space-x-1">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </Button>
            </div>
          </div>
        )}
        
        <div className="text-xs text-gray-500 mt-4">
          <p>* APS calculations are estimates. Consult universities for official requirements.</p>
        </div>
      </CardContent>
    </Card>
  );
};
