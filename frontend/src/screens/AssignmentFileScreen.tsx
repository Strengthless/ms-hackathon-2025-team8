import React, { useState, useEffect } from "react";
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { View, StyleSheet, ScrollView, Linking } from "react-native";
import { Title, Text, Chip, Button, Divider, Portal, Dialog, Card } from "react-native-paper";
import { Video } from "expo-av";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

import { RootStackParamList } from "../AppNavigator";
import { tasks, Task, Status } from "../constants/mockData";
import LoadingAnimation from "../components/LoadingAnimation";

type AssignmentScreenRouteProp = RouteProp<RootStackParamList, "AssignmentFile">;
type AssignmentScreenNavigationProp = StackNavigationProp<RootStackParamList, "AssignmentFile">;

type Props = {
  route: AssignmentScreenRouteProp;
  navigation: AssignmentScreenNavigationProp;
};

const AssignmentFileScreen: React.FC<Props> = ({ route }) => {
    const { t } = useTranslation();
    const { ass_id } = route.params;
    const task: Task | undefined = tasks.find(t => t.id === ass_id);
    const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerAsset | ImagePicker.ImagePickerAsset | null>(null);
    const [pickerVisible, setPickerVisible] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [loading, setLoading] = useState(false);

    // TODO:
    // Fetch assignment details from one endpoint
    // Fetch submission status from another endpoint

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

    // Select Audio File to submit from Files
    const pickFromDocs = async () => {
        setPickerVisible(false);
        setLoading(true);
    
        try {
            let results = await DocumentPicker.getDocumentAsync({
                type: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/flac'],
                copyToCacheDirectory: true,
                multiple: false
            });

    
            if (!results.canceled) {
                setSelectedFile(results.assets[0]);
            }
        } catch (error) {
            console.error("Error picking file:", error);
        } finally {
            setLoading(false);
        }
    };

    // Select Video File to submit from gallery
    const pickFromGallery = async () => {
        setPickerVisible(false);
        setLoading(true);
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Videos, // Images & Videos
              allowsEditing: false,
              quality: 1,
            });

            if (!result.canceled) {
              setSelectedFile(result.assets[0]);
              console.log(result.assets[0].uri);
            }
        } catch (error) {
            console.error("Error picking file:", error);
        } finally {
            setLoading(false);
        }
    };

    const removeFile = () => {
        setSelectedFile(null);
    }

    const confirmSubmission = () => {
        // TODO: Send file to backend
        setLoading(true);
        task.status = Status.Completed; // Update task status
        setTimeout(() => {
            setLoading(false);
            setSelectedFile(null);
            setCompleted(true);
        }, 2000);
    };

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

        {/* Deadline & Points */}
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
            {task.instructionVideo && (
            <Video
                source={{ uri: task.instructionVideo }}
                style={styles.video}
                useNativeControls
            />
            )}
        </View>

        {/* Attachment */}
        {task.assignmentFile && (
        <Card style={styles.attachmentCard} onPress={() => Linking.openURL(task.assignmentFile)}>
            <Card.Content style={styles.attachmentContent}>
            <MaterialIcons name="attach-file" size={28} color="green" />
            <Text style={styles.attachmentText}>{t("assignment.downloadExercise")}</Text>
            </Card.Content>
        </Card>
        )}

        {/* Submission */}
        {completed ? (
        // Completion State
        <View style={styles.completionSection}>
            <MaterialIcons name="check-circle" size={52} color="white" style={styles.icon} />
            <Text style={styles.completionTitle}>{t("assignment.assignmentCompleted")} 🎉</Text>
            <Text style={styles.stars}>{t("assignment.getStars", {stars: task.points})}</Text>
            <Text style={styles.feedback}>{t("assignment.waitForFeedback")}</Text>
        </View>
        ) : loading ? (
        // Loading State
        <View style={styles.section}>
            <LoadingAnimation
            text={
                selectedFile ? t("assignment.submitLoading") : t("assignment.fileLoading")
            }
            />
        </View>
        ) : selectedFile ? (
        // File Selected
        <View style={styles.section}>
            <View style={styles.fileRow}>
            <MaterialIcons name="insert-drive-file" size={24} color="#555" />
            <Text style={styles.fileName}>
                {selectedFile?.name || selectedFile?.fileName}
            </Text>
            <Button icon="delete" onPress={removeFile} compact mode="text" color="red">
            {t("assignment.remove")}
            </Button>
            </View>
            <Button
            mode="contained"
            onPress={confirmSubmission}
            style={styles.submitButton}
            contentStyle={{ paddingVertical: 5 }}
            icon="check"
            >
            {t("assignment.submit")}
            </Button>
        </View>
        ) : (
        // No File Selected
        <>
            <Button
            mode="contained"
            onPress={() => setPickerVisible(true)}
            style={styles.selectButton}
            contentStyle={{ paddingVertical: 5 }}
            icon="file-upload"
            >
            {t("assignment.selectFile")}
            </Button>

            <Portal>
            <Dialog visible={pickerVisible} onDismiss={() => setPickerVisible(false)}>
                <Dialog.Title style={styles.dialogTitle}>Choose File Source</Dialog.Title>
                <Dialog.Content style={styles.dialogContent}>
                <Button onPress={pickFromDocs} icon="file">
                    {t("assignment.browseFiles")}
                </Button>
                <Button onPress={pickFromGallery} icon="video-image">
                    {t("assignment.browseGallery")}
                </Button>
                </Dialog.Content>
            </Dialog>
            </Portal>
        </>
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
    
    video: { 
        width: "100%", 
        height: 200, 
        borderRadius: 12, 
        backgroundColor: "#000" 
    },

    link: { 
        color: "#007aff", 
        textDecorationLine: "underline", 
        fontWeight: "bold", 
        fontSize: 15 
    },

    selectButton: {
        marginVertical: 10,
    },

    fileRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
      },

    fileName: {
        flex: 1,
        marginHorizontal: 10,
        marginVertical: 5,
    },

    submitButton: { 
        backgroundColor: "#2E8B57", 
        borderRadius: 8, 
        fontSize: 15, 
        fontWeight: "bold" 
    },

    centered: { 
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center" 
    },

    dialogTitle: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 5,
    },

    dialogContent: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },

    attachmentCard: {
        marginVertical: 10,
        borderRadius: 8,
        backgroundColor: "#fff",
        overflow: "hidden",
    },

    attachmentContent: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 15,
        paddingHorizontal: 10,
    },

    attachmentText: {
        marginLeft: 10,
        fontSize: 16,
        fontWeight: "bold",
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
        color: "white",
        textAlign: "center",
        opacity: 0.9,
    }
});

export default AssignmentFileScreen;
