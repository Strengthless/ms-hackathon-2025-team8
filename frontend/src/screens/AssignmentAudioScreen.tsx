import React, { useState, useEffect } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import {
  Title,
  Text,
  Chip,
  Divider,
  Card,
  TextInput,
  Button,
} from "react-native-paper";
import { Audio } from "expo-av";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import axios from "axios";
import mime from "mime/lite";

import { RootStackParamList } from "../AppNavigator";
import { Status, Question } from "../constants/mockData";

type AssignmentScreenRouteProp = RouteProp<
  RootStackParamList,
  "AssignmentAudio"
>;
type AssignmentScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AssignmentAudio"
>;

type Props = {
  route: AssignmentScreenRouteProp;
  navigation: AssignmentScreenNavigationProp;
};

const AssignmentAudioScreen: React.FC<Props> = ({ route }) => {
  const { t } = useTranslation();
  const { task } = route.params;
  const [completed, setCompleted] = useState(false);
  const [recordedUri, setRecordedUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentId, setCurrentId] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState<Question>();
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [pronunciationScore, setPronunciationScore] = useState();
  const [coloredCodeFeedback, setColoredCodeFeedback] = useState<string>("");

  useEffect(() => {
    if (task) {
      setCompleted(task.status === Status.Completed);
    }
  }, [task]);

  useEffect(() => {
    setCurrentQuestion(task.questions?.find((q) => q.id === currentId));
  }, [currentId, task.questions]);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  if (!task) {
    return (
      <View style={styles.centered}>
        <Text>{t("assignment.noAssignments")}</Text>
      </View>
    );
  }

  if (!task.questions) {
    return (
      <View style={styles.centered}>
        <Text>{t("assignment.noQuestions")}</Text>
      </View>
    );
  }

  const analyzeRecording = async () => {
    if (!recordedUri) return;

    const fileType = mime.getType(recordedUri) || "audio/mp3";

    const formData = new FormData();
    formData.append("audio_file", {
      uri: recordedUri,
      name: recordedUri.split("/").pop() || "recording.mp3",
      type: fileType,
    } as any);

    formData.append("target_text", currentQuestion?.answer || "");
    console.log("Analyzing recording for question:", currentQuestion);

    try {
      const result = await axios.post("http://0.0.0.0:8000/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          maxRedirects: 0, // prevent auto-follow
        },
      });

      const data = result.data;
      console.log(data);

      setFeedback(data.ai_feedback || t("assignment.feedback.noFeedback"));
      setPronunciationScore(data.pronunciation_score || 0);
      setRecordedUri(null);
      setColoredCodeFeedback(data.is_letter_correct_all_words);
    } catch (err) {
      console.error("Error analyzing recording:", err);
      setFeedback(t("assignment.feedback.errorAnalyzing"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderColoredFeedback = (text: string, numberCorrectCode: string) => {
    const textList = text
      .split("")
      .map((char, index) => (index === 0 ? char.toUpperCase() : char));
    const correctCodeList = numberCorrectCode.split("");

    console.log(numberCorrectCode);

    return (
      <Text style={styles.coloredFeedbackSection}>
        {textList.map((char, index) => (
          <Text
            key={index}
            style={
              correctCodeList[index] === "1"
                ? styles.coloredFeedbackGreen
                : styles.coloredFeedbackRed
            }
          >
            {char}
          </Text>
        ))}
      </Text>
    );
  };

  // Start recording
  const startRecording = async () => {
    try {
      console.log("Starting recording...");
      setRecordedUri(null);

      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  // Stop recording
  const stopRecording = async () => {
    console.log("Stopping recording...");
    setIsRecording(false);

    if (!recording) return;

    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log("Recording saved at", uri);
    setRecordedUri(uri);
    setRecording(null);
  };

  const playRecording = async () => {
    if (!recordedUri) return;
    try {
      const { sound } = await Audio.Sound.createAsync({ uri: recordedUri });
      setSound(sound);
      await sound.playAsync();
    } catch (err) {
      console.error("Play error:", err);
    }
  };

  const submitAnswer = async () => {
    setIsSubmitting(true);
    await analyzeRecording();
  };

  // Next card
  const handleNext = () => {
    setFeedback("");
    setColoredCodeFeedback("");
    setRecordedUri(null);
    if (currentId < (task.questions?.length ?? 0) - 1) {
      setCurrentId(currentId + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleRetry = () => {
    setFeedback("");
    setRecordedUri(null);
    setColoredCodeFeedback("");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      {/* Title */}
      <Title style={styles.title}>🦖 {task.title}</Title>

      {/* Tags & Status */}
      <View style={styles.row}>
        <Chip style={styles.tag}>
          {t("curriculumArea." + task.curriculumArea)}
        </Chip>
        <Chip
          style={[
            styles.statusChip as any,
            task.status === Status.Completed
              ? styles.completed
              : styles.pending,
          ]}
        >
          {task.status === Status.Completed
            ? t("assignment.completed")
            : t("assignment.pending")}
        </Chip>
      </View>

      <Divider style={styles.divider} />

      {/* Estimated Time & Deadline & Points */}
      <View style={styles.infoRow}>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>{t("assignment.deadline")}</Text>
          <Text style={styles.infoValue}>{task.dueDate}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>{t("assignment.dinoStar")} ⚡️</Text>
          <Text style={styles.infoValue}>{task.points}</Text>
        </View>
      </View>

      <Divider style={styles.divider} />

      {/* Instructions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {t("assignment.instructions")} 📝
        </Text>
        <Text style={styles.sectionText}>{t(task.instruction)}</Text>
      </View>

      {/* Submission */}
      {completed && (
        // Completion State
        <>
          <View style={styles.completionSection}>
            <MaterialIcons
              name="check-circle"
              size={52}
              color="white"
              style={styles.icon}
            />
            <Text style={styles.completionTitle}>
              {t("assignment.assignmentCompleted")} 🎉
            </Text>
            <Text style={styles.stars}>
              {t("assignment.getStars", { stars: task.points })}
            </Text>
          </View>
        </>
      )}

      {!completed && (
        <View style={styles.card}>
          {feedback === "" && (
            <Text style={styles.word}>{currentQuestion?.question}</Text>
          )}

          {/* Controls Row */}
          <View style={styles.controlsRow}>
            {/* Record button */}
            {feedback === "" && (
              <TouchableOpacity
                style={styles.recordBtn}
                onPress={recording ? stopRecording : startRecording}
              >
                <Ionicons
                  name={
                    recordedUri
                      ? "mic-circle"
                      : isRecording
                      ? "stop-circle"
                      : "mic-circle"
                  }
                  size={70}
                  color={
                    recordedUri ? "orange" : isRecording ? "red" : "#4CAF50"
                  }
                />
                <Text style={styles.btnText}>
                  {recordedUri
                    ? t("assignment.rerecord")
                    : isRecording
                    ? t("assignment.stopRecording")
                    : t("assignment.record")}
                </Text>
              </TouchableOpacity>
            )}

            {/* Playback button */}
            {recordedUri && (
              <TouchableOpacity style={styles.playBtn} onPress={playRecording}>
                <Ionicons name="play-circle" size={70} color="#808080" />
                <Text style={styles.btnText}>
                  {t("assignment.playRecording")}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Submit button */}
          {recordedUri && (
            <TouchableOpacity style={styles.submitBtn} onPress={submitAnswer}>
              <Text style={styles.submitText}>
                {isSubmitting
                  ? t("assignment.checking")
                  : t("assignment.submit")}
              </Text>
            </TouchableOpacity>
          )}

          {/* Feedback */}
          {feedback !== "" && coloredCodeFeedback && (
            <>
              <Text style={styles.word}>
                {t("assignment.getScore", {
                  score: pronunciationScore,
                  total: 100,
                })}
              </Text>
              {renderColoredFeedback(
                currentQuestion?.answer || "",
                coloredCodeFeedback || ""
              )}
              <Text style={styles.feedback}>{feedback}</Text>
            </>
          )}

          {/* Next card */}
          <View style={styles.controlsRow}>
            {feedback !== "" && (
              <>
                <TouchableOpacity style={styles.retryBtn} onPress={handleRetry}>
                  <MaterialIcons
                    style={styles.retryIcon}
                    name="refresh"
                    size={24}
                    color="#fff"
                  />
                  <Text style={styles.nextText}>{t("assignment.retry")}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
                  <MaterialIcons
                    style={styles.nextIcon}
                    name="arrow-forward"
                    size={24}
                    color="#fff"
                  />
                  <Text style={styles.nextText}>{t("assignment.next")}</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 15,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 25,
    marginBottom: 15,
    color: "#2b3a42",
    textAlign: "center",
  },

  row: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  tag: {
    backgroundColor: "#a3d9a5",
    color: "#2a3a2a",
    fontWeight: "bold",
    marginRight: 10,
  },

  statusChip: {
    fontWeight: "bold",
  },

  completed: {
    backgroundColor: "#b2f2bb",
    color: "#1c3b1a",
  },

  pending: {
    backgroundColor: "#fff3b0",
    color: "#8a6d0d",
  },

  divider: {
    marginVertical: 15,
    backgroundColor: "#ddd",
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },

  infoBox: {
    flex: 1,
    alignItems: "center",
  },

  infoLabel: {
    fontWeight: "bold",
    color: "#555",
    marginBottom: 5,
  },

  infoValue: {
    fontSize: 16,
    color: "#222",
  },

  section: {
    marginBottom: 10,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#2b3a42",
  },

  sectionText: {
    fontSize: 15,
    color: "#333",
    marginBottom: 10,
  },

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  completionSection: {
    backgroundColor: "#74C365",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },

  icon: {
    marginBottom: 12,
  },

  completionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
    textAlign: "center",
  },

  stars: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginBottom: 6,
    textAlign: "center",
  },

  score: {
    fontSize: 16,
    fontWeight: "800",
    color: "green",
    marginBottom: 15,
    textAlign: "center",
  },

  feedback: {
    fontSize: 14,
    color: "black",
    textAlign: "center",
    opacity: 0.9,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
    margin: 20,
  },

  word: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },

  recordBtn: {
    alignItems: "center",
    marginBottom: 15,
  },

  btnText: {
    marginTop: 5,
    fontSize: 14,
    color: "#444",
  },

  submitBtn: {
    backgroundColor: "#2196F3",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 12,
    marginTop: 10,
  },

  submitText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  retryBtn: {
    marginRight: 10,
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 12,
    backgroundColor: "#febe00",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  retryIcon: {
    marginRight: 5,
  },

  nextBtn: {
    marginTop: 10,
    marginLeft: 10,
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 12,
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  nextIcon: {
    marginRight: 5,
  },

  nextText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },

  retryText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },

  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },

  playBtn: {
    alignItems: "center",
    marginBottom: 15,
    marginLeft: 40,
  },

  coloredFeedbackRed: {
    color: "#f44336",
    fontWeight: "bold",
    fontSize: 32,
  },

  coloredFeedbackGreen: {
    color: "#4CAF50",
    fontWeight: "bold",
    fontSize: 32,
  },

  coloredFeedbackSection: {
    marginVertical: 20,
  },
});

export default AssignmentAudioScreen;
