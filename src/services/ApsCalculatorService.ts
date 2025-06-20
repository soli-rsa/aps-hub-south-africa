
import { UNIVERSITY_RULES, UniversityRule } from '@/constants/universityRules';

// Define Subject type as required by the subtask
export interface Subject {
  id: string;
  name: string;
  level: number;
}

export interface ApsCalculationResult {
  aps: number;
  universityRuleUsed: UniversityRule;
  subjectsConsidered: Subject[];
}

export interface ApsResult { // Retaining this for localStorage, might need adjustment later
  totalAps: number; // This might become redundant or represent the 'general' APS
  subjects: Subject[]; // Changed from SubjectGrade to Subject
  calculatedAt: Date;
  universitySpecificAps?: Record<string, number>; // This might be replaced by ApsCalculationResult
  calculationDetails?: ApsCalculationResult; // Store the new detailed result
}

export class ApsCalculatorService {
  static validateInputSubjects(subjects: Subject[], universityRule: UniversityRule | null): string | null {
    for (const subject of subjects) {
      if (subject.level < 1 || subject.level > 7) {
        return `All subject levels must be between 1 and 7. Invalid level for ${subject.name}: ${subject.level}.`;
      }
    }

    const hasMaths = subjects.find(s => s.id === 'maths' && s.level > 0);
    const hasMathsLit = subjects.find(s => s.id === 'maths-lit' && s.level > 0);

    if (hasMaths && hasMathsLit) {
      return "You can only select Mathematics or Mathematical Literacy, not both.";
    }

    if (universityRule) {
      const effectiveSubjects = subjects.filter(subject => {
        const isExcluded = universityRule.excludedSubjects?.some(excludedId => excludedId === subject.id || subject.name.toLowerCase().replace(/\s+/g, '_') === excludedId);
        return !isExcluded && subject.level > 0;
      });

      if (effectiveSubjects.length < universityRule.numberOfSubjectsToCount) {
        return `At least ${universityRule.numberOfSubjectsToCount} subjects with a level greater than 0 (and not excluded) are required for ${universityRule.name}. You have ${effectiveSubjects.length}.`;
      }
    }
    return null;
  }

  static calculateApsScore(
    subjects: Subject[],
    universityId: string | null
  ): ApsCalculationResult {
    let universityRule: UniversityRule | undefined = UNIVERSITY_RULES.find(rule => rule.id === 'general');
    if (!universityRule) {
      // This should ideally not happen if 'general' is guaranteed to be in UNIVERSITY_RULES
      throw new Error("Default 'general' university rule not found.");
    }

    if (universityId && universityId !== 'general') {
      const specificRule = UNIVERSITY_RULES.find(rule => rule.id === universityId);
      if (specificRule) {
        universityRule = specificRule;
      }
      // If specific rule not found, it defaults to 'general' already assigned
    }

    // Perform validation using the selected or default rule
    const validationError = this.validateInputSubjects(subjects, universityRule);
    if (validationError) {
      throw new Error(`Input validation failed: ${validationError}`);
    }

    // 1. Filter out excluded subjects
    let processedSubjects = subjects.filter(subject => {
      // Also check for level > 0, as subjects with level 0 shouldn't count
      if (subject.level === 0) return false;
      const isExcluded = universityRule.excludedSubjects?.some(excludedId => excludedId === subject.id || subject.name.toLowerCase().replace(/\s+/g, '_') === excludedId);
      return !isExcluded;
    });

    // 2. Sort subjects by level in descending order
    processedSubjects.sort((a, b) => b.level - a.level);

    // 3. Slicing logic
    let subjectsConsidered: Subject[];
    if (universityRule.includeBestSubjectsOnly) {
      subjectsConsidered = processedSubjects.slice(0, universityRule.numberOfSubjectsToCount);
    } else {
      subjectsConsidered = processedSubjects;
    }

    // 4. Summation
    const aps = subjectsConsidered.reduce((sum, subject) => sum + subject.level, 0);

    return {
      aps,
      universityRuleUsed: universityRule,
      subjectsConsidered,
    };
  }

  // Old methods - commenting out for now
  /*
  static calculateAPS(subjects: SubjectGrade[]): number {
    const validSubjects = subjects.filter(s => s.subject && s.level > 0);
    
    const filteredSubjects = validSubjects.filter(s => 
      s.subject.toLowerCase() !== 'life orientation'
    );
    
    const sortedSubjects = filteredSubjects
      .sort((a, b) => b.level - a.level)
      .slice(0, 6);
    
    return sortedSubjects.reduce((total, subject) => total + subject.level, 0);
  }

  static calculateTotalAps(subjects: SubjectGrade[]): number {
    return subjects.reduce((total, subject) => {
      const gradeValue = subject.level || 0;
      return total + gradeValue;
    }, 0);
  }

  static calculateUniversitySpecificAps(subjects: SubjectGrade[]): Record<string, number> {
    const universityAps: Record<string, number> = {};

    UNIVERSITY_RULES.forEach(university => { // Changed from SOUTH_AFRICAN_UNIVERSITIES
      let filteredSubjects = [...subjects];
      
      if (university.excludedSubjects) {
        filteredSubjects = subjects.filter(
          subject => !university.excludedSubjects!.includes(subject.subject.toLowerCase().replace(/\s+/g, '_'))
        );
      }

      universityAps[university.id] = this.calculateTotalAps(filteredSubjects);
    });

    return universityAps;
  }

  static validateSubjects(subjects: SubjectGrade[]): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    
    if (subjects.length < 6) {
      errors.push('Minimum 6 subjects required for APS calculation');
    }
    
    if (subjects.length > 7) {
      errors.push('Maximum 7 subjects allowed for APS calculation');
    }

    subjects.forEach(subject => {
      if (subject.level < 1 || subject.level > 7) {
        errors.push(`Invalid level for ${subject.subject}: ${subject.level}`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }
  */

  static generateApsResult(subjects: Subject[], universityId: string | null): ApsResult {
    // Use the new calculateApsScore which includes validation internally
    const calculationResult = this.calculateApsScore(subjects, universityId);

    // The old ApsResult structure might need a more thorough review,
    // but for now, let's try to adapt.
    return {
      totalAps: calculationResult.aps, // Or decide if this should be general APS specifically
      subjects: subjects, // Original subjects passed in
      calculatedAt: new Date(),
      // universitySpecificAps: this.calculateUniversitySpecificAps(subjects), // This old method is commented out
      calculationDetails: calculationResult, // Store the new detailed result
    };
  }

  static saveToLocalStorage(result: ApsResult): void {
    try {
      const key = 'schoolIsCool_apsResults_v2'; // Changed key due to structure change
      const existingResults = this.loadFromLocalStorage();

      // Create a copy and add the new result to avoid modifying the array returned by loadFromLocalStorage directly
      const updatedResults = [...existingResults, result];
      
      // Keep only last 10 results
      const recentResults = updatedResults.slice(-10);
      
      localStorage.setItem(key, JSON.stringify(recentResults));
    } catch (error) {
      console.error('Failed to save APS result to localStorage:', error);
    }
  }

  static loadFromLocalStorage(): ApsResult[] {
    try {
      const key = 'schoolIsCool_apsResults_v2'; // Changed key due to structure change
      const stored = localStorage.getItem(key);
      
      if (!stored) return [];
      
      const results = JSON.parse(stored) as ApsResult[]; // Added type assertion
      return results.map((result: ApsResult) => ({ // Use ApsResult type
        ...result,
        calculatedAt: new Date(result.calculatedAt),
        // Ensure calculationDetails subjects are also Subject instances if needed,
        // though JSON parse won't revive them into specific class instances beyond plain objects.
        // This might be fine if they are just data containers.
      }));
    } catch (error) {
      console.error('Failed to load APS results from localStorage:', error);
      return [];
    }
  }
}
