export const users = [
  {
    id: 1,
    username: "superkid",
    password: "password123",
    streak: 5,
    score: 1250,
    badges: ["phonics_master", "week_warrior", "sound_explorer"],
  },
];

export const tasks = [
  {
    id: 1,
    title: "Learn A to C Sounds",
    dueDate: "2023-12-15",
    status: "completed",
    points: 100,
  },
  {
    id: 2,
    title: "Practice D to F Words",
    dueDate: "2023-12-17",
    status: "in-progress",
    points: 150,
  },
  {
    id: 3,
    title: "Master G to I Pronunciation",
    dueDate: "2023-12-20",
    status: "not-started",
    points: 200,
  },
  {
    id: 4,
    title: "J to L Sound Challenge",
    dueDate: "2023-12-22",
    status: "not-started",
    points: 250,
  },
];

export const leaderboard = [
  { id: 1, name: "SuperKid", score: 1250, position: 1 },
  { id: 2, name: "WordWizard", score: 1100, position: 2 },
  { id: 3, name: "SoundMaster", score: 950, position: 3 },
  { id: 4, name: "PhonicsPro", score: 800, position: 4 },
  { id: 5, name: "LetterLearner", score: 650, position: 5 },
];

export const badges = [
  { id: 1, name: "Phonics Master", icon: "trophy", color: "#FFD700" },
  { id: 2, name: "Week Warrior", icon: "calendar", color: "#4CAF50" },
  { id: 3, name: "Sound Explorer", icon: "compass", color: "#2196F3" },
  { id: 4, name: "Word Champion", icon: "star", color: "#FF9800" },
];

type LessonStatus = 'completed' | 'current' | 'locked';

export const weeklyLessons: {
  id: number;
  title: string;
  letter: string;
  status: LessonStatus;
  week: number;
  dinoEmoji: string;
  pronunciationTips: string[];
  points: number;
}[] = [
    {
      id: 1,
      title: "Letter A",
      letter: "A",
      status: "completed",
      week: 1,
      dinoEmoji: '🦕',
      pronunciationTips: ["Say 'Ah' like when the doctor checks your throat", "Apple starts with A"],
      points: 100,
    },
    {
      id: 2,
      title: "Letter B",
      letter: "B",
      status: "completed",
      week: 1,
      dinoEmoji: '🦖',
      pronunciationTips: ["Put your lips together and make a 'Buh' sound", "Ball starts with B"],
      points: 100,
    },
    {
      id: 3,
      title: "Letter C",
      letter: "C",
      status: "current",
      week: 1,
      dinoEmoji: '🦴',
      pronunciationTips: ["Make a 'Kuh' sound like a cat", "Cat starts with C"],
      points: 100,
    },
    {
      id: 4,
      title: "Letter D",
      letter: "D",
      status: "locked",
      week: 1,
      dinoEmoji: '🥚',
      pronunciationTips: ["Touch your tongue to the roof of your mouth", "Dog starts with D"],
      points: 100,
    },
    {
      id: 5,
      title: "Letter E",
      letter: "E",
      status: "locked",
      week: 1,
      dinoEmoji: '🥚',
      pronunciationTips: ["Say 'Eh' like when you're confused", "Egg starts with E"],
      points: 100,
    },
  ];