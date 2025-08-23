import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import {
  Title,
  Card,
  Avatar,
  Text,
  Button,
  IconButton,
  Portal,
  Modal,
} from "react-native-paper";
import { leaderboard } from "../constants/mockData";

// Mock weekly progress data
const weeklyProgress = [
  {
    week: 1,
    task: "Alphabet Adventure",
    date: "Jan 1, 2025",
    description: "Learned letters A-G",
    timeSpent: "45m",
  },
  {
    week: 2,
    task: "Word Hunter",
    date: "Jan 8, 2025",
    description: "Mastered 10 new words",
    timeSpent: "30m",
  },
  {
    week: 3,
    task: "Sight Word Safari",
    date: "Jan 15, 2025",
    description: "Completed first sight word challenge",
    timeSpent: "25m",
  },
];

const LeaderboardScreen = () => {
  const [journalVisible, setJournalVisible] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(0);

  const nextWeek = () => {
    if (currentWeek < weeklyProgress.length - 1)
      setCurrentWeek(currentWeek + 1);
  };

  const prevWeek = () => {
    if (currentWeek > 0) setCurrentWeek(currentWeek - 1);
  };

  const downloadPDF = () => {
    // Placeholder for PDF download logic
    Alert.alert(
      "Download PDF",
      `Week ${weeklyProgress[currentWeek].week} progress downloaded!`
    );
  };

  const getMedalIcon = (position: number) => {
    switch (position) {
      case 1:
        return { icon: "numeric-1-circle", color: "#FFD700" };
      case 2:
        return { icon: "numeric-2-circle", color: "#C0C0C0" };
      case 3:
        return { icon: "numeric-3-circle", color: "#CD7F32" };
      default:
        return { icon: "numeric-" + position + "-circle", color: "#6200EE" };
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Weekly Progress Journal */}
      <Card style={styles.journalCard}>
        <Card.Content>
          <View style={styles.journalHeader}>
            <Text style={styles.journalTitle}>📓 Weekly Progress Journal</Text>
            <IconButton icon="download" size={24} onPress={downloadPDF} />
          </View>

          <Card style={styles.weekCard}>
            <Card.Content>
              <Text style={styles.weekLabel}>
                Week {weeklyProgress[currentWeek].week}
              </Text>
              <Text style={styles.weekDate}>
                {weeklyProgress[currentWeek].date}
              </Text>
              <Text style={styles.weekTask}>
                {weeklyProgress[currentWeek].task}
              </Text>
              <Text style={styles.weekDescription}>
                {weeklyProgress[currentWeek].description}
              </Text>
              <Text style={styles.weekTime}>
                ⏱ Time Spent: {weeklyProgress[currentWeek].timeSpent}
              </Text>
            </Card.Content>
          </Card>

          <View style={styles.navigationControls}>
            <Button
              mode="outlined"
              disabled={currentWeek === 0}
              onPress={prevWeek}
              icon="chevron-left"
            >
              Previous
            </Button>
            <Button
              mode="contained"
              disabled={currentWeek === weeklyProgress.length - 1}
              onPress={nextWeek}
              icon="chevron-right"
            >
              Next
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* Leaderboard Header */}
      <View style={styles.header}>
        <Title style={styles.title}>Weekly Leaderboard</Title>
        <Text style={styles.subtitle}>Top phonics learners this week</Text>
      </View>

      {/* Leaderboard Players */}
      {leaderboard.map((player) => {
        const medal = getMedalIcon(player.position);
        return (
          <Card key={player.id} style={styles.playerCard}>
            <Card.Content style={styles.playerContent}>
              <Avatar.Icon
                size={40}
                icon={medal.icon}
                style={{ backgroundColor: medal.color }}
                color="white"
              />
              <View style={styles.playerInfo}>
                <Text style={styles.playerName}>{player.name}</Text>
                <Text style={styles.playerScore}>{player.score} points</Text>
              </View>
              <Text style={styles.playerPosition}>#{player.position}</Text>
            </Card.Content>
          </Card>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },

  // Journal Styles
  journalCard: {
    margin: 16,
    borderRadius: 12,
    backgroundColor: "#FFF8E1",
    elevation: 2,
  },
  journalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  journalTitle: { fontSize: 18, fontWeight: "bold", color: "#FF6F00" },
  weekCard: { borderRadius: 12, backgroundColor: "#FFE0B2", marginBottom: 8 },
  weekLabel: { fontSize: 14, fontWeight: "bold", color: "#FF6F00" },
  weekDate: { fontSize: 12, color: "#757575", marginBottom: 4 },
  weekTask: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  weekDescription: { fontSize: 13, fontStyle: "italic", marginBottom: 4 },
  weekTime: { fontSize: 12, color: "#555" },
  navigationControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },

  // Leaderboard Styles
  header: { padding: 16 },
  title: { fontSize: 24, fontWeight: "bold" },
  subtitle: { color: "#757575", marginTop: 5 },
  playerCard: { marginHorizontal: 16, marginVertical: 8 },
  playerContent: { flexDirection: "row", alignItems: "center" },
  playerInfo: { flex: 1, marginLeft: 16 },
  playerName: { fontSize: 16, fontWeight: "bold" },
  playerScore: { color: "#757575" },
  playerPosition: { fontSize: 18, fontWeight: "bold", color: "#6200EE" },
});

export default LeaderboardScreen;
