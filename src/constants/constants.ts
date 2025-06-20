
export interface Subject {
  id: string;
  name: string;
  category: 'core' | 'elective' | 'language';
  isLanguage?: boolean;
}

export const NSC_SUBJECTS: Subject[] = [
  // Core subjects
  { id: 'mathematics', name: 'Mathematics', category: 'core' },
  { id: 'mathematical_literacy', name: 'Mathematical Literacy', category: 'core' },
  { id: 'english_home_language', name: 'English Home Language', category: 'language', isLanguage: true },
  { id: 'english_first_additional', name: 'English First Additional Language', category: 'language', isLanguage: true },
  { id: 'afrikaans_home_language', name: 'Afrikaans Home Language', category: 'language', isLanguage: true },
  { id: 'afrikaans_first_additional', name: 'Afrikaans First Additional Language', category: 'language', isLanguage: true },
  { id: 'life_orientation', name: 'Life Orientation', category: 'core' },
  
  // Sciences
  { id: 'physical_sciences', name: 'Physical Sciences', category: 'elective' },
  { id: 'life_sciences', name: 'Life Sciences', category: 'elective' },
  { id: 'geography', name: 'Geography', category: 'elective' },
  
  // Commercial subjects
  { id: 'accounting', name: 'Accounting', category: 'elective' },
  { id: 'business_studies', name: 'Business Studies', category: 'elective' },
  { id: 'economics', name: 'Economics', category: 'elective' },
  
  // Humanities
  { id: 'history', name: 'History', category: 'elective' },
  { id: 'tourism', name: 'Tourism', category: 'elective' },
  { id: 'consumer_studies', name: 'Consumer Studies', category: 'elective' },
  
  // Technical subjects
  { id: 'information_technology', name: 'Information Technology', category: 'elective' },
  { id: 'computer_applications_technology', name: 'Computer Applications Technology', category: 'elective' },
  { id: 'engineering_graphics_design', name: 'Engineering Graphics and Design', category: 'elective' },
  { id: 'civil_technology', name: 'Civil Technology', category: 'elective' },
  { id: 'electrical_technology', name: 'Electrical Technology', category: 'elective' },
  { id: 'mechanical_technology', name: 'Mechanical Technology', category: 'elective' },
  
  // Additional languages
  { id: 'zulu_home_language', name: 'isiZulu Home Language', category: 'language', isLanguage: true },
  { id: 'zulu_first_additional', name: 'isiZulu First Additional Language', category: 'language', isLanguage: true },
  { id: 'xhosa_home_language', name: 'isiXhosa Home Language', category: 'language', isLanguage: true },
  { id: 'xhosa_first_additional', name: 'isiXhosa First Additional Language', category: 'language', isLanguage: true },
  { id: 'sepedi_home_language', name: 'Sepedi Home Language', category: 'language', isLanguage: true },
  { id: 'sepedi_first_additional', name: 'Sepedi First Additional Language', category: 'language', isLanguage: true },
  { id: 'setswana_home_language', name: 'Setswana Home Language', category: 'language', isLanguage: true },
  { id: 'setswana_first_additional', name: 'Setswana First Additional Language', category: 'language', isLanguage: true },
  
  // Arts and culture
  { id: 'visual_arts', name: 'Visual Arts', category: 'elective' },
  { id: 'dramatic_arts', name: 'Dramatic Arts', category: 'elective' },
  { id: 'music', name: 'Music', category: 'elective' },
  { id: 'dance_studies', name: 'Dance Studies', category: 'elective' },
  
  // Additional subjects
  { id: 'agricultural_sciences', name: 'Agricultural Sciences', category: 'elective' },
  { id: 'agricultural_management_practices', name: 'Agricultural Management Practices', category: 'elective' },
  { id: 'hospitality_studies', name: 'Hospitality Studies', category: 'elective' }
];

export const GRADE_VALUES: Record<string, number> = {
  '7': 7, // 80-100% - Outstanding Achievement
  '6': 6, // 70-79% - Meritorious Achievement  
  '5': 5, // 60-69% - Substantial Achievement
  '4': 4, // 50-59% - Adequate Achievement
  '3': 3, // 40-49% - Moderate Achievement
  '2': 2, // 30-39% - Elementary Achievement
  '1': 1  // 0-29% - Not Achieved
};

export const GRADE_DESCRIPTIONS: Record<string, string> = {
  '7': '80-100% - Outstanding Achievement',
  '6': '70-79% - Meritorious Achievement',
  '5': '60-69% - Substantial Achievement', 
  '4': '50-59% - Adequate Achievement',
  '3': '40-49% - Moderate Achievement',
  '2': '30-39% - Elementary Achievement',
  '1': '0-29% - Not Achieved'
};
