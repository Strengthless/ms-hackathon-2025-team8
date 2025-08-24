import React, { useState, useEffect } from "react";
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Title, Text, Chip, Divider } from "react-native-paper";
import { Audio } from "expo-av";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { RootStackParamList } from "../AppNavigator";
import { tasks, AssignmentDetail, Status } from "../constants/mockData";

type AssignmentScreenRouteProp = RouteProp<RootStackParamList, "AssignmentAudio">;
type AssignmentScreenNavigationProp = StackNavigationProp<RootStackParamList, "AssignmentAudio">;

type Props = {
  route: AssignmentScreenRouteProp;
  navigation: AssignmentScreenNavigationProp;
};

const AssignmentAudioScreen: React.FC<Props> = ({ route }) => {
    const { t } = useTranslation();
    const { ass_id } = route.params;
    const task: AssignmentDetail | undefined = tasks.find(t => t.id === ass_id);
    const [completed, setCompleted] = useState(false);
    const [recordedUri, setRecordedUri] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [feedback, setFeedback] = useState<string>('');

    const questions = [
        "i want to swim", "i want to sleep", "i want to eat", "i want to go gaming"
    ]

    const currentQuestion = questions[currentIndex];

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

        // Pass to backend for checking
        // const result = await onSubmitAnswer(uri, currentQuestion);

        // setFeedback(result);
        // setRecording(null);
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

    useEffect(() => {
        return sound
          ? () => {
              sound.unloadAsync();
            }
          : undefined;
    }, [sound]);

    const submitAnswer = async () => {
        setRecordedUri(null);
        setFeedback('Good Job!');
    }

    // Next card
    const handleNext = () => {
        setFeedback('');
        if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        } else {
        setCompleted(true);
        }
    };

    const handleRetry = () => {
        setFeedback('');
        setRecordedUri(null);
    };

    useEffect(() => {
        if (task) {
            setCompleted(task.status === Status.Completed);
        }
    }, [])

    if (!task) {
        return (
        <View style={styles.centered}>
            <Text>{t("assignment.noAssignments")}</Text>
        </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Title */}
        <Title style={styles.title}>🦖 {task.title}</Title>

        {/* Tags & Status */}
        <View style={styles.row}>
            <Chip style={styles.tag}>{task.curriculumArea}</Chip>
            <Chip style={[styles.statusChip, task.status === Status.Completed ? styles.completed : styles.pending]}>
            {task.status === Status.Completed ? t("assignment.completed") : t("assignment.pending")}
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
            <Text style={styles.infoLabel}>{t("assignment.dinoStar")} 🌟</Text>
            <Text style={styles.infoValue}>{task.points}</Text>
            </View>
        </View>

        <Divider style={styles.divider} />

        {/* Instructions */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("assignment.instructions")} 📝</Text>
            <Text style={styles.sectionText}>{task.instruction}</Text>
        </View>

        {/* Submission */}
        {completed && (
        // Completion State (Will use data response from backend later)
        <View style={styles.completionSection}>
            <MaterialIcons name="check-circle" size={52} color="white" style={styles.icon} />
            <Text style={styles.completionTitle}>{t("assignment.assignmentCompleted")} 🎉</Text>
            <Text style={styles.stars}>{t("assignment.getStars", {stars: task.points})}</Text>
        </View>
        )}

        {!completed && (
        <View style={styles.card}>
            <Text style={styles.word}>{currentQuestion}</Text>

            {/* Controls Row */}
            <View style={styles.controlsRow}>
            {/* Record button */}
            {feedback === "" && (
                <TouchableOpacity
                style={styles.recordBtn}
                onPress={recording ? stopRecording : startRecording}
                >
                <Ionicons
                    name={recordedUri ? "mic-circle" : recording ? "stop-circle" : "mic-circle"}
                    size={70}
                    color={recordedUri ? "orange" : recording ? "red" : "#4CAF50"}
                />
                <Text style={styles.btnText}>
                    {recordedUri
                    ? t("assignment.rerecord")
                    : recording
                    ? t("assignment.stopRecording")
                    : t("assignment.record")}
                </Text>
                </TouchableOpacity>
            )}

            {/* Playback button */}
            {recordedUri && (
                <TouchableOpacity style={styles.playBtn} onPress={playRecording}>
                <Ionicons name="play-circle" size={70} color="#808080" />
                    <Text style={styles.btnText}>{t("assignment.playRecording")}</Text>
                </TouchableOpacity>
            )}
            </View>


            {/* Submit button */}
            {recordedUri && (
            <TouchableOpacity style={styles.submitBtn} onPress={submitAnswer}>
                <Text style={styles.submitText}>
                    {isSubmitting ? t("assignment.checking") : t("assignment.submit")}
                </Text>
            </TouchableOpacity>
            )}

            {/* Feedback */}
            {feedback !== "" && <Text style={styles.feedback}>{feedback}</Text>}

            {/* Next card */}
            <View style={styles.controlsRow}>
            {feedback !== "" && (
            <>
            <TouchableOpacity style={styles.retryBtn} onPress={handleRetry}>
                <Text style={styles.nextText}>{t("assignment.retry")}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
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
        paddingHorizontal: 15 
    },

    title: { 
        fontSize: 26, 
        fontWeight: "bold", 
        marginTop: 25, 
        marginBottom: 15, 
        color: "#2b3a42", 
        textAlign: "center" 
    },

    row: { 
        flexDirection: "row", 
        marginBottom: 15, 
        alignItems: "center", 
        justifyContent: "center" 
    },

    tag: { 
        backgroundColor: "#a3d9a5", 
        color: "#2a3a2a", 
        fontWeight: "bold", 
        marginRight: 10 
    },

    statusChip: { 
        fontWeight: "bold" 
    },

    completed: { 
        backgroundColor: "#b2f2bb", 
        color: "#1c3b1a" 
    },

    pending: { 
        backgroundColor: "#fff3b0", 
        color: "#8a6d0d" 
    },

    divider: { 
        marginVertical: 15, 
        backgroundColor: "#ddd" 
    },

    infoRow: { 
        flexDirection: "row", 
        justifyContent: "space-between", 
        marginVertical: 10
    },

    infoBox: { 
        flex: 1, 
        alignItems: "center" 
    },

    infoLabel: { 
        fontWeight: "bold", 
        color: "#555", 
        marginBottom: 5 
    },

    infoValue: { 
        fontSize: 16, 
        color: "#222" 
    },

    section: { 
        marginBottom: 10, 
        padding: 15, 
        backgroundColor: "#fff", 
        borderRadius: 12, 
        elevation: 2 
    },

    sectionTitle: { 
        fontSize: 18, 
        fontWeight: "bold", 
        marginBottom: 8, 
        color: "#2b3a42" 
    },

    sectionText: { 
        fontSize: 15, 
        color: "#333", 
        marginBottom: 10 
    },

    centered: { 
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center" 
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

    nextBtn: {
        marginTop: 10,
        marginLeft: 10,
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 12,
        backgroundColor: "#4CAF50",
    },

    retryBtn: {
        marginRight: 10,
        marginTop: 10,
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 12,
        backgroundColor: "#febe00",
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
});

export default AssignmentAudioScreen;
