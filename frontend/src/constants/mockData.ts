export enum CurriculumArea {
  AR = "AR",
  SWR = "SWR",
  V = "V",
  PR = "PR",
  PA = "PA",
}

export enum Status {
  Locked = "locked",
  Current = "current",
  Completed = "completed",
}

export interface AssignmentDetail {
  id: number;
  title: string;
  curriculumArea: CurriculumArea;
  dueDate: string;
  instruction: string;
  instructionVideo: string;
  assignmentFile: string;
  status: Status;
  points: number;
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
  type: "audio" | "file";
  timeEstimated: number;
  questions?: Question[];
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

export interface Lesson {
  id: number;
  titleKey: string;
  letter: string;
  status: LessonStatus;
  dinoEmoji: string;
  week: number;
}

export interface Question {
  id: number;
  question: string;
  answer: string;
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
    dueDate: "2025-08-25",
    instruction: "instructions.task1",
    instructionVideo: "https://www.w3schools.com/html/mov_bbb.mp4",
    assignmentFile: "https://example.com/assignment-letter-a.pdf",
    points: 100,
    timeEstimated: 15,
    type: "audio",
    questions: [
      { id: 1, question: 'Say "Apple"', answer: "apple" },
      { id: 2, question: 'Say "Ant"', answer: "ant" },
      { id: 3, question: 'Say "Arm"', answer: "arm" },
      { id: 4, question: 'Say "Ball"', answer: "ball" },
      { id: 5, question: 'Say "Bat"', answer: "bat" },
      { id: 6, question: 'Say "Bag"', answer: "bag" },
      { id: 7, question: 'Say "Cat"', answer: "cat" },
      { id: 8, question: 'Say "Cap"', answer: "cap" },
      { id: 9, question: 'Say "Cup"', answer: "cup" },
      { id: 10, question: 'Say "Cake"', answer: "cake" },
    ],
  },
  {
    id: 2,
    title: "Practice D to F Words",
    letter: "D to F",
    week: 1,
    curriculumArea: CurriculumArea.V,
    dueDate: "2025-08-27",
    instruction: "instructions.task2",
    instructionVideo: "https://www.w3schools.com/html/mov_bbb.mp4",
    assignmentFile: "https://example.com/assignment-d-to-f.pdf",
    status: Status.Completed,
    points: 150,
    timeEstimated: 20,
    type: "file",
  },
  {
    id: 3,
    title: "Pronounce G to I Words",
    letter: "G to I",
    week: 1,
    curriculumArea: CurriculumArea.PA,
    dueDate: "2025-08-29",
    timeEstimated: 15,
    instruction: "instructions.task3",
    instructionVideo: "https://www.w3schools.com/html/mov_bbb.mp4",
    assignmentFile: "https://example.com/assignment-g-to-i.pdf",
    status: Status.Current,
    points: 200,
    type: "audio",
    questions: [
      { id: 1, question: 'Say "Game"', answer: "game" },
      { id: 2, question: 'Say "Goat"', answer: "goat" },
      { id: 3, question: 'Say "Hat"', answer: "hat" },
      { id: 4, question: 'Say "Hill"', answer: "hill" },
      { id: 5, question: 'Say "Ice"', answer: "ice" },
      { id: 6, question: 'Say "Ink"', answer: "ink" },
      { id: 7, question: 'Say "Gum"', answer: "gum" },
      { id: 8, question: 'Say "Horse"', answer: "horse" },
      { id: 9, question: 'Say "Igloo"', answer: "igloo" },
      { id: 10, question: 'Say "Green"', answer: "green" },
    ],
  },
  {
    id: 4,
    title: "J to L Sound Challenge",
    letter: "J to L",
    week: 1,
    curriculumArea: CurriculumArea.PA,
    dueDate: "2025-08-30",
    timeEstimated: 10,
    instruction: "instructions.task4",
    instructionVideo: "https://www.w3schools.com/html/mov_bbb.mp4",
    assignmentFile: "https://example.com/assignment-j-to-l.pdf",
    status: Status.Locked,
    points: 250,
    type: "audio",
    questions: [
      { id: 1, question: 'Say "Jam"', answer: "jam" },
      { id: 2, question: 'Say "Jet"', answer: "jet" },
      { id: 3, question: 'Say "Jog"', answer: "jog" },
      { id: 4, question: 'Say "Jump"', answer: "jump" },
      { id: 5, question: 'Say "Kite"', answer: "kite" },
      { id: 6, question: 'Say "King"', answer: "king" },
      { id: 7, question: 'Say "Lamp"', answer: "lamp" },
      { id: 8, question: 'Say "Leaf"', answer: "leaf" },
      { id: 9, question: 'Say "Lion"', answer: "lion" },
      { id: 10, question: 'Say "Lid"', answer: "lid" },
    ],
  },
  {
    id: 5,
    title: "M to O Sound Challenge",
    letter: "M to O",
    week: 1,
    curriculumArea: CurriculumArea.PA,
    dueDate: "2025-08-31",
    timeEstimated: 10,
    instruction: "instructions.task5",
    instructionVideo: "https://www.w3schools.com/html/mov_bbb.mp4",
    assignmentFile: "https://example.com/assignment-j-to-l.pdf",
    status: Status.Locked,
    points: 250,
    type: "audio",
    questions: [
      { id: 1, question: 'Say "Man"', answer: "man" },
      { id: 2, question: 'Say "Moon"', answer: "moon" },
      { id: 3, question: 'Say "Map"', answer: "map" },
      { id: 4, question: 'Say "Net"', answer: "net" },
      { id: 5, question: 'Say "Nest"', answer: "nest" },
      { id: 6, question: 'Say "Nap"', answer: "nap" },
      { id: 7, question: 'Say "Octopus"', answer: "octopus" },
      { id: 8, question: 'Say "Owl"', answer: "owl" },
      { id: 9, question: 'Say "Orange"', answer: "orange" },
      { id: 10, question: 'Say "Open"', answer: "open" },
    ],
  },
  {
    id: 6,
    title: "P to Q Sound Challenge",
    letter: "P to Q",
    week: 1,
    curriculumArea: CurriculumArea.PA,
    dueDate: "2023-12-22",
    timeEstimated: 10,
    instruction: "instructions.task6",
    instructionVideo: "https://www.w3schools.com/html/mov_bbb.mp4",
    assignmentFile: "https://example.com/assignment-j-to-l.pdf",
    status: Status.Locked,
    points: 250,
    type: "audio",
    questions: [
      { id: 1, question: 'Say "Pen"', answer: "pen" },
      { id: 2, question: 'Say "Pig"', answer: "pig" },
      { id: 3, question: 'Say "Pot"', answer: "pot" },
      { id: 4, question: 'Say "Queen"', answer: "queen" },
      { id: 5, question: 'Say "Quick"', answer: "quick" },
      { id: 6, question: 'Say "Quilt"', answer: "quilt" },
      { id: 7, question: 'Say "Park"', answer: "park" },
      { id: 8, question: 'Say "Pizza"', answer: "pizza" },
      { id: 9, question: 'Say "Quiz"', answer: "quiz" },
      { id: 10, question: 'Say "Puzzle"', answer: "puzzle" },
    ],
  },
];

export const leaderboard: LeaderboardEntry[] = [
  { id: 1, name: "SuperKid", score: 1250, position: 1 },
  { id: 2, name: "WordWizard", score: 1100, position: 2 },
  { id: 3, name: "SoundMaster", score: 950, position: 3 },
  { id: 4, name: "PhonicsPro", score: 800, position: 4 },
  { id: 5, name: "LetterLearner", score: 650, position: 5 },
  { id: 6, name: "ReadingRanger", score: 640, position: 6 },
  { id: 7, name: "SpellStar", score: 630, position: 7 },
  { id: 8, name: "GrammarGuru", score: 620, position: 8 },
  { id: 9, name: "VocabularyViking", score: 610, position: 9 },
  { id: 10, name: "SentenceSage", score: 600, position: 10 },
  { id: 11, name: "WordWhiz", score: 590, position: 11 },
  { id: 12, name: "LetterLegend", score: 580, position: 12 },
  { id: 13, name: "PhonicsPhenom", score: 570, position: 13 },
  { id: 14, name: "ReadingRocker", score: 560, position: 14 },
  { id: 15, name: "SpellingSultan", score: 550, position: 15 },
  { id: 16, name: "GrammarGenius", score: 540, position: 16 },
  { id: 17, name: "VocabularyVictor", score: 530, position: 17 },
  { id: 18, name: "SentenceStar", score: 520, position: 18 },
  { id: 19, name: "LetterLeader", score: 510, position: 19 },
  { id: 20, name: "WordWizardry", score: 500, position: 20 },
  { id: 21, name: "ReadingRuler", score: 490, position: 21 },
  { id: 22, name: "PhonicsPilot", score: 480, position: 22 },
  { id: 23, name: "SpellingSage", score: 470, position: 23 },
  { id: 24, name: "GrammarGuardian", score: 460, position: 24 },
  { id: 25, name: "VocabularyVoyager", score: 450, position: 25 },
];

export const badges: Badge[] = [
  { id: 1, name: "Phonics Master", icon: "trophy", color: "#FFD700" },
  { id: 2, name: "Week Warrior", icon: "calendar", color: "#4CAF50" },
  { id: 3, name: "Sound Explorer", icon: "compass", color: "#2196F3" },
  { id: 4, name: "Word Champion", icon: "star", color: "#FF9800" },
];

export const weeklyLessons: WeeklyLesson[] = [
  {
    id: 1,
    title: "Letter A",
    letter: "A",
    status: Status.Completed,
    week: 1,
    dinoEmoji: "🦕",
    pronunciationTips: [
      "Say 'Ah' like when the doctor checks your throat",
      "Apple starts with A",
    ],
    points: 100,
  },
  {
    id: 2,
    title: "Letter B",
    letter: "B",
    status: Status.Completed,
    week: 1,
    dinoEmoji: "🦖",
    pronunciationTips: [
      "Put your lips together and make a 'Buh' sound",
      "Ball starts with B",
    ],
    points: 100,
  },
  {
    id: 3,
    title: "Letter C",
    letter: "C",
    status: Status.Current,
    week: 1,
    dinoEmoji: "🦴",
    pronunciationTips: ["Make a 'Kuh' sound like a cat", "Cat starts with C"],
    points: 100,
  },
  {
    id: 4,
    title: "Letter D",
    letter: "D",
    status: Status.Locked,
    week: 1,
    dinoEmoji: "🥚",
    pronunciationTips: [
      "Touch your tongue to the roof of your mouth",
      "Dog starts with D",
    ],
    points: 100,
  },
  {
    id: 5,
    title: "Letter E",
    letter: "E",
    status: Status.Locked,
    week: 1,
    dinoEmoji: "🥚",
    pronunciationTips: [
      "Say 'Eh' like when you're confused",
      "Egg starts with E",
    ],
    points: 100,
  },
];

// Localized lessons structure with i18n keys
export const localizedLessons: Lesson[] = [
  {
    id: 1,
    titleKey: "lessons.letterA",
    letter: "A",
    status: Status.Completed,
    dinoEmoji: "🦕",
    week: 1,
  },
  {
    id: 2,
    titleKey: "lessons.letterB",
    letter: "B",
    status: Status.Completed,
    dinoEmoji: "🦖",
    week: 1,
  },
  {
    id: 3,
    titleKey: "lessons.letterC",
    letter: "C",
    status: Status.Current,
    dinoEmoji: "🦴",
    week: 1,
  },
  {
    id: 4,
    titleKey: "lessons.letterD",
    letter: "D",
    status: Status.Locked,
    dinoEmoji: "🥚",
    week: 1,
  },
  {
    id: 5,
    titleKey: "lessons.letterE",
    letter: "E",
    status: Status.Locked,
    dinoEmoji: "🥚",
    week: 1,
  },
  {
    id: 6,
    titleKey: "lessons.week1Boss",
    letter: "Boss",
    status: Status.Locked,
    dinoEmoji: "👑",
    week: 1,
  },
  {
    id: 7,
    titleKey: "lessons.letterF",
    letter: "F",
    status: Status.Locked,
    dinoEmoji: "🥚",
    week: 2,
  },
  {
    id: 8,
    titleKey: "lessons.letterG",
    letter: "G",
    status: Status.Locked,
    dinoEmoji: "🥚",
    week: 2,
  },
  {
    id: 9,
    titleKey: "lessons.letterH",
    letter: "H",
    status: Status.Locked,
    dinoEmoji: "🥚",
    week: 2,
  },
  {
    id: 10,
    titleKey: "lessons.letterI",
    letter: "I",
    status: Status.Locked,
    dinoEmoji: "🥚",
    week: 2,
  },
  {
    id: 11,
    titleKey: "lessons.letterJ",
    letter: "J",
    status: Status.Locked,
    dinoEmoji: "🥚",
    week: 2,
  },
  {
    id: 12,
    titleKey: "lessons.week2Boss",
    letter: "Boss",
    status: Status.Locked,
    dinoEmoji: "👑",
    week: 2,
  },
];

// Footprint patterns for the learning path
export const footprintPatterns = [
  // Step 1: 1 emoji slightly left, slant right
  {
    footprints: [{ offsetX: -0.08, offsetY: 0, rotation: "10deg" }],
  },
  // Step 2: 2 emojis vertically (first slightly left higher, second slightly right lower), slant left
  {
    footprints: [
      { offsetX: -0.08, offsetY: -25, rotation: "-10deg" },
      { offsetX: 0.08, offsetY: 5, rotation: "-10deg" },
    ],
  },
  // Step 3: 2 emojis vertically (first very slightly right, second very slightly left), center
  {
    footprints: [
      { offsetX: 0.04, offsetY: -8, rotation: "0deg" },
      { offsetX: -0.04, offsetY: 8, rotation: "0deg" },
    ],
  },
  // Step 4: 2 emojis vertically (first very slightly left, second slightly right), slant left
  {
    footprints: [
      { offsetX: -0.04, offsetY: -16, rotation: "-10deg" },
      { offsetX: 0.08, offsetY: 8, rotation: "-10deg" },
    ],
  },
  // Step 5: 1 emoji even more slight right, slant left
  {
    footprints: [{ offsetX: 0.12, offsetY: 0, rotation: "-10deg" }],
  },
];

// Lesson node positions (zigzag pattern)
export const lessonPositions = [
  { offsetX: 0 }, // Center - A
  { offsetX: -0.25 }, // Left - B
  { offsetX: 0.25 }, // Right - C
  { offsetX: -0.2 }, // Slightly left - D
  { offsetX: 0.2 }, // Slightly right - E
  { offsetX: 0 }, // Center - Boss
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
    primary: "#6200EE",
    secondary: "#4CAF50",
    background: "#E8F5E9",
    completed: "#4CAF50",
    completedBorder: "#2E7D32",
    current: "#FF9800",
    currentBorder: "#FF5722",
    locked: "#BDBDBD",
    lockedBorder: "#9E9E9E",
    bossGlow: "#FFD700",
    fire: "#FF5722",
    lightning: "#FFC107",
    white: "white",
    textPrimary: "#2E7D32",
    textSecondary: "#666",
    textHovered: "#1B5E20",
    comingSoonBg: "#F3E5F5",
    comingSoonTitle: "#6200EE",
    comingSoonText: "#7B1FA2",
  },
  shadows: {
    statsBar: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    lessonNode: {
      shadowColor: "#000",
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

export const forumPosts = [
  {
    id: 1,
    title: "How to help with phonics sounds?",
    content:
      'My child is struggling with the "th" sound. Any tips or resources that have worked for other parents?',
    author: "Anonymous Parent",
    timestamp: "2023-12-10T10:30:00Z",
    replies: [
      {
        id: 1,
        content:
          "We found that using a mirror to show tongue placement really helped!",
        author: "Anonymous Parent",
        timestamp: "2023-12-10T14:22:00Z",
      },
      {
        id: 2,
        content:
          "There are some great YouTube videos that demonstrate the sound visually.",
        author: "Anonymous Parent",
        timestamp: "2023-12-11T09:15:00Z",
      },
    ],
    likes: 8,
  },
  {
    id: 2,
    title: "Best time of day for practice?",
    content:
      "When do your children seem most receptive to phonics practice? Morning or evening?",
    author: "Anonymous Parent",
    timestamp: "2023-12-09T16:45:00Z",
    replies: [
      {
        id: 1,
        content:
          "We do 15 minutes after school as a wind-down activity. Works well for us!",
        author: "Anonymous Parent",
        timestamp: "2023-12-09T17:30:00Z",
      },
    ],
    likes: 5,
  },
  {
    id: 3,
    title: "Celebrating small wins",
    content:
      'My child finally got the "sh" sound today! So proud of their progress 🎉',
    author: "Anonymous Parent",
    timestamp: "2023-12-08T20:15:00Z",
    replies: [
      {
        id: 1,
        content: "That's amazing! Congratulations to your little one! 👏",
        author: "Anonymous Parent",
        timestamp: "2023-12-08T21:05:00Z",
      },
      {
        id: 2,
        content: 'Such a great moment! The "sh" sound is tricky!',
        author: "Anonymous Parent",
        timestamp: "2023-12-09T08:40:00Z",
      },
    ],
    likes: 12,
  },
];
