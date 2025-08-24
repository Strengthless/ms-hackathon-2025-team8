import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Surface } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useTranslation } from "react-i18next";
import { Task, Status } from "../constants/mockData";

const { width } = Dimensions.get("window");

interface LessonPopupProps {
  visible: boolean;
  lesson: Task | null;
  onClose: () => void;
  onLearnMore: (task: Task) => void;
}

const LessonPopup: React.FC<LessonPopupProps> = ({
  visible,
  lesson,
  onClose,
  onLearnMore,
}) => {
  const { t } = useTranslation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const bubbleAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(bubbleAnim, {
          toValue: 1,
          delay: 200,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.7,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(bubbleAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, fadeAnim, scaleAnim, bubbleAnim, bounceAnim]);

  if (!lesson) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <Animated.View
              style={[
                styles.popupContainer,
                { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
              ]}
            >
              {/* Close Button */}
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <MaterialCommunityIcons name="close" size={28} color="#666" />
              </TouchableOpacity>

              {/* Dino Character */}
              <Animated.View
                style={[
                  styles.dinoContainer,
                  {
                    transform: [
                      {
                        translateY: bounceAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, -8],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Surface style={styles.dinoCircle} elevation={4}>
                  <Text style={styles.dinoEmoji}>
                    {lesson.letter === "Boss"
                      ? "👑"
                      : lesson.status === Status.Completed
                      ? "🦖"
                      : lesson.status === Status.Current
                      ? "🦴"
                      : "🥚"}
                  </Text>

                  <View style={styles.sparkle1}>
                    <Text style={styles.sparkleEmoji}>✨</Text>
                  </View>
                  <View style={styles.sparkle2}>
                    <Text style={styles.sparkleEmoji}>⭐</Text>
                  </View>
                </Surface>
              </Animated.View>

              {/* Speech Bubble */}
              <Animated.View
                style={[
                  styles.speechBubbleContainer,
                  {
                    opacity: bubbleAnim,
                    transform: [
                      {
                        scale: bubbleAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.8, 1],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Surface style={styles.speechBubble} elevation={4}>
                  <View style={styles.bubblePointer} />
                  <View style={styles.bubbleContent}>
                    {/* Title */}
                    <Text style={styles.lessonTitle}>{lesson.title}</Text>

                    {/* Letter Badge */}
                    <Surface style={styles.letterBadge} elevation={4}>
                      <Text style={styles.letterText}>{lesson.letter}</Text>
                    </Surface>

                    {/* Assignment Details */}
                    <View style={styles.assignmentDetails}>
                      {/* Due Date */}
                      <View style={styles.detailRow}>
                        <MaterialCommunityIcons
                          name="calendar"
                          size={16}
                          color="#666"
                        />
                        <Text style={styles.detailLabel}>
                          {t("assignment.deadline")}:{" "}
                        </Text>
                        <Text style={styles.detailValue}>{lesson.dueDate}</Text>
                      </View>

                      {/* Points */}
                      <View style={styles.detailRow}>
                        <MaterialCommunityIcons
                          name="star"
                          size={16}
                          color="#FFD700"
                        />
                        <Text style={styles.detailLabel}>
                          {t("assignment.dinoStar")}:{" "}
                        </Text>
                        <Text style={styles.detailValue}>{lesson.points}</Text>
                      </View>

                      {/* Curriculum Area */}
                      <View style={styles.detailRow}>
                        <MaterialCommunityIcons
                          name="book-open"
                          size={16}
                          color="#666"
                        />
                        <Text style={styles.detailLabel}>
                          {t("assignment.area")}:{" "}
                        </Text>
                        <Text style={styles.detailValue}>
                          {lesson.curriculumArea}
                        </Text>
                      </View>
                    </View>

                    {/* Summary */}
                    <Text style={styles.summaryText}>
                      {lesson.instruction.length > 80
                        ? lesson.instruction.substring(0, 80) + "..."
                        : lesson.instruction}
                    </Text>

                    {/* Action Button */}
                    <TouchableOpacity
                      style={styles.learnMoreButton}
                      onPress={() => onLearnMore(lesson)}
                      activeOpacity={0.8}
                      disabled={lesson.status === Status.Locked}
                    >
                      <MaterialCommunityIcons
                        name={
                          lesson.status === Status.Locked
                            ? "lock"
                            : "rocket-launch"
                        }
                        size={20}
                        color="white"
                        style={styles.buttonIcon}
                      />
                      <Text style={styles.learnMoreText}>
                        {lesson.status === Status.Locked
                          ? t("popup.locked")
                          : lesson.status === Status.Completed
                          ? t("popup.reviewAssignment")
                          : t("popup.startAssignment")}
                      </Text>
                    </TouchableOpacity>

                    {/* Status */}
                    <View style={styles.statusContainer}>
                      <MaterialCommunityIcons
                        name={
                          lesson.status === Status.Completed
                            ? "check-circle"
                            : lesson.status === Status.Current
                            ? "play-circle"
                            : "lock"
                        }
                        size={16}
                        color={
                          lesson.status === Status.Completed
                            ? "#4CAF50"
                            : lesson.status === Status.Current
                            ? "#FF9800"
                            : "#999"
                        }
                      />
                      <Text
                        style={[
                          styles.statusText,
                          {
                            color:
                              lesson.status === Status.Completed
                                ? "#4CAF50"
                                : lesson.status === Status.Current
                                ? "#FF9800"
                                : "#999",
                          },
                        ]}
                      >
                        {lesson.status === Status.Completed
                          ? t("assignment.completed")
                          : lesson.status === Status.Current
                          ? t("assignment.pending")
                          : t("lessonStatus.comingSoon")}
                      </Text>
                    </View>
                  </View>
                </Surface>
              </Animated.View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: width * 0.05,
  },
  popupContainer: {
    alignItems: "center",
    maxWidth: width * 0.9,
    width: "100%",
  },
  closeButton: {
    position: "absolute",
    top: -10,
    right: 10,
    zIndex: 10,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  dinoContainer: { marginBottom: 20, position: "relative" },
  dinoCircle: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: width * 0.125,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#2E7D32",
  },
  dinoEmoji: { fontSize: width * 0.12 },
  sparkle1: { position: "absolute", top: 5, right: 5 },
  sparkle2: { position: "absolute", bottom: 5, left: 5 },
  sparkleEmoji: { fontSize: 16 },
  speechBubbleContainer: { alignItems: "center", width: "100%" },
  speechBubble: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    maxWidth: "100%",
    minWidth: width * 0.75,
    position: "relative",
  },
  bubblePointer: {
    position: "absolute",
    top: -8,
    alignSelf: "center",
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderBottomWidth: 12,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "white",
  },
  bubbleContent: { alignItems: "center" },
  lessonTitle: {
    fontSize: width * 0.055,
    fontWeight: "bold",
    color: "#2E7D32",
    textAlign: "center",
    marginBottom: 16,
  },
  letterBadge: {
    backgroundColor: "#FF9800",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  letterText: { fontSize: width * 0.06, fontWeight: "bold", color: "white" },
  summaryText: {
    fontSize: width * 0.04,
    color: "#555",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  learnMoreButton: {
    backgroundColor: "#6200EE",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginBottom: 16,
  },
  buttonIcon: { marginRight: 8 },
  learnMoreText: {
    color: "white",
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
  statusContainer: { flexDirection: "row", alignItems: "center", gap: 6 },
  statusText: { fontSize: width * 0.035, fontWeight: "500" },
  assignmentDetails: {
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  detailRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  detailLabel: {
    fontSize: 14,
    color: "#666",
    marginLeft: 6,
    fontWeight: "500",
  },
  detailValue: { fontSize: 14, color: "#333", fontWeight: "600" },
});

export default LessonPopup;
