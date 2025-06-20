
import { GRADE_VALUES } from '@/constants/constants';
import { SOUTH_AFRICAN_UNIVERSITIES } from '@/constants/universityRules';

export interface SubjectGrade {
  subject: string;
  level: number;
}

export interface ApsResult {
  totalAps: number;
  subjects: SubjectGrade[];
  calculatedAt: Date;
  universitySpecificAps?: Record<string, number>;
}

export class ApsCalculatorService {
  static calculateAPS(subjects: SubjectGrade[]): number {
    const validSubjects = subjects.filter(s => s.subject && s.level > 0);
    
    // Take best 6 subjects (excluding Life Orientation if present)
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

    SOUTH_AFRICAN_UNIVERSITIES.forEach(university => {
      let filteredSubjects = [...subjects];
      
      // Apply university-specific exclusions
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

    // Check for valid grades
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

  static generateApsResult(subjects: SubjectGrade[]): ApsResult {
    const validation = this.validateSubjects(subjects);
    
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    return {
      totalAps: this.calculateAPS(subjects),
      subjects: [...subjects],
      calculatedAt: new Date(),
      universitySpecificAps: this.calculateUniversitySpecificAps(subjects)
    };
  }

  static saveToLocalStorage(result: ApsResult): void {
    try {
      const key = 'schoolIsCool_apsResults';
      const existingResults = this.loadFromLocalStorage();
      existingResults.push(result);
      
      // Keep only last 10 results
      const recentResults = existingResults.slice(-10);
      
      localStorage.setItem(key, JSON.stringify(recentResults));
    } catch (error) {
      console.error('Failed to save APS result to localStorage:', error);
    }
  }

  static loadFromLocalStorage(): ApsResult[] {
    try {
      const key = 'schoolIsCool_apsResults';
      const stored = localStorage.getItem(key);
      
      if (!stored) return [];
      
      const results = JSON.parse(stored);
      return results.map((result: any) => ({
        ...result,
        calculatedAt: new Date(result.calculatedAt)
      }));
    } catch (error) {
      console.error('Failed to load APS results from localStorage:', error);
      return [];
    }
  }
}
