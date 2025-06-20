
export interface Subject {
  id: string;
  name: string;
  category: 'core' | 'elective' | 'language';
  isLanguage?: boolean;
}

export const NSC_SUBJECTS: string[] = [
  'Mathematics',
  'Mathematical Literacy', 
  'English Home Language',
  'English First Additional Language',
  'Afrikaans Home Language',
  'Afrikaans First Additional Language',
  'Life Orientation',
  'Physical Sciences',
  'Life Sciences',
  'Geography',
  'Accounting',
  'Business Studies',
  'Economics',
  'History',
  'Tourism',
  'Consumer Studies',
  'Information Technology',
  'Computer Applications Technology',
  'Engineering Graphics and Design',
  'Civil Technology',
  'Electrical Technology',
  'Mechanical Technology',
  'isiZulu Home Language',
  'isiZulu First Additional Language',
  'isiXhosa Home Language', 
  'isiXhosa First Additional Language',
  'Sepedi Home Language',
  'Sepedi First Additional Language',
  'Setswana Home Language',
  'Setswana First Additional Language',
  'Visual Arts',
  'Dramatic Arts',
  'Music',
  'Dance Studies',
  'Agricultural Sciences',
  'Agricultural Management Practices',
  'Hospitality Studies'
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
