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
} from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";

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
            count === 0 ? "#eee" : `rgba(34,139,34,${0.2 + 0.15 * count})`;
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
}) => (
  <View style={styles.gridContainer}>
    {Array.from({ length: 12 }, (_, i) => (
      <CalendarHeatmapMonth key={i} monthIndex={i} data={data} />
    ))}
  </View>
);

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

// Corrected image paths - adjust these based on your actual file structure
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

const progressSummary = {
  totalTime: "12h 45m",
  sessionsWithParent: "15",
  recentAchievement: "7-Day Streak!",
};

const DashboardScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [calendarVisible, setCalendarVisible] = useState(false);

  const user = users[0];
  const userBadges = badges.filter((badge) =>
    user.badges.includes(badge.name.toLowerCase().replace(" ", "_"))
  );

  const streakData: Record<string, number> = {
    "2025-08-18": 1,
    "2025-08-19": 1,
    "2025-08-20": 1,
    "2025-08-21": 1,
    "2025-08-22": 1,
    "2025-08-23": 1,
    "2025-08-24": 1,
  };

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

      {/* Story Time Button - GREEN THEME */}
      <Card style={styles.storybookButtonCard}>
        <Card.Content style={styles.storybookButtonContent}>
          <View style={styles.storybookButtonText}>
            <Text style={styles.storybookButtonTitle}>
              {t("dashboard.storyTime", "Story Time")}
            </Text>
            <Text style={styles.storybookButtonSubtitle}>
              {t(
                "dashboard.storySubtitle",
                "Read stories together with your child"
              )}
            </Text>
          </View>
          <Button
            mode="contained"
            style={styles.storybookButton}
            onPress={() => navigation.navigate("Dino Library")}
            icon="book-open-variant"
          >
            {t("dashboard.readStories", "Read Stories")}
          </Button>
        </Card.Content>
      </Card>

      {/* Stats */}
      <View style={styles.statsContainer}>
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

      {/* Calendar Modal */}
      <Portal>
        <Modal
          visible={calendarVisible}
          onDismiss={() => setCalendarVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 16,
              marginBottom: 12,
              textAlign: "center",
            }}
          >
            {t("dashboard.calendarTitle", "2025 Activity Calendar")}
          </Text>

          <ScrollView>
            <CalendarHeatmapGrid data={streakData} />
          </ScrollView>
          <Button
            onPress={() => setCalendarVisible(false)}
            style={{ marginTop: 16 }}
          >
            {t("dashboard.close", "Close")}
          </Button>
        </Modal>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5", padding: 16 },

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
  welcomeSubtitle: { color: "#555", fontSize: 14 },

  storybookButtonCard: {
    backgroundColor: "#D4EDDA",
    marginBottom: 37,
    borderRadius: 12,
    elevation: 2,
  },
  storybookButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  storybookButtonText: { flex: 1 },
  storybookButtonTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 4,
  },
  storybookButtonSubtitle: { fontSize: 12, color: "#388E3C" },
  storybookButton: { backgroundColor: "#43A047" },

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

  modalContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    width: 340,
    maxHeight: 500,
    paddingVertical: 16,
    alignSelf: "center",
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
