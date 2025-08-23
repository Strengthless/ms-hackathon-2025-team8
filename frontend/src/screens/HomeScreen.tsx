import React, { useRef, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Alert,
  Animated,
} from "react-native";
import { Text, Surface } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import {
  users,
  footprintPatterns,
  lessonPositions,
  localizedLessons,
  type LessonStatus,
  type Lesson,
} from "../constants/mockData";
import LessonPopup from "../components/LessonPopup";

const { width } = Dimensions.get("window");

interface HomeScreenProps {
  navigation?: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const user = users[0];
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [hoveredLesson, setHoveredLesson] = useState<number | null>(null);

  // Popup state
  const [showPopup, setShowPopup] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous pulse animation for current lesson
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim, slideAnim, pulseAnim]);

  const handleLessonPress = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    setSelectedLesson(null);
  };

  const handleLearnMore = () => {
    if (!selectedLesson) return;

    // Close popup first
    setShowPopup(false);

    // Then handle the lesson start logic
    startPronunciation(selectedLesson);

    // Reset selected lesson
    setSelectedLesson(null);
  };

  const startPronunciation = (lesson: Lesson) => {
    if (lesson.status === "locked") {
      Alert.alert(
        t("alerts.adventureLocked.title"),
        t("alerts.adventureLocked.message"),
        [{ text: t("alerts.adventureLocked.button") }]
      );
      return;
    }

    const lessonTitle = t(lesson.titleKey);
    Alert.alert(
      t("alerts.startAdventure.title", { lessonTitle }),
      t("alerts.startAdventure.message"),
      [
        { text: t("alerts.startAdventure.cancelButton"), style: "cancel" },
        {
          text: t("alerts.startAdventure.confirmButton"),
          onPress: () => {
            if (navigation) {
              // navigation.navigate('PronunciationPractice', { lesson });
            }
            console.log(t("console.startingAdventure"), lesson.letter);
          },
        },
      ]
    );
  };

  const getStatusStyle = (status: LessonStatus, isHovered: boolean = false) => {
    let baseStyle;

    switch (status) {
      case "completed":
        baseStyle = styles.completed;
        break;
      case "current":
        baseStyle = styles.current;
        break;
      case "locked":
        baseStyle = styles.locked;
        break;
      default:
        baseStyle = styles.locked;
    }

    return [baseStyle, isHovered && status !== "locked" && styles.hovered];
  };

  const getFootprintPosition = (
    index: number
  ): {
    footprints: { offsetX: number; offsetY: number; rotation: string }[];
  } => {
    const stepInWeek = index % 6;
    const patternIndex = stepInWeek % 5;
    const pattern = footprintPatterns[patternIndex];

    return {
      footprints: pattern.footprints.map((fp) => ({
        offsetX: fp.offsetX * width,
        offsetY: fp.offsetY,
        rotation: fp.rotation,
      })),
    };
  };

  const renderFootprint = (index: number) => {
    const position = getFootprintPosition(index);

    return (
      <View style={styles.footprintGroupContainer}>
        {position.footprints.map((footprint, footprintIndex) => (
          <Animated.View
            key={footprintIndex}
            style={[
              styles.footprintContainer,
              {
                opacity: fadeAnim,
                transform: [
                  { translateX: footprint.offsetX },
                  { translateY: footprint.offsetY },
                  { rotate: footprint.rotation },
                ],
              },
            ]}
          >
            <Text style={styles.footprint}>🐾</Text>
          </Animated.View>
        ))}
      </View>
    );
  };

  const getLessonPosition = (index: number): { offsetX: number } => {
    const patternIndex = index % lessonPositions.length;
    const position = lessonPositions[patternIndex];

    return {
      offsetX: position.offsetX * width,
    };
  };

  const getStatusText = (status: LessonStatus) => {
    switch (status) {
      case "completed":
        return t("lessonStatus.mastered");
      case "current":
        return t("lessonStatus.readyToLearn");
      case "locked":
        return t("lessonStatus.comingSoon");
      default:
        return t("lessonStatus.comingSoon");
    }
  };

  const renderLessonNode = (lesson: Lesson, index: number) => {
    const position = getLessonPosition(index);
    const isHovered = hoveredLesson === lesson.id;

    return (
      <Animated.View
        key={lesson.id}
        style={[
          styles.lessonContainer,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { translateX: position.offsetX },
            ],
          },
        ]}
      >
        {/* Lesson Node */}
        <TouchableOpacity
          style={[
            styles.lessonNode,
            ...getStatusStyle(lesson.status, isHovered),
            lesson.status === "current" && {
              transform: [{ scale: pulseAnim }],
            },
            isHovered && { transform: [{ scale: 1.05 }] },
          ]}
          onPress={() => handleLessonPress(lesson)}
          onPressIn={() => setHoveredLesson(lesson.id)}
          onPressOut={() => setHoveredLesson(null)}
          activeOpacity={lesson.status === "locked" ? 1 : 0.7}
        >
          <Text style={styles.dinoEmoji}>{lesson.dinoEmoji}</Text>

          {lesson.status === "current" && (
            <Animated.View style={styles.playButton}>
              <MaterialCommunityIcons name="play" size={16} color="white" />
            </Animated.View>
          )}

          {lesson.status === "completed" && (
            <View style={styles.checkmark}>
              <MaterialCommunityIcons
                name="check-bold"
                size={14}
                color="white"
              />
            </View>
          )}

          {lesson.titleKey.includes("Boss") && <View style={styles.bossGlow} />}

          {/* Hover sparkle effect */}
          {isHovered && lesson.status !== "locked" && (
            <View style={styles.hoverEffect}>
              <Text style={styles.hoverEmoji}>✨</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.lessonInfo}>
          <Text
            style={[
              styles.lessonTitle,
              isHovered && lesson.status !== "locked" && styles.titleHovered,
            ]}
            numberOfLines={1}
          >
            {t(lesson.titleKey)}
          </Text>
          <Text style={styles.lessonSubtitle} numberOfLines={1}>
            {getStatusText(lesson.status)}
          </Text>
        </View>
      </Animated.View>
    );
  };

  const renderWeekHeader = (weekNum: number) => {
    return (
      <Animated.View
        style={[
          styles.weekHeader,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Surface style={styles.weekBadge} elevation={2}>
          <MaterialCommunityIcons
            name="calendar-star"
            size={18}
            color="white"
          />
          <Text style={styles.weekText}>{t("week", { number: weekNum })}</Text>
        </Surface>
      </Animated.View>
    );
  };

  return (
    <>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        bounces={true}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Enhanced Header Stats Bar */}
        <View style={styles.headerContainer}>
          <View style={styles.headerBackground}>
            <View style={styles.headerContent}>
              <View style={styles.titleContainer}>
                <Text style={styles.journeyText}>🦕 Dino Adventure</Text>
                <Text style={styles.subtitle}>
                  Explore the prehistoric world of pronunciation!
                </Text>
              </View>

              <View style={styles.statsContainer}>
                <View style={[styles.statCard, styles.streakCard]}>
                  <View style={styles.statIconContainer}>
                    <MaterialCommunityIcons
                      name="fire"
                      size={24}
                      color="white"
                    />
                  </View>
                  <View style={styles.statTextContainer}>
                    <Text style={styles.statNumber}>{user.streak}</Text>
                    <Text style={styles.statLabel}>Day Streak</Text>
                  </View>
                </View>

                <View style={[styles.statCard, styles.powerCard]}>
                  <View style={styles.statIconContainer}>
                    <MaterialCommunityIcons
                      name="lightning-bolt"
                      size={24}
                      color="#333"
                    />
                  </View>
                  <View style={styles.statTextContainer}>
                    <Text style={[styles.statNumber, { color: "#333" }]}>
                      {user.score}
                    </Text>
                    <Text style={[styles.statLabel, { color: "#333" }]}>
                      Dino Power
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Main Roadmap */}
        <View style={styles.roadmap}>
          {/* Week 1 Section */}
          {renderWeekHeader(1)}
          <View style={styles.weekSection}>
            {localizedLessons.slice(0, 6).map((lesson, index) => (
              <View key={lesson.id}>
                {renderLessonNode(lesson, index)}
                {/* Add footprint between lessons (except after the last one) */}
                {index < 5 && renderFootprint(index)}
              </View>
            ))}
          </View>

          {/* Week 2 Section */}
          {renderWeekHeader(2)}
          <View style={styles.weekSection}>
            {localizedLessons.slice(6, 12).map((lesson, index) => (
              <View key={lesson.id}>
                {renderLessonNode(lesson, index + 6)}
                {/* Add footprint between lessons (except after the last one) */}
                {index < 5 && renderFootprint(index + 6)}
              </View>
            ))}
          </View>

          {/* Coming Soon Section */}
          <Animated.View
            style={[
              styles.comingSoon,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            <Text variant="titleMedium" style={styles.comingSoonTitle}>
              {t("home.moreAdventuresAhead")}
            </Text>
            <Text style={styles.comingSoonText}>
              {t("home.keepPracticing")}
            </Text>
          </Animated.View>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Lesson Popup */}
      <LessonPopup
        visible={showPopup}
        lesson={selectedLesson}
        onClose={handlePopupClose}
        onLearnMore={handleLearnMore}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  headerContainer: {
    padding: 10,
  },
  headerBackground: {
    backgroundColor: "#4CAF50",
    borderRadius: 16,
    padding: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerContent: {
    flexDirection: "column",
  },
  titleContainer: {
    marginBottom: 16,
  },
  journeyText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    padding: 12,
    flex: 1,
    marginHorizontal: 5,
  },
  streakCard: {
    backgroundColor: "rgba(255, 87, 34, 0.2)",
  },
  powerCard: {
    backgroundColor: "rgba(255, 193, 7, 0.3)",
  },
  statIconContainer: {
    marginRight: 8,
  },
  statTextContainer: {
    flexDirection: "column",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  statLabel: {
    fontSize: 12,
    color: "white",
    opacity: 0.9,
  },
  roadmap: {
    paddingTop: 15,
    alignItems: "center",
    position: "relative",
  },
  weekHeader: {
    alignItems: "center",
    marginVertical: 20,
  },
  weekBadge: {
    backgroundColor: "#689F38",
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  weekText: {
    color: "white",
    fontWeight: "bold",
    fontSize: width * 0.038,
  },
  weekSection: {
    width: "100%",
    paddingHorizontal: width * 0.04,
  },
  lessonContainer: {
    alignItems: "center",
    marginVertical: 18,
    position: "relative",
  },
  lessonNode: {
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: width * 0.1,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    position: "relative",
  },
  completed: {
    backgroundColor: "#689F38",
    borderWidth: 3,
    borderColor: "#4B830D",
  },
  current: {
    backgroundColor: "#FF9800",
    borderWidth: 3,
    borderColor: "#F57C00",
  },
  locked: {
    backgroundColor: "#CFD8DC",
    borderWidth: 2,
    borderColor: "#B0BEC5",
  },
  hovered: {
    elevation: 10,
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  dinoEmoji: {
    fontSize: width * 0.08,
  },
  playButton: {
    position: "absolute",
    bottom: -8,
    right: -8,
    backgroundColor: "#E65100",
    borderRadius: 16,
    padding: 6,
    elevation: 4,
  },
  checkmark: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#2E7D32",
    borderRadius: 12,
    padding: 5,
    elevation: 4,
  },
  bossGlow: {
    position: "absolute",
    width: width * 0.24,
    height: width * 0.24,
    borderRadius: width * 0.12,
    backgroundColor: "#FFD600",
    opacity: 0.2,
    zIndex: -1,
  },
  hoverEffect: {
    position: "absolute",
    top: -12,
    left: -12,
    right: -12,
    bottom: -12,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  hoverEmoji: {
    fontSize: 14,
  },
  lessonInfo: {
    alignItems: "center",
    marginTop: 10,
    maxWidth: width * 0.32,
  },
  lessonTitle: {
    fontSize: width * 0.036,
    fontWeight: "600",
    color: "#455A64",
    textAlign: "center",
    marginBottom: 2,
  },
  titleHovered: {
    color: "#263238",
    fontSize: width * 0.038,
  },
  lessonSubtitle: {
    fontSize: width * 0.028,
    color: "#78909C",
    textAlign: "center",
    fontWeight: "500",
  },
  comingSoon: {
    alignItems: "center",
    marginTop: 40,
    padding: width * 0.06,
    backgroundColor: "#E3F2FD",
    borderRadius: 16,
    elevation: 2,
    marginHorizontal: width * 0.05,
    borderWidth: 1,
    borderColor: "#BBDEFB",
  },
  comingSoonTitle: {
    fontSize: width * 0.042,
    fontWeight: "600",
    color: "#1565C0",
    textAlign: "center",
    marginBottom: 8,
  },
  comingSoonText: {
    fontSize: width * 0.032,
    color: "#5C6BC0",
    textAlign: "center",
    lineHeight: 20,
  },
  bottomSpace: {
    height: 30,
  },
  footprintGroupContainer: {
    alignItems: "center",
    marginVertical: 8,
    position: "relative",
  },
  footprintContainer: {
    position: "absolute",
    alignItems: "center",
  },
  footprint: {
    fontSize: 20,
    opacity: 0.5,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});

export default HomeScreen;
