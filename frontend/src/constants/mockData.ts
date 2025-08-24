export enum CurriculumArea {
  AR = "Alphabet Recognition",
  SWR = "Sight Word Recognition",
  V = "Vocabulary",
  PR = "Point and Read",
  PA = "Phonemic Awareness",
}

export enum Status {
  Locked = "locked",
  Current = "current",
  Completed = "completed",
}

export interface AssignmentDetail {
  id: number,
  title: string,
  curriculumArea: CurriculumArea,
  dueDate: string,
  instruction: string,
  instructionVideo: string,
  assignmentFile: string,
  status: Status,
  points: number,
}

export type LessonStatus = Status;

export interface User {
  id: number;
  username: string;
  password: string;
  streak: number;
  score: number;
  badges: string[];
}

export interface Task {
  id: number;
  title: string;
  letter: string;
  status: Status;
  week: number;

  curriculumArea: CurriculumArea;
  dueDate: string;
  instruction: string;
  instructionVideo: string;
  assignmentFile: string;
  points: number;
  type: 'audio' | 'file';
  timeEstimated: number;
}

export interface LeaderboardEntry {
  id: number;
  name: string;
  score: number;
  position: number;
}

export interface Badge {
  id: number;
  name: string;
  icon: string;
  color: string;
}

export interface WeeklyLesson {
  id: number;
  title: string;
  letter: string;
  status: LessonStatus;
  week: number;
  dinoEmoji: string;
  pronunciationTips: string[];
  points: number;
}

export const users: User[] = [
  {
    id: 1,
    username: "superkid",
    password: "password123",
    streak: 5,
    score: 1250,
    badges: ["phonics_master", "week_warrior", "sound_explorer"],
  },
];

export const tasks: Task[] = [
  {
    id: 1,
    title: "Letter A to C Sounds",
    letter: "A to C",
    status: Status.Completed,
    week: 1,
    curriculumArea: CurriculumArea.PA,
    dueDate: "2023-12-15",
    instruction: "Practice the sounds of letter A. Say 'Ah' like when the doctor checks your throat. Apple starts with A.",
    instructionVideo: "https://www.w3schools.com/html/mov_bbb.mp4",
    assignmentFile: "https://example.com/assignment-letter-a.pdf",
    points: 100,
    timeEstimated: 15,
    type: 'audio',
  },
  {
    id: 2,
    title: "Practice D to F Words",
    letter: "D to F",
    week: 1,
    curriculumArea: CurriculumArea.V,
    dueDate: "2023-12-17",
    instruction: "Find words starting with D, E, and F. Write them down and practice their sounds.",
    instructionVideo: "https://www.w3schools.com/html/mov_bbb.mp4",
    assignmentFile: "https://example.com/assignment-d-to-f.pdf",
    status: Status.Completed,
    points: 150,
    timeEstimated: 20,
    type: 'audio'
  },
  {
    id: 3,
    title: "Master G to I Pronunciation",
    letter: "G to I",
    week: 1,
    curriculumArea: CurriculumArea.PA,
    dueDate: "2023-12-20",
    timeEstimated: 15,
    instruction: "Listen to the pronunciation of G, H, and I. Record yourself saying these letters and compare.",
    instructionVideo: "https://www.w3schools.com/html/mov_bbb.mp4",
    assignmentFile: "https://example.com/assignment-g-to-i.pdf",
    status: Status.Current,
    points: 200,
    type: 'audio'
  },
  {
    id: 4,
    title: "J to L Sound Challenge",
    letter: "J to L",
    week: 1,
    curriculumArea: CurriculumArea.PA,
    dueDate: "2023-12-22",
    timeEstimated: 10,
    instruction: "Complete the sound challenge for letters J, K, and L. Use the phonics app to practice.",
    instructionVideo: "https://www.w3schools.com/html/mov_bbb.mp4",
    assignmentFile: "https://example.com/assignment-j-to-l.pdf",
    status: Status.Locked,
    points: 250,
    type: 'audio'
  },
  {
    id: 5,
    title: "M to O Sound Challenge",
    letter: "M to O",
    week: 1,
    curriculumArea: CurriculumArea.PA,
    dueDate: "2023-12-22",
    timeEstimated: 10,
    instruction: "Complete the sound challenge for letters J, K, and L. Use the phonics app to practice.",
    instructionVideo: "https://www.w3schools.com/html/mov_bbb.mp4",
    assignmentFile: "https://example.com/assignment-j-to-l.pdf",
    status: Status.Locked,
    points: 250,
    type: 'audio'
  },
  {
    id: 6,
    title: "P to Q Sound Challenge",
    letter: "P to Q",
    week: 1,
    curriculumArea: CurriculumArea.PA,
    dueDate: "2023-12-22",
    timeEstimated: 10,
    instruction: "Complete the sound challenge for letters J, K, and L. Use the phonics app to practice.",
    instructionVideo: "https://www.w3schools.com/html/mov_bbb.mp4",
    assignmentFile: "https://example.com/assignment-j-to-l.pdf",
    status: Status.Locked,
    points: 250,
    type: 'audio'
  }

];

export const leaderboard: LeaderboardEntry[] = [
  { id: 1, name: "SuperKid", score: 1250, position: 1 },
  { id: 2, name: "WordWizard", score: 1100, position: 2 },
  { id: 3, name: "SoundMaster", score: 950, position: 3 },
  { id: 4, name: "PhonicsPro", score: 800, position: 4 },
  { id: 5, name: "LetterLearner", score: 650, position: 5 },
];

export const badges: Badge[] = [
  { id: 1, name: "Phonics Master", icon: "trophy", color: "#FFD700" },
  { id: 2, name: "Week Warrior", icon: "calendar", color: "#4CAF50" },
  { id: 3, name: "Sound Explorer", icon: "compass", color: "#2196F3" },
  { id: 4, name: "Word Champion", icon: "star", color: "#FF9800" },
];

// Footprint patterns for the learning path
export const footprintPatterns = [
  // Step 1: 1 emoji slightly left, slant right
  {
    footprints: [
      { offsetX: -0.08, offsetY: 0, rotation: '10deg' }
    ]
  },
  // Step 2: 2 emojis vertically (first slightly left higher, second slightly right lower), slant left
  {
    footprints: [
      { offsetX: -0.08, offsetY: -25, rotation: '-10deg' },
      { offsetX: 0.08, offsetY: 5, rotation: '-10deg' }
    ]
  },
  // Step 3: 2 emojis vertically (first very slightly right, second very slightly left), center
  {
    footprints: [
      { offsetX: 0.04, offsetY: -8, rotation: '0deg' },
      { offsetX: -0.04, offsetY: 8, rotation: '0deg' }
    ]
  },
  // Step 4: 2 emojis vertically (first very slightly left, second slightly right), slant left
  {
    footprints: [
      { offsetX: -0.04, offsetY: -16, rotation: '-10deg' },
      { offsetX: 0.08, offsetY: 8, rotation: '-10deg' }
    ]
  },
  // Step 5: 1 emoji even more slight right, slant left
  {
    footprints: [
      { offsetX: 0.12, offsetY: 0, rotation: '-10deg' }
    ]
  }
];

// Lesson node positions (zigzag pattern)
export const lessonPositions = [
  { offsetX: 0 },           // Center - A
  { offsetX: -0.25 },       // Left - B  
  { offsetX: 0.25 },        // Right - C
  { offsetX: -0.2 },        // Slightly left - D
  { offsetX: 0.2 },         // Slightly right - E
  { offsetX: 0 },           // Center - Boss
];

// Animation constants
export const animationConstants = {
  fadeInDuration: 1000,
  slideTension: 50,
  slideFriction: 8,
  pulseDuration: 1000,
  pulseScale: 1.1,
  glowDuration: 2000,
  hoverScale: 1.05,
};

// UI constants
export const uiConstants = {
  iconSizes: {
    stats: 22,
    weekHeader: 20,
    playButton: 16,
    checkmark: 14,
    hover: 16,
  },
  elevations: {
    statsBar: 8,
    weekBadge: 4,
    lessonNode: 10,
    playButton: 6,
    checkmark: 6,
    comingSoon: 4,
    hovered: 15,
  },
  borderRadius: {
    weekBadge: 25,
    playButton: 18,
    checkmark: 14,
  },
  colors: {
    primary: '#6200EE',
    secondary: '#4CAF50',
    background: '#E8F5E9',
    completed: '#4CAF50',
    completedBorder: '#2E7D32',
    current: '#FF9800',
    currentBorder: '#FF5722',
    locked: '#BDBDBD',
    lockedBorder: '#9E9E9E',
    bossGlow: '#FFD700',
    fire: '#FF5722',
    lightning: '#FFC107',
    white: 'white',
    textPrimary: '#2E7D32',
    textSecondary: '#666',
    textHovered: '#1B5E20',
    comingSoonBg: '#F3E5F5',
    comingSoonTitle: '#6200EE',
    comingSoonText: '#7B1FA2',
  },
  shadows: {
    statsBar: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    lessonNode: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
    },
    hovered: {
      shadowOpacity: 0.4,
      shadowRadius: 15,
    },
  },
};