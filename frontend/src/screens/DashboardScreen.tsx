import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Title, Card, Text, Avatar } from "react-native-paper";
import { users, badges as allBadges } from "../constants/mockData";
import { useTranslation } from "react-i18next";

const DashboardScreen = () => {
  const { t } = useTranslation();

  const user = users[0];
  const userBadges = allBadges.filter((badge) =>
    user.badges.includes(badge.name.toLowerCase().replace(" ", "_"))
  );

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.welcomeCard}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.welcomeTitle}>
            {t("dashboard.welcome", { username: user.username })}
          </Text>
          <Text>Keep up the great work learning phonics!</Text>
        </Card.Content>
      </Card>

      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <Avatar.Icon size={50} icon="fire" style={styles.streakIcon} />
            <View>
              <Text style={styles.statNumber}>{user.streak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <Avatar.Icon size={50} icon="star" style={styles.scoreIcon} />
            <View>
              <Text style={styles.statNumber}>{user.score}</Text>
              <Text style={styles.statLabel}>Points</Text>
            </View>
          </Card.Content>
        </Card>
      </View>

      <Card style={styles.badgesCard}>
        <Card.Content>
          <Title>Your Badges</Title>
          <View style={styles.badgesContainer}>
            {userBadges.map((badge) => (
              <View key={badge.id} style={styles.badgeItem}>
                <Avatar.Icon
                  size={50}
                  icon={badge.icon}
                  style={{ backgroundColor: badge.color }}
                  color="white"
                />
                <Text style={styles.badgeName}>{badge.name}</Text>
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.tipCard}>
        <Card.Content>
          <Title>Today's Tip</Title>
          <Text>
            Practice the 'sh' sound today! Try saying "ship", "shop", and "wish"
            out loud.
          </Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  welcomeCard: {
    margin: 16,
    backgroundColor: "#6200EE",
  },
  welcomeTitle: {
    color: "white",
    fontSize: 24,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  statCard: {
    width: "48%",
  },
  statContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  streakIcon: {
    backgroundColor: "#FF5722",
    marginRight: 10,
  },
  scoreIcon: {
    backgroundColor: "#FFC107",
    marginRight: 10,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
  },
  statLabel: {
    color: "#757575",
  },
  badgesCard: {
    margin: 16,
  },
  badgesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginTop: 10,
  },
  badgeItem: {
    alignItems: "center",
    margin: 10,
    width: 100,
  },
  badgeName: {
    marginTop: 5,
    textAlign: "center",
    fontSize: 12,
  },
  tipCard: {
    margin: 16,
    backgroundColor: "#E8F5E9",
  },
});

export default DashboardScreen;
