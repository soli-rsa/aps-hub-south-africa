
export interface UniversityRule {
  id: string;
  name: string;
  shortName: string;
  category: 'public_research' | 'public_comprehensive' | 'university_of_technology' | 'private';
  location: {
    province: string;
    city: string;
  };
  applicationUrl: string;
  website: string;
  minAps?: number;
  apsRequirement?: number;
  excludedSubjects?: string[];
  popularPrograms: string[];
  established: number;
  numberOfSubjectsToCount: number;
  includeBestSubjectsOnly: boolean;
}

export const UNIVERSITY_RULES: UniversityRule[] = [
  {
    id: 'uct',
    name: 'University of Cape Town',
    shortName: 'UCT',
    numberOfSubjectsToCount: 6,
    includeBestSubjectsOnly: true,
    category: 'public_research',
    location: { province: 'Western Cape', city: 'Cape Town' },
    applicationUrl: 'https://www.uct.ac.za/apply',
    website: 'https://www.uct.ac.za',
    minAps: 35,
    apsRequirement: 35,
    excludedSubjects: ['life_orientation'],
    popularPrograms: ['Medicine', 'Engineering', 'Commerce', 'Law', 'Humanities'],
    established: 1829
  },
  {
    id: 'stellenbosch',
    name: 'Stellenbosch University',
    shortName: 'SU',
    numberOfSubjectsToCount: 6,
    includeBestSubjectsOnly: true,
    category: 'public_research',
    location: { province: 'Western Cape', city: 'Stellenbosch' },
    applicationUrl: 'https://www.sun.ac.za/english/admission-settlement',
    website: 'https://www.sun.ac.za',
    minAps: 32,
    apsRequirement: 32,
    excludedSubjects: ['life_orientation'],
    popularPrograms: ['Agriculture', 'Engineering', 'Medicine', 'Business', 'Theology'],
    established: 1918
  },
  {
    id: 'wits',
    name: 'University of the Witwatersrand',
    shortName: 'Wits',
    numberOfSubjectsToCount: 6,
    includeBestSubjectsOnly: true,
    category: 'public_research',
    location: { province: 'Gauteng', city: 'Johannesburg' },
    applicationUrl: 'https://www.wits.ac.za/application/',
    website: 'https://www.wits.ac.za',
    minAps: 30,
    apsRequirement: 30,
    excludedSubjects: ['life_orientation'],
    popularPrograms: ['Mining Engineering', 'Medicine', 'Commerce', 'Architecture', 'Law'],
    established: 1922
  },
  {
    id: 'up',
    name: 'University of Pretoria',
    shortName: 'UP',
    category: 'public_research',
    location: { province: 'Gauteng', city: 'Pretoria' },
    applicationUrl: 'https://www.up.ac.za/admissions',
    website: 'https://www.up.ac.za',
    minAps: 28,
    apsRequirement: 28,
    popularPrograms: ['Veterinary Science', 'Engineering', 'Medicine', 'Law', 'Business'],
    established: 1908,
    numberOfSubjectsToCount: 6,
    includeBestSubjectsOnly: true
  },
  {
    id: 'ukzn',
    name: 'University of KwaZulu-Natal',
    shortName: 'UKZN',
    numberOfSubjectsToCount: 6,
    includeBestSubjectsOnly: true,
    category: 'public_comprehensive',
    location: { province: 'KwaZulu-Natal', city: 'Durban' },
    applicationUrl: 'https://www.ukzn.ac.za/apply-to-study-at-ukzn/',
    website: 'https://www.ukzn.ac.za',
    minAps: 26,
    apsRequirement: 26,
    popularPrograms: ['Medicine', 'Engineering', 'Law', 'Business', 'Education'],
    established: 2004
  },
  {
    id: 'rhodes',
    name: 'Rhodes University',
    shortName: 'RU',
    numberOfSubjectsToCount: 6,
    includeBestSubjectsOnly: true,
    category: 'public_research',
    location: { province: 'Eastern Cape', city: 'Grahamstown' },
    applicationUrl: 'https://www.ru.ac.za/admissions/',
    website: 'https://www.ru.ac.za',
    minAps: 26,
    apsRequirement: 26,
    popularPrograms: ['Journalism', 'Pharmacy', 'Law', 'Commerce', 'Humanities'],
    established: 1904
  },
  {
    id: 'ufs',
    name: 'University of the Free State',
    shortName: 'UFS',
    numberOfSubjectsToCount: 6,
    includeBestSubjectsOnly: true,
    category: 'public_comprehensive',
    location: { province: 'Free State', city: 'Bloemfontein' },
    applicationUrl: 'https://www.ufs.ac.za/admissions',
    website: 'https://www.ufs.ac.za',
    minAps: 24,
    apsRequirement: 24,
    popularPrograms: ['Medicine', 'Agriculture', 'Law', 'Theology', 'Education'],
    established: 1904
  },
  {
    id: 'nmu',
    name: 'Nelson Mandela University',
    shortName: 'NMU',
    numberOfSubjectsToCount: 6,
    includeBestSubjectsOnly: true,
    category: 'public_comprehensive',
    location: { province: 'Eastern Cape', city: 'Port Elizabeth' },
    applicationUrl: 'https://www.mandela.ac.za/Study-at-Mandela/Admissions',
    website: 'https://www.mandela.ac.za',
    minAps: 24,
    apsRequirement: 24,
    popularPrograms: ['Engineering', 'Business', 'Health Sciences', 'Education', 'Law'],
    established: 2005
  },
  {
    id: 'cut',
    name: 'Central University of Technology',
    shortName: 'CUT',
    numberOfSubjectsToCount: 6,
    includeBestSubjectsOnly: true,
    category: 'university_of_technology',
    location: { province: 'Free State', city: 'Bloemfontein' },
    applicationUrl: 'https://www.cut.ac.za/admissions',
    website: 'https://www.cut.ac.za',
    minAps: 20,
    apsRequirement: 20,
    popularPrograms: ['Engineering', 'Information Technology', 'Health Sciences', 'Management', 'Agriculture'],
    established: 1981
  },
  {
    id: 'unisa',
    name: 'University of South Africa',
    shortName: 'UNISA',
    numberOfSubjectsToCount: 6,
    includeBestSubjectsOnly: true,
    category: 'public_comprehensive',
    location: { province: 'Gauteng', city: 'Pretoria' },
    applicationUrl: 'https://www.unisa.ac.za/sites/corporate/default/Apply-for-admission',
    website: 'https://www.unisa.ac.za',
    minAps: 20,
    apsRequirement: 20,
    popularPrograms: ['Business', 'Education', 'Law', 'Psychology', 'Theology'],
    established: 1873
  },
  {
    id: 'general',
    name: 'General APS Calculation',
    shortName: 'General',
    category: 'public_research', // Assuming a default category, adjust if needed
    location: { province: 'National', city: 'Any' }, // Assuming general applicability
    applicationUrl: '', // No specific URL for general calculation
    website: '', // No specific website for general calculation
    excludedSubjects: ['life_orientation'], // As specified
    popularPrograms: [], // Not applicable
    established: 0, // Not applicable
    numberOfSubjectsToCount: 6,
    includeBestSubjectsOnly: true
  }
];
