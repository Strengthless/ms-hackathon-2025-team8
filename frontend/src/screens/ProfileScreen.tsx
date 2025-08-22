import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Title, Card, Avatar, Text, Button } from "react-native-paper";
import { users, badges as allBadges } from "../constants/mockData";

const ProfileScreen = ({ navigation }) => {
  const user = users[0];
  const userBadges = allBadges.filter((badge) =>
    user.badges.includes(badge.name.toLowerCase().replace(" ", "_"))
  );

  const handleLogout = () => {
    // In a real app, you would clear authentication state
    navigation.navigate("Login");
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.profileCard}>
        <Card.Content style={styles.profileContent}>
          <Avatar.Icon size={80} icon="account" style={styles.avatar} />
          <View style={styles.profileInfo}>
            <Title style={styles.username}>{user.username}</Title>
            <Text>Phonics Learner</Text>
            <View style={styles.stats}>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>{user.streak}</Text>
                <Text style={styles.statLabel}>Day Streak</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>{user.score}</Text>
                <Text style={styles.statLabel}>Points</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>{userBadges.length}</Text>
                <Text style={styles.statLabel}>Badges</Text>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.badgesCard}>
        <Card.Content>
          <Title>Your Badges</Title>
          <View style={styles.badgesContainer}>
            {userBadges.map((badge) => (
              <View key={badge.id} style={styles.badgeItem}>
                <Avatar.Icon
                  size={60}
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

      <Card style={styles.settingsCard}>
        <Card.Content>
          <Title>Settings</Title>
          <Button
            mode="outlined"
            style={styles.settingButton}
            icon="account-edit"
          >
            Edit Profile
          </Button>
          <Button mode="outlined" style={styles.settingButton} icon="bell">
            Notifications
          </Button>
          <Button
            mode="outlined"
            style={styles.settingButton}
            icon="help-circle"
          >
            Help & Support
          </Button>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={handleLogout}
        style={styles.logoutButton}
        labelStyle={styles.logoutButtonLabel}
        icon="logout"
      >
        Logout
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  profileCard: {
    margin: 16,
  },
  profileContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    backgroundColor: "#6200EE",
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  username: {
    fontSize: 24,
  },
  stats: {
    flexDirection: "row",
    marginTop: 10,
  },
  stat: {
    alignItems: "center",
    marginRight: 20,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    color: "#757575",
    fontSize: 12,
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
  settingsCard: {
    margin: 16,
  },
  settingButton: {
    marginVertical: 5,
    borderColor: "#6200EE",
  },
  logoutButton: {
    margin: 16,
    backgroundColor: "#F44336",
  },
  logoutButtonLabel: {
    color: "white",
  },
});

export default ProfileScreen;
