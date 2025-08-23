import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Dimensions, Image } from "react-native";
import {
  Title,
  Card,
  Text,
  Avatar,
  Button,
  Modal,
  Portal,
  IconButton,
} from "react-native-paper";
import { useTranslation } from "react-i18next";

const { width } = Dimensions.get("window");

// ------------------- Calendar Heatmap Components -------------------
interface CalendarHeatmapProps {
  data: Record<string, number>;
  monthIndex: number;
}

const CalendarHeatmapMonth: React.FC<CalendarHeatmapProps> = ({
  data,
  monthIndex,
}) => {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <View style={styles.monthContainer}>
      <Text style={styles.monthLabel}>{monthNames[monthIndex]}</Text>
      <View style={styles.daysGrid}>
        {days.map((day) => {
          const dateStr = `2025-${String(monthIndex + 1).padStart(
            2,
            "0"
          )}-${String(day).padStart(2, "0")}`;
          if (new Date(dateStr).getMonth() !== monthIndex) return null;
          const count = data[dateStr] || 0;
          const color =
            count === 0 ? "#eee" : `rgba(255,87,34,${0.2 + 0.15 * count})`;
          return (
            <View
              key={dateStr}
              style={[styles.daySquare, { backgroundColor: color }]}
            />
          );
        })}
      </View>
    </View>
  );
};

const CalendarHeatmapGrid: React.FC<{ data: Record<string, number> }> = ({
  data,
}) => {
  return (
    <View style={styles.gridContainer}>
      {Array.from({ length: 12 }, (_, i) => (
        <CalendarHeatmapMonth key={i} monthIndex={i} data={data} />
      ))}
    </View>
  );
};

// Mock Data
const users = [
  {
    id: "1",
    username: "DinoExplorer",
    email: "dino@example.com",
    streak: 7,
    score: 850,
    badges: ["alphabet_master", "word_explorer", "reading_champion"],
  },
];

const badges = [
  {
    id: "1",
    name: "Alphabet Master",
    image: require("../../assets/images/dino1.png"),
    description: "Completed all alphabet challenges",
  },
  {
    id: "2",
    name: "Word Explorer",
    image: require("../../assets/images/dino2.png"),
    description: "Learned 50+ new words",
  },
  {
    id: "3",
    name: "Reading Champion",
    image: require("../../assets/images/dino3.png"),
    description: "Read 20+ stories successfully",
  },
];

const scrapbookMemories = [
  {
    id: "memory_1",
    task: "Alphabet Adventure",
    date: "Jan 22, 2025",
    description: "Learned letters A-G with Mom!",
    timeSpent: "45 minutes",
    parentInvolvement: "High",
    funFact: "Rohan's favorite letter is 'T' for T-Rex!",
    parentComment: "I love how you remembered all the letters! - Mom",
    taskType: "Alphabet Recognition",
  },
  {
    id: "memory_2",
    task: "Word Hunter",
    date: "Jan 20, 2025",
    description: "Mastered 10 new words with Dad!",
    timeSpent: "30 minutes",
    parentInvolvement: "Medium",
    funFact: "Used 'gigantic' to describe a Brachiosaurus!",
    parentComment: "Your pronunciation is getting so good! - Dad",
    taskType: "Vocabulary",
  },
  {
    id: "memory_3",
    task: "Sight Word Safari",
    date: "Jan 18, 2025",
    description: "Completed first sight word challenge!",
    timeSpent: "25 minutes",
    parentInvolvement: "High",
    funFact: "Read 15 sight words without help!",
    parentComment: "So proud of your reading progress! - Grandma",
    taskType: "Sight Words",
  },
];

const progressSummary = {
  totalTime: "12h 45m",
  sessionsWithParent: "15",
  recentAchievement: "7-Day Streak!",
};

const DashboardScreen: React.FC = () => {
  const { t } = useTranslation();
  const [scrapbookVisible, setScrapbookVisible] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const user = users[0];
  const userBadges = badges.filter((badge) =>
    user.badges.includes(badge.name.toLowerCase().replace(" ", "_"))
  );

  // Mock streak data
  const streakData: Record<string, number> = {
    "2025-01-18": 1,
    "2025-01-19": 1,
    "2025-01-20": 1,
    "2025-01-21": 1,
    "2025-01-22": 1,
    "2025-01-23": 1,
    "2025-01-24": 1,
  };

  const nextPage = () => {
    if (currentPage < scrapbookMemories.length - 1)
      setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const renderScrapbookModal = () => (
    <Portal>
      <Modal
        visible={scrapbookVisible}
        onDismiss={() => setScrapbookVisible(false)}
        contentContainerStyle={styles.modalContainer}
      >
        <View style={styles.scrapbookHeader}>
          <Text style={styles.scrapbookTitle}>
            {t("scrapbook.title", "📖 Memory Scrapbook")}
          </Text>
          <IconButton
            icon="close"
            size={24}
            onPress={() => setScrapbookVisible(false)}
          />
        </View>

        {scrapbookMemories[currentPage] && (
          <Card style={styles.memoryCard}>
            <Card.Content>
              <View style={styles.pageHeader}>
                <Text style={styles.pageNumber}>
                  {t("scrapbook.week", "Week {{week}} of {{total}}", {
                    week: currentPage + 1,
                    total: scrapbookMemories.length,
                  })}
                </Text>
                <Text style={styles.memoryDate}>
                  {t("scrapbook.date", "📅 {{date}}", {
                    date: scrapbookMemories[currentPage].date,
                  })}
                </Text>
              </View>

              <Text style={styles.memoryTitle}>
                {scrapbookMemories[currentPage].task}
              </Text>

              <View style={styles.memoryImagePlaceholder}>
                <Text style={styles.memoryEmoji}>🦕</Text>
              </View>

              <View style={styles.memoryStats}>
                <Text style={styles.statText}>
                  {t("scrapbook.timeSpent", "⏱ Time Spent: {{time}}", {
                    time: scrapbookMemories[currentPage].timeSpent,
                  })}
                </Text>
                <Text style={styles.statText}>
                  {t(
                    "scrapbook.withParent",
                    "👨‍👩‍👧 With Parent: {{involvement}}",
                    {
                      involvement:
                        scrapbookMemories[currentPage].parentInvolvement,
                    }
                  )}
                </Text>
              </View>

              <Text style={styles.memoryDescription}>
                {scrapbookMemories[currentPage].description}
              </Text>
              <Text style={styles.funFact}>
                {t("scrapbook.funFact", "🦴 Fun fact: {{fact}}", {
                  fact: scrapbookMemories[currentPage].funFact,
                })}
              </Text>
              <Text style={styles.commentText}>
                {t("scrapbook.parentComment", "💬 {{comment}}", {
                  comment: scrapbookMemories[currentPage].parentComment,
                })}
              </Text>
            </Card.Content>
          </Card>
        )}

        <View style={styles.navigationControls}>
          <Button
            mode="outlined"
            disabled={currentPage === 0}
            onPress={prevPage}
            icon="chevron-left"
          >
            {t("common.previous", "Previous")}
          </Button>
          <Button
            mode="contained"
            disabled={currentPage === scrapbookMemories.length - 1}
            onPress={nextPage}
            icon="chevron-right"
          >
            {t("common.next", "Next")}
          </Button>
        </View>
      </Modal>
    </Portal>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Welcome Section */}
      <View style={styles.welcomeContainer}>
        <Image
          source={require("../../assets/images/den.png")}
          style={styles.welcomeImage}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.welcomeTitle} numberOfLines={0}>
            {t("dashboard.welcome", "Welcome, {{username}}!", {
              username: user.username,
            })}
          </Text>
          <Text style={styles.welcomeSubtitle}>
            {t(
              "dashboard.keepUpGreatWork",
              "Keep up the great work learning phonics!"
            )}
          </Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        {/* Streak Card now clickable */}
        <Card
          style={[styles.statCard, { marginRight: 16 }]}
          onPress={() => setCalendarVisible(true)}
        >
          <Card.Content style={styles.statContent}>
            <Avatar.Icon size={50} icon="fire" style={styles.streakIcon} />
            <View>
              <Text style={styles.statNumber}>{user.streak}</Text>
              <Text style={styles.statLabel}>
                {t("dashboard.dayStreak", "Day Streak")}
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <Avatar.Icon size={50} icon="star" style={styles.scoreIcon} />
            <View>
              <Text style={styles.statNumber}>{user.score}</Text>
              <Text style={styles.statLabel}>
                {t("dashboard.points", "Points")}
              </Text>
            </View>
          </Card.Content>
        </Card>
      </View>

      {/* Learning Journey */}
      <Card style={styles.progressCard}>
        <Card.Content>
          <Title style={styles.cardTitle}>
            {t("dashboard.learningJourney", "Learning Journey")}
          </Title>
          <View style={styles.progressGrid}>
            <View style={[styles.progressItem, { marginRight: 12 }]}>
              <Avatar.Icon
                size={40}
                icon="clock-outline"
                style={styles.progressIcon}
              />
              <View>
                <Text style={styles.progressNumber}>
                  {progressSummary.totalTime}
                </Text>
                <Text style={styles.progressLabel}>
                  {t("dashboard.totalTime", "Total Time")}
                </Text>
              </View>
            </View>

            <View style={styles.progressItem}>
              <Avatar.Icon
                size={40}
                icon="account-multiple"
                style={styles.progressIcon}
              />
              <View>
                <Text style={styles.progressNumber}>
                  {progressSummary.sessionsWithParent}
                </Text>
                <Text style={styles.progressLabel}>
                  {t("dashboard.withParent", "Quests completed")}
                </Text>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Badges */}
      <Card style={styles.badgesCard}>
        <Card.Content>
          <Title style={styles.cardTitle}>
            {t("dashboard.yourBadges", "Your Badges")}
          </Title>
          <View style={styles.badgesContainer}>
            {userBadges.map((badge) => (
              <View key={badge.id} style={styles.badgeItem}>
                <Image source={badge.image} style={styles.badgeImage} />
                <Text style={styles.badgeName}>{badge.name}</Text>
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>

      {/* Scrapbook Button */}
      <Card style={styles.scrapbookButtonCard}>
        <Card.Content style={styles.scrapbookButtonContent}>
          <View style={styles.scrapbookButtonText}>
            <Text style={styles.scrapbookButtonTitle}>
              {t("dashboard.memoryScrapbook", "Memory Scrapbook")}
            </Text>
            <Text style={styles.scrapbookButtonSubtitle}>
              {t(
                "dashboard.scrapbookSubtitle",
                "Relive your learning adventures with family"
              )}
            </Text>
          </View>
          <Button
            mode="contained"
            style={styles.scrapbookButton}
            onPress={() => setScrapbookVisible(true)}
            icon="book-open-variant"
          >
            {t("dashboard.openScrapbook", "Open Scrapbook")}
          </Button>
        </Card.Content>
      </Card>

      {renderScrapbookModal()}

      {/* Calendar Modal */}
      <Portal>
        <Modal
          visible={calendarVisible}
          onDismiss={() => setCalendarVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 12 }}>
            2025 Activity Calendar
          </Text>
          <ScrollView>
            <CalendarHeatmapGrid data={streakData} />
          </ScrollView>
          <Button
            onPress={() => setCalendarVisible(false)}
            style={{ marginTop: 16 }}
          >
            Close
          </Button>
        </Modal>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5", padding: 16 },

  // Welcome Section
  welcomeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  welcomeImage: {
    width: 150,
    height: 200,
    marginRight: 12,
    marginTop: -30,
    resizeMode: "contain",
  },
  welcomeTitle: {
    color: "#000",
    fontSize: 18,
    marginBottom: 4,
    fontWeight: "bold",
    flexWrap: "wrap",
  },
  welcomeSubtitle: {
    color: "#555",
    fontSize: 14,
  },

  statsContainer: { flexDirection: "row", marginBottom: 16, marginTop: -20 },
  statCard: { flex: 1 },
  statContent: { flexDirection: "row", alignItems: "center" },
  streakIcon: { backgroundColor: "#FF5722", marginRight: 12 },
  scoreIcon: { backgroundColor: "#FFC107", marginRight: 12 },
  statNumber: { fontSize: 24, fontWeight: "bold" },
  statLabel: { color: "#757575", fontSize: 12 },

  progressCard: { marginBottom: 16 },
  cardTitle: { fontSize: 18, marginBottom: 12, fontWeight: "bold" },
  progressGrid: { flexDirection: "row", justifyContent: "space-between" },
  progressItem: { flexDirection: "row", alignItems: "center", flex: 1 },
  progressIcon: { backgroundColor: "#E3F2FD", marginRight: 8 },
  progressNumber: { fontSize: 14, fontWeight: "bold" },
  progressLabel: { fontSize: 11, color: "#757575" },

  badgesCard: { marginBottom: 16 },
  badgesContainer: { flexDirection: "row", flexWrap: "wrap" },
  badgeItem: { alignItems: "center", marginBottom: 12, width: 80 },
  badgeImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    borderColor: "#000000",
    resizeMode: "cover",
    backgroundColor: "#FFF3E0",
  },
  badgeName: { marginTop: 4, textAlign: "center", fontSize: 8 },

  // Scrapbook Button
  scrapbookButtonCard: {
    backgroundColor: "#FFF8E1",
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  scrapbookButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  scrapbookButtonText: { flex: 1 },
  scrapbookButtonTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF6F00",
    marginBottom: 4,
  },
  scrapbookButtonSubtitle: { fontSize: 12, color: "#757575" },
  scrapbookButton: { backgroundColor: "#FF9800" },

  // Scrapbook Modal
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    width: 340, // 90% of screen width
    maxHeight: 500, // 80% of screen height
    paddingVertical: 16,
    alignSelf: "center", // centers modal horizontally
  },
  scrapbookHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  scrapbookTitle: { fontSize: 20, fontWeight: "bold", color: "#333" },

  memoryCard: {
    marginHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#FFF3E0",
    elevation: 3,
    paddingVertical: 16,
  },
  pageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  pageNumber: { fontSize: 12, fontWeight: "bold", color: "#FF6F00" },
  memoryDate: { fontSize: 12, color: "#757575" },
  memoryTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
  memoryImagePlaceholder: {
    height: 120,
    backgroundColor: "#FFE0B2",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  memoryEmoji: { fontSize: 40 },
  memoryStats: { marginBottom: 8 },
  statText: { fontSize: 12, color: "#555" },
  memoryDescription: {
    fontSize: 13,
    color: "#444",
    fontStyle: "italic",
    marginBottom: 8,
  },
  funFact: { fontSize: 12, color: "#F57C00", marginBottom: 4 },
  commentText: { fontSize: 12, fontStyle: "italic", color: "#2E7D32" },
  navigationControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    paddingHorizontal: 16,
  },

  // Calendar Heatmap Styles
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  monthContainer: { width: "24%", marginBottom: 16, alignItems: "center" },
  monthLabel: { fontSize: 10, marginBottom: 4, fontWeight: "bold" },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  daySquare: { width: 10, height: 10, margin: 1, borderRadius: 2 },
});

export default DashboardScreen;
