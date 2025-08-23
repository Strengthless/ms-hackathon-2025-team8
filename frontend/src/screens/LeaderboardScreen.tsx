import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Title, Card, Avatar, Text } from "react-native-paper";
import { leaderboard } from "../constants/mockData";

const LeaderboardScreen = () => {
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
      <View style={styles.header}>
        <Title style={styles.title}>Weekly Leaderboard</Title>
        <Text style={styles.subtitle}>Top phonics learners this week</Text>
      </View>

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
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#757575",
    marginTop: 5,
  },
  playerCard: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  playerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  playerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  playerName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  playerScore: {
    color: "#757575",
  },
  playerPosition: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6200EE",
  },
});

export default LeaderboardScreen;
