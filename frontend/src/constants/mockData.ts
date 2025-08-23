export enum CurriculumArea {
  AR = "Alphabet Recognition",
  SWR = "Sight Word Recognition",
  V = "Vocabulary",
  PR = "Point and Read",
  PA = "Phonemic Awareness",
}

export enum Status {
  NotStarted = "not-started",
  InProgress = "in-progress",
  Completed = "completed",
}

export type Task = {
    id: number,
    title: string,
    curriculumArea: CurriculumArea,
    dueDate: string,
    timeEstimated: number,  // in minutes
    instruction: string,
    instructionVideo: string,
    assignmentFile: string,
    status: Status,
    points: number,
}

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
    curriculumArea: CurriculumArea.PA,
    dueDate: "2023-12-15",
    timeEstimated: 15,
    instruction: "Practice the sounds of letters A, B, and C. Use the phonics app to listen and repeat.",
    instructionVideo: "https://www.w3schools.com/html/mov_bbb.mp4",
    assignmentFile: "https://example.com/assignment-a-to-c.pdf",
    status: Status.Completed,
    points: 100,
  },
  {
    id: 2,
    title: "Practice D to F Words",
    curriculumArea: CurriculumArea.V,
    dueDate: "2023-12-17",
    timeEstimated: 20,
    instruction: "Find words starting with D, E, and F. Write them down and practice their sounds.",
    instructionVideo: "https://www.w3schools.com/html/mov_bbb.mp4",
    assignmentFile: "https://example.com/assignment-d-to-f.pdf",
    status: Status.InProgress,
    points: 150,
  },
  {
    id: 3,
    title: "Master G to I Pronunciation",
    curriculumArea: CurriculumArea.PA,
    dueDate: "2023-12-20",
    timeEstimated: 15,
    instruction: "Listen to the pronunciation of G, H, and I. Record yourself saying these letters and compare.",
    instructionVideo: "https://www.w3schools.com/html/mov_bbb.mp4",
    assignmentFile: "https://example.com/assignment-g-to-i.pdf",
    status: Status.NotStarted,
    points: 200,
  },
  {
    id: 4,
    title: "J to L Sound Challenge",
    curriculumArea: CurriculumArea.PA,
    dueDate: "2023-12-22",
    timeEstimated: 10,
    instruction: "Complete the sound challenge for letters J, K, and L. Use the phonics app to practice.",
    instructionVideo: "https://www.w3schools.com/html/mov_bbb.mp4",
    assignmentFile: "https://example.com/assignment-j-to-l.pdf",
    status: Status.NotStarted,
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
