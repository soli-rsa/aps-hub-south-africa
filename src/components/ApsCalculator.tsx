
import React, { useState, useEffect } from 'react';
import { Calculator, Download, Save, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  ApsCalculatorService,
  Subject,
  ApsResult,
  ApsCalculationResult,
} from '@/services/ApsCalculatorService';
import { UNIVERSITY_RULES, UniversityRule } from '@/constants/universityRules';
import { NSC_SUBJECTS as NSC_SUBJECT_NAMES } from '@/constants/constants'; // Renamed for clarity
import { encryptData, decryptData } from '@/services/EncryptionService';
import { toast } from 'sonner';

// Create a structured list of subjects with IDs
const AVAILABLE_SUBJECTS: Subject[] = NSC_SUBJECT_NAMES.map(name => ({
  id: name.toLowerCase().replace(/\s+/g, '_').replace(/-/g, '_'), // Ensure consistent ID format
  name: name,
  level: 0, // Default level
}));

// Special case for maths and maths-lit if their IDs are different in the service
AVAILABLE_SUBJECTS.find(s => s.name === 'Mathematics')!.id = 'maths';
AVAILABLE_SUBJECTS.find(s => s.name === 'Mathematical Literacy')!.id = 'maths_lit';


const initializeDefaultSubjects = (): Subject[] => {
  const defaultSubjects: Subject[] = [
    { id: 'maths', name: 'Mathematics', level: 0 },
    { id: 'maths_lit', name: 'Mathematical Literacy', level: 0 },
    { id: '', name: 'Select Subject', level: 0 },
    { id: '', name: 'Select Subject', level: 0 },
    { id: '', name: 'Select Subject', level: 0 },
    { id: '', name: 'Select Subject', level: 0 },
  ];
  // Ensure Life Orientation is one of the defaults if desired, or handle it via normal selection.
  // For now, 6 slots, with first two dedicated to maths types.
  return defaultSubjects.slice(0, 6); // Max 6 for this example
};

export const ApsCalculator: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>(initializeDefaultSubjects());
  const [calculationOutput, setCalculationOutput] = useState<ApsCalculationResult | null>(null);
  const [selectedUniversityId, setSelectedUniversityId] = useState<string>('general');

  useEffect(() => {
    const loadData = async () => {
      const encryptedSavedAPS = localStorage.getItem('apsResult');
      if (encryptedSavedAPS) {
        try {
          const decryptedString = await decryptData(encryptedSavedAPS);
          const savedResult: ApsResult = JSON.parse(decryptedString);

          if (savedResult && savedResult.subjects && savedResult.subjects.length > 0 && savedResult.calculationDetails) {
            setSubjects(savedResult.subjects);
            setSelectedUniversityId(savedResult.calculationDetails.universityRuleUsed.id || 'general');
            setCalculationOutput(savedResult.calculationDetails);
            toast.success('Previously saved APS data loaded.', { icon: <CheckCircle className="h-4 w-4" /> });
          } else {
            setSubjects(initializeDefaultSubjects());
          }
        } catch (error) {
          console.error('Failed to decrypt or parse saved APS data:', error);
          toast.error('Could not load saved APS data. It might be corrupted.', { icon: <AlertTriangle className="h-4 w-4" /> });
          localStorage.removeItem('apsResult');
          setSubjects(initializeDefaultSubjects());
        }
      } // No 'else' needed here, as subjects are initialized by useState if no saved data.
    };
    loadData();
  }, []);

  const addSubject = () => {
    if (subjects.length < 7) { // Max 7 subjects
      setSubjects([...subjects, { id: '', name: 'Select Subject', level: 0 }]);
    } else {
      toast.warning('You can add a maximum of 7 subjects.');
    }
  };

  const removeSubject = (index: number) => {
    const newSubjects = subjects.filter((_, i) => i !== index);
    setSubjects(newSubjects);
  };

  const updateSubject = (index: number, field: 'id' | 'level', value: string | number) => {
    let tempSubjects = [...subjects];
    const currentSubjectId = tempSubjects[index].id; // Get ID before potential change
    const newLevel = Number(value); // Ensure level is a number

    if (field === 'id') {
      const selectedSub = AVAILABLE_SUBJECTS.find(s => s.id === value);
      tempSubjects[index] = { ...tempSubjects[index], id: value as string, name: selectedSub?.name || 'Unknown Subject', level: tempSubjects[index].level }; // Preserve existing level on ID change
    } else if (field === 'level') {
      tempSubjects[index] = { ...tempSubjects[index], level: newLevel };

      // UI Constraint: If Maths or Maths Lit level is set > 0, set the other to 0.
      if (newLevel > 0) {
        const subjectBeingUpdatedId = tempSubjects[index].id; // ID of the subject whose level is now being set
        if (subjectBeingUpdatedId === 'maths') {
          const mathsLitIndex = tempSubjects.findIndex(s => s.id === 'maths_lit');
          if (mathsLitIndex !== -1 && tempSubjects[mathsLitIndex].level > 0) {
            tempSubjects[mathsLitIndex].level = 0;
            toast.info("Mathematical Literacy level automatically set to 0.", { duration: 3000 });
          }
        } else if (subjectBeingUpdatedId === 'maths_lit') {
          const mathsIndex = tempSubjects.findIndex(s => s.id === 'maths');
          if (mathsIndex !== -1 && tempSubjects[mathsIndex].level > 0) {
            tempSubjects[mathsIndex].level = 0;
            toast.info("Mathematics level automatically set to 0.", { duration: 3000 });
          }
        }
      }
    }
    setSubjects(tempSubjects);
  };

  const handleCalculateAPS = async () => {
    // Filter out subjects that haven't been fully selected (e.g., id is empty)
    const validSubjects = subjects.filter(s => s.id && s.level > 0);

    if (validSubjects.length === 0) {
      toast.error('Please add subjects and their levels to calculate APS.', { icon: <AlertTriangle className="h-4 w-4" /> });
      return;
    }

    // Validate subjects using the service before attempting calculation
    // Find the rule that will be used for validation and calculation
    const ruleToUse = UNIVERSITY_RULES.find(r => r.id === selectedUniversityId) || UNIVERSITY_RULES.find(r => r.id === 'general');
    const validationError = ApsCalculatorService.validateInputSubjects(validSubjects, ruleToUse || null);

    if (validationError) {
      toast.error(validationError, { icon: <AlertTriangle className="h-4 w-4" />, duration: 5000 });
      setCalculationOutput(null); // Clear previous results if validation fails
      return;
    }

    try {
      const result: ApsResult = ApsCalculatorService.generateApsResult(validSubjects, selectedUniversityId);
      setCalculationOutput(result.calculationDetails || null);

      if (result.calculationDetails) {
         toast.success(`APS calculated for ${result.calculationDetails.universityRuleUsed.name}!`, { icon: <CheckCircle className="h-4 w-4" /> });
      }

      // Encrypt and save the full ApsResult
      const encryptedResult = await encryptData(JSON.stringify(result));
      localStorage.setItem('apsResult', encryptedResult);

    } catch (error: any) {
      console.error('Error calculating APS or saving result:', error);
      toast.error(error.message || 'Failed to calculate APS. Please check subject inputs.', { icon: <AlertTriangle className="h-4 w-4" />, duration: 5000 });
      setCalculationOutput(null);
    }
  };

  // Function to handle saving to localStorage, could be tied to a save button
  const handleSaveResults = async () => {
    if (!calculationOutput) {
      toast.error("No APS data to save.", { icon: <AlertTriangle className="h-4 w-4" /> });
      return;
    }
    // Reconstruct ApsResult for saving, as calculationOutput is ApsCalculationResult
    // and subjects are in the main state.
    const resultToSave: ApsResult = {
      subjects: subjects, // current subjects in state
      calculationDetails: calculationOutput,
      // These fields were part of original ApsResult, fill them if needed or adjust ApsResult type
      totalAps: calculationOutput.aps,
      calculatedAt: new Date(),
    };

    try {
      const encryptedResult = await encryptData(JSON.stringify(resultToSave));
      localStorage.setItem('apsResult', encryptedResult);
      toast.success('APS data saved securely!', { icon: <Save className="h-4 w-4" /> });
    } catch (error) {
      console.error('Failed to save APS data securely:', error);
      toast.error('Failed to save APS data securely.', { icon: <AlertTriangle className="h-4 w-4" /> });
    }
  };


  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calculator className="h-5 w-5" />
          <span>APS Calculator</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label htmlFor="university-select" className="block text-sm font-medium text-gray-700 mb-1">
            Select University / Rule:
          </label>
          <Select
            value={selectedUniversityId}
            onValueChange={(value) => setSelectedUniversityId(value)}
          >
            <SelectTrigger id="university-select" className="w-full">
              <SelectValue placeholder="Select University Rule" />
            </SelectTrigger>
            <SelectContent>
              {UNIVERSITY_RULES.map((rule) => (
                <SelectItem key={rule.id} value={rule.id}>
                  {rule.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          {subjects.map((subject, index) => (
            <div key={index} className="grid grid-cols-[1fr_auto_auto] gap-2 items-center">
              <Select
                value={subject.id || ''}
                onValueChange={(value) => updateSubject(index, 'id', value)}
                // Prevent changing a Math/MathLit slot to a different subject if it's the one with a >0 level
                // This is an optional UX refinement, the core logic is on level change.
                disabled={(subject.id === 'maths' && subject.level > 0 && subjects.some(s => s.id === 'maths_lit' && s.level > 0)) ||
                          (subject.id === 'maths_lit' && subject.level > 0 && subjects.some(s => s.id === 'maths' && s.level > 0))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_SUBJECTS.map((sub) => (
                    <SelectItem
                      key={sub.id}
                      value={sub.id}
                    >
                      {sub.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select
                value={subject.level?.toString() || '0'}
                onValueChange={(value) => updateSubject(index, 'level', parseInt(value))}
                disabled={ // Disable level input if the other Maths subject has a level > 0
                  (subject.id === 'maths' && subjects.some(s => s.id === 'maths_lit' && s.level > 0)) ||
                  (subject.id === 'maths_lit' && subjects.some(s => s.id === 'maths' && s.level > 0))
                }
              >
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((level) => (
                    <SelectItem key={level} value={level.toString()}>
                      {level === 0 ? "N/A" : level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeSubject(index)}
                className="text-red-500 hover:text-red-700"
                title="Remove Subject"
              >
                &times;
              </Button>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={addSubject}
            disabled={subjects.length >= 7}
            variant="outline"
          >
            Add Subject
          </Button>
          <Button onClick={handleCalculateAPS} className="flex items-center space-x-2">
            <Calculator className="h-4 w-4" />
            <span>Calculate APS</span>
          </Button>
        </div>

        {calculationOutput && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-green-800">
              APS Score for {calculationOutput.universityRuleUsed.name}: {calculationOutput.aps}
            </h3>
            <p className="text-sm text-green-600 mt-1">
              Calculated using {calculationOutput.subjectsConsidered.length} subjects:
              <ul className="list-disc pl-5 mt-1">
                {calculationOutput.subjectsConsidered.map(s => (
                  <li key={s.id}>{s.name}: {s.level}</li>
                ))}
              </ul>
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Rule: {calculationOutput.universityRuleUsed.numberOfSubjectsToCount} subjects,
              {calculationOutput.universityRuleUsed.includeBestSubjectsOnly ? " best subjects only" : " all qualifying subjects"}.
              {calculationOutput.universityRuleUsed.excludedSubjects && calculationOutput.universityRuleUsed.excludedSubjects.length > 0 &&
               ` Excludes: ${calculationOutput.universityRuleUsed.excludedSubjects.join(', ')}.`}
            </p>
            
            <div className="flex space-x-2 mt-3">
              <Button onClick={handleSaveResults} size="sm" variant="outline" className="flex items-center space-x-1">
                <Save className="h-4 w-4" />
                <span>Save Current Results</span>
              </Button>
              {/* <Button size="sm" variant="outline" className="flex items-center space-x-1">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </Button> */}
            </div>
          </div>
        )}
        
        <div className="text-xs text-gray-500 mt-4">
          <p>* APS calculations are estimates. Consult universities for official requirements and use their specific APS calculators if available.</p>
          <p>* Ensure subject names and levels are entered accurately. Life Orientation is commonly excluded or handled differently by universities.</p>
        </div>
      </CardContent>
    </Card>
  );
};
