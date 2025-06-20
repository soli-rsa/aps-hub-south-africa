import { GRADE_VALUES } from '@/constants/constants';
import { SOUTH_AFRICAN_UNIVERSITIES } from '@/constants/universityRules';

export interface SubjectGrade {
  subjectId: string;
  subjectName: string;
  grade: string;
}

export interface ApsResult {
  totalAps: number;
  subjects: SubjectGrade[];
  calculatedAt: Date;
  universitySpecificAps?: Record<string, number>;
}

export class ApsCalculatorService {
  static calculateTotalAps(subjects: SubjectGrade[]): number {
    return subjects.reduce((total, subject) => {
      const gradeValue = GRADE_VALUES[subject.grade] || 0;
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
          subject => !university.excludedSubjects!.includes(subject.subjectId)
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

    // Check for required language subject
    const hasLanguage = subjects.some(subject => 
      subject.subjectId.includes('english') || 
      subject.subjectId.includes('afrikaans') ||
      subject.subjectId.includes('language')
    );
    
    if (!hasLanguage) {
      errors.push('At least one language subject is required');
    }

    // Check for valid grades
    subjects.forEach(subject => {
      if (!GRADE_VALUES[subject.grade]) {
        errors.push(`Invalid grade for ${subject.subjectName}: ${subject.grade}`);
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
      totalAps: this.calculateTotalAps(subjects),
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
