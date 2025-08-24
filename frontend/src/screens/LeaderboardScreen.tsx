import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { Title, Card, Avatar, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { leaderboard as mockLeaderboard } from "../constants/mockData";

const { width } = Dimensions.get("window");

type LeaderboardItem = {
  id: string;
  name: string;
  avatar?: string;
  score: number;
  position: number;
};

// Generate random score for demo
const randomScore = (base: number) => base + Math.floor(Math.random() * 500);

// Generate tab data properly sorted by score
const generateTabData = (source: typeof mockLeaderboard): LeaderboardItem[] => {
  // Map with random scores
  const scoredList = source.map((p) => ({
    id: p.id.toString(),
    name: p.name,
    avatar: p.avatar,
    score: randomScore(p.score),
    position: 0, // placeholder
  }));

  // Sort descending by score
  scoredList.sort((a, b) => b.score - a.score);

  // Assign positions
  const ranked = scoredList.map((p, i) => ({
    ...p,
    position: i + 1,
  }));

  // Return top 3 + next 20
  return ranked.slice(0, 23);
};

const tabData: Record<"day" | "week" | "month", LeaderboardItem[]> = {
  day: generateTabData(mockLeaderboard),
  week: generateTabData(mockLeaderboard),
  month: generateTabData(mockLeaderboard),
};

const LeaderboardScreen: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"day" | "week" | "month">("week");

  const currentList = tabData[activeTab];
  const top3 = currentList.slice(0, 3);
  const rest = currentList.slice(3);

  const medalStyle = (pos: number) => {
    switch (pos) {
      case 1:
        return { color: "#FFD700", border: "#FFD700" }; // gold
      case 2:
        return { color: "#C0C0C0", border: "#C0C0C0" }; // silver
      case 3:
        return { color: "#CD7F32", border: "#CD7F32" }; // bronze
      default:
        return { color: "#15803d", border: "#15803d" }; // green
    }
  };

  const renderTopPlayer = (player: LeaderboardItem) => {
    const medal = medalStyle(player.position);
    const isFirst = player.position === 1;
    const size = isFirst ? 110 : 86;
    const avatarBorder = { borderColor: medal.border, borderWidth: 3 };

    return (
      <View
        key={player.id}
        style={[
          styles.topPlayerCard,
          isFirst ? styles.topPlayerCenter : styles.topPlayerSide,
        ]}
      >
        <View
          style={[
            styles.topAvatarWrap,
            avatarBorder,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        >
          {player.avatar ? (
            <Image
              source={{ uri: player.avatar }}
              style={{ width: "100%", height: "100%", borderRadius: size / 2 }}
            />
          ) : (
            <Avatar.Text
              size={size - 8}
              label={player.name
                .split(" ")
                .map((n: string) => n[0])
                .slice(0, 2)
                .join("")}
              style={{
                backgroundColor: "#F3F3F3",
                justifyContent: "center",
                alignItems: "center",
              }}
              labelStyle={{
                color: "#333",
                fontWeight: "700",
                fontSize: isFirst ? 32 : 22,
              }}
            />
          )}
          <View
            style={[
              styles.trophyBadge,
              isFirst ? styles.trophyBadgeCenter : styles.trophyBadgeSide,
            ]}
          >
            <MaterialCommunityIcons
              name="trophy"
              size={isFirst ? 20 : 16}
              color={medal.color}
            />
          </View>
        </View>

        <Text style={styles.topPlayerName}>{player.name}</Text>
        <Text style={styles.topPlayerScore}>
          {t("leaderboard.points", "{{count}} points", {
            count: player.score.toLocaleString(),
          })}
        </Text>
        <View style={styles.positionLabel}>
          <Text style={[styles.positionText, { color: medal.color }]}>
            #{player.position}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.leaderboardContainer}>
        {/* Title */}
        <View style={styles.titleBlock}>
          <Title style={styles.title}>
            {t("leaderboard.title", "Leaderboard")}
          </Title>
          <Text style={styles.subtitle}>
            {t("leaderboard.subtitle", "Top phonics learners")}
          </Text>
        </View>

        {/* Top 3 */}
        <View style={styles.top3Container}>
          {top3.map((p) => renderTopPlayer(p))}
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {(["month", "week", "day"] as const).map((tabKey) => {
            const active = activeTab === tabKey;
            const label = t(`leaderboard.tabs.${tabKey}`, tabKey);
            return (
              <TouchableOpacity
                key={tabKey}
                onPress={() => setActiveTab(tabKey)}
                style={[styles.tabButton, active && styles.tabActive]}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabText, active && styles.tabTextActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Player list */}
        <ScrollView
          style={styles.listWrapper}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {rest.map((player) => {
            const medal = medalStyle(player.position);
            return (
              <Card key={player.id} style={styles.playerCard}>
                <Card.Content style={styles.playerContent}>
                  <View style={styles.avatarSmall}>
                    {player.avatar ? (
                      <Image
                        source={{ uri: player.avatar }}
                        style={styles.avatarSmallImage}
                      />
                    ) : (
                      <Avatar.Text
                        size={40}
                        label={player.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .slice(0, 2)
                          .join("")}
                        style={{ backgroundColor: "#FFF" }}
                        labelStyle={{ color: "#333", fontWeight: "700" }}
                      />
                    )}
                  </View>

                  <View style={styles.playerInfo}>
                    <Text style={styles.playerName}>{player.name}</Text>
                    <Text style={styles.playerScore}>
                      {t("leaderboard.points", "{{count}} points", {
                        count: player.score.toLocaleString(),
                      })}
                    </Text>
                  </View>

                  <View
                    style={[styles.positionPill, { borderColor: medal.border }]}
                  >
                    <Text
                      style={[styles.positionPillText, { color: medal.color }]}
                    >
                      #{player.position}
                    </Text>
                  </View>
                </Card.Content>
              </Card>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#C6F6D5" },
  leaderboardContainer: {
    flex: 1,
    backgroundColor: "#FFF",
    marginTop: 0,
    paddingTop: 18,
    paddingHorizontal: 16,
  },
  titleBlock: { alignItems: "center", marginBottom: 8 },
  title: { fontSize: 22, fontWeight: "700", color: "#15803d" },
  subtitle: { color: "#555", marginTop: 4, fontSize: 13 },
  top3Container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 6,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  topPlayerCard: { alignItems: "center", width: (width - 64) / 3 },
  topPlayerSide: { transform: [{ translateY: 10 }] },
  topPlayerCenter: { transform: [{ translateY: -8 }] },
  topAvatarWrap: {
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 54,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    position: "relative",
  },
  trophyBadge: {
    position: "absolute",
    bottom: -10,
    right: -10,
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 4,
    elevation: 6,
  },
  trophyBadgeCenter: { right: -14 },
  trophyBadgeSide: { right: -10 },
  topPlayerName: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
  },
  topPlayerScore: { fontSize: 12, color: "#666", marginTop: 4 },
  positionLabel: {
    marginTop: 6,
    backgroundColor: "rgba(0,0,0,0.03)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  positionText: { fontWeight: "700", fontSize: 12 },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 12,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 22,
    backgroundColor: "#D8F3DC",
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: "#6AA84F",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  tabText: { fontWeight: "700", color: "#3A6B35" },
  tabTextActive: { color: "#2C5234" },
  playerName: { fontSize: 15, fontWeight: "700", color: "#15803d" },
  listWrapper: { marginTop: 6 },
  playerCard: {
    marginVertical: 6,
    borderRadius: 14,
    overflow: "hidden",
    elevation: 2,
  },
  playerContent: { flexDirection: "row", alignItems: "center", padding: 12 },
  avatarSmall: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarSmallImage: { width: 44, height: 44, borderRadius: 22 },
  playerInfo: { flex: 1, marginLeft: 12 },
  playerScore: { color: "#555", marginTop: 2 },
  positionPill: {
    borderWidth: 1.5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 18,
  },
  positionPillText: { fontWeight: "700" },
});

export default LeaderboardScreen;
