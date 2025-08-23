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
