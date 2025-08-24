// StorybookScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  Dimensions,
  Alert,
  Animated,
  Easing,
} from "react-native";
import {
  Text,
  Button,
  IconButton,
  Card,
  ProgressBar,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

interface Story {
  id: string;
  title: string;
  author: string;
  pages: StoryPage[];
  readingTime: number;
  difficulty: "easy" | "medium" | "hard";
  question: string;
  coverColor: string;
}

interface StoryPage {
  pageNumber: number;
  text: string;
}

const stories: Story[] = [
  {
    id: "1",
    title: "The Little Dinosaur",
    author: "Emily Johnson",
    readingTime: 5,
    difficulty: "easy",
    question: "What lesson did Dino teach you about friendship?",
    coverColor: "#8ECAE6",
    pages: [
      {
        pageNumber: 1,
        text: "Once upon a time, in a land before time, there lived a little dinosaur named Dino.",
      },
      {
        pageNumber: 2,
        text: "Dino loved to explore the forest. He would chase butterflies and play in the streams.",
      },
      {
        pageNumber: 3,
        text: "One day, Dino found a mysterious egg. It was different from any egg he had seen before.",
      },
    ],
  },
  {
    id: "2",
    title: "Adventure in Alphabet Land",
    author: "Michael Chen",
    readingTime: 5,
    difficulty: "medium",
    question: "Which letter adventure did you enjoy the most and why?",
    coverColor: "#FFB4A2",
    pages: [
      {
        pageNumber: 1,
        text: "Alex the Adventurer woke up to find a magical map on his doorstep.",
      },
      {
        pageNumber: 2,
        text: "The map showed a path through Alphabet Land, where each letter had its own kingdom.",
      },
      {
        pageNumber: 3,
        text: "Alex packed his bag with supplies and set off on his grand adventure.",
      },
    ],
  },
  {
    id: "3",
    title: "The Secret Garden",
    author: "Sarah Williams",
    readingTime: 5,
    difficulty: "hard",
    question: "What would you plant in your own secret garden?",
    coverColor: "#83C5BE",
    pages: [
      {
        pageNumber: 1,
        text: "Lily discovered the old iron key while exploring her grandmother's attic.",
      },
      {
        pageNumber: 2,
        text: "The key felt cold and heavy in her hand, with intricate patterns along its bow.",
      },
      {
        pageNumber: 3,
        text: "That night, under the light of a full moon, Lily found the hidden door in the garden wall.",
      },
    ],
  },
  {
    id: "4",
    title: "Space Explorers",
    author: "Carlos Rodriguez",
    readingTime: 5,
    difficulty: "medium",
    question: "What planet would you most like to visit and why?",
    coverColor: "#FFD166",
    pages: [
      {
        pageNumber: 1,
        text: "Zoe and Max built a spaceship from cardboard boxes and their imagination.",
      },
      {
        pageNumber: 2,
        text: "With a countdown from ten, their spaceship launched into the starry night.",
      },
    ],
  },
  {
    id: "5",
    title: "The Friendly Monster",
    author: "Jamie Smith",
    readingTime: 5,
    difficulty: "easy",
    question: "Have you ever made friends with someone who seemed different?",
    coverColor: "#9C89B8",
    pages: [
      {
        pageNumber: 1,
        text: "In a cozy village at the edge of a dark forest, lived a monster named Milo.",
      },
      {
        pageNumber: 2,
        text: "Milo was very friendly, but everyone was afraid of him because he looked different.",
      },
    ],
  },
  {
    id: "6",
    title: "Ocean Discovery",
    author: "Lisa Johnson",
    readingTime: 5,
    difficulty: "medium",
    question: "What sea creature would you like to be and why?",
    coverColor: "#48BFE3",
    pages: [
      {
        pageNumber: 1,
        text: "Sofia received a special snorkel for her birthday that allowed her to breathe underwater.",
      },
      {
        pageNumber: 2,
        text: "She dove into the ocean and discovered a colorful world of coral and amazing sea creatures.",
      },
    ],
  },
];

const StorybookScreen: React.FC = () => {
  const navigation = useNavigation();
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [completedStories, setCompletedStories] = useState<string[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [timeSpent, setTimeSpent] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [selectedStory]);

  const handleStorySelect = (story: Story) => {
    fadeAnim.setValue(0);
    setSelectedStory(story);
    setCurrentPage(0);
  };

  const handleNextPage = () => {
    if (selectedStory && currentPage < selectedStory.pages.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "#4CAF50";
      case "medium":
        return "#FF9800";
      case "hard":
        return "#F44336";
      default:
        return "#9E9E9E";
    }
  };

  if (selectedStory) {
    const isQuestionPage = currentPage === selectedStory.pages.length;
    const readingProgress =
      (currentPage / (selectedStory.pages.length + 1)) * 100;

    return (
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <View
          style={[styles.header, { backgroundColor: selectedStory.coverColor }]}
        >
          <IconButton
            icon="arrow-left"
            size={24}
            onPress={() => setSelectedStory(null)}
            color="white"
          />
          <Text style={[styles.title, { color: "white" }]}>
            {selectedStory.title}
          </Text>
          <View style={{ width: 48 }} />
        </View>

        {!isQuestionPage && (
          <View style={styles.progressContainer}>
            <ProgressBar
              progress={readingProgress / 100}
              color={selectedStory.coverColor}
              style={styles.progressBar}
            />
            <Text style={styles.progressText}>
              Page {currentPage + 1} of {selectedStory.pages.length + 1}
            </Text>
          </View>
        )}

        <View style={styles.pageBackground}>
          <ScrollView contentContainerStyle={styles.pageContainer}>
            {isQuestionPage ? (
              <View style={styles.questionContainer}>
                <Text style={styles.questionLabel}>Your Thoughts</Text>
                <Text style={styles.pageText}>{selectedStory.question}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Write your answer here..."
                  value={answers[selectedStory.id] || ""}
                  onChangeText={(text) =>
                    setAnswers({ ...answers, [selectedStory.id]: text })
                  }
                  multiline
                  textAlignVertical="top"
                />
              </View>
            ) : (
              <View style={styles.textContainer}>
                <View
                  style={[
                    styles.pageNumber,
                    { backgroundColor: selectedStory.coverColor },
                  ]}
                >
                  <Text style={styles.pageNumberText}>{currentPage + 1}</Text>
                </View>
                <Text style={styles.pageText}>
                  {selectedStory.pages[currentPage].text}
                </Text>
              </View>
            )}
          </ScrollView>
        </View>

        <View
          style={[
            styles.navigation,
            { borderTopColor: "#eee", borderTopWidth: 1 },
          ]}
        >
          <Button
            mode="outlined"
            onPress={handlePrevPage}
            disabled={currentPage === 0}
            icon="chevron-left"
            style={styles.navButton}
            labelStyle={styles.buttonLabel}
          >
            Previous
          </Button>

          {isQuestionPage ? (
            <Button
              mode="contained"
              onPress={() => {
                if (
                  !answers[selectedStory.id] ||
                  answers[selectedStory.id].trim() === ""
                ) {
                  Alert.alert(
                    "Answer Required",
                    "Please answer the question to finish the story!"
                  );
                  return;
                }
                setCompletedStories([...completedStories, selectedStory.id]);
                setTimeSpent(timeSpent + selectedStory.readingTime);
                setSelectedStory(null);
                setCurrentPage(0);
              }}
              icon="book-check"
              style={[
                styles.navButton,
                { backgroundColor: selectedStory.coverColor },
              ]}
              labelStyle={styles.buttonLabel}
            >
              Finish Story
            </Button>
          ) : (
            <Button
              mode="contained"
              onPress={handleNextPage}
              icon="chevron-right"
              style={[
                styles.navButton,
                { backgroundColor: selectedStory.coverColor },
              ]}
              labelStyle={styles.buttonLabel}
            >
              Next
            </Button>
          )}
        </View>
      </Animated.View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <IconButton
            icon="clock-outline"
            size={20}
            color="#4A69BD"
            style={styles.statIcon}
          />
          <View style={styles.statTextContainer}>
            <Text style={styles.statText} numberOfLines={2}>
              Read Time: {timeSpent} min
            </Text>
          </View>
        </View>
        <View style={styles.statItem}>
          <IconButton
            icon="book-check"
            size={20}
            color="#4A69BD"
            style={styles.statIcon}
          />
          <View style={styles.statTextContainer}>
            <Text style={styles.statText} numberOfLines={2}>
              Books Read: {completedStories.length}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.storiesContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.libraryTitle}>5-Minute Stories</Text>
        <Text style={styles.librarySubtitle}>
          Perfect for quick reading sessions
        </Text>
        <View style={styles.booksGrid}>
          {stories.map((story, index) => {
            const isUnlocked =
              index === 0 || completedStories.includes(stories[index - 1].id);
            return (
              <View key={story.id} style={styles.bookItem}>
                <Animated.View
                  style={[
                    styles.bookWrapper,
                    { opacity: isUnlocked ? 1 : 0.6 },
                  ]}
                >
                  <View
                    style={[
                      styles.bookCard,
                      { backgroundColor: story.coverColor },
                    ]}
                    onTouchEnd={() => isUnlocked && handleStorySelect(story)}
                  >
                    <View style={styles.bookSpine}></View>
                    <View style={styles.bookContent}>
                      <Text style={styles.bookTitle} numberOfLines={2}>
                        {story.title}
                      </Text>
                      <Text style={styles.bookAuthor}>By {story.author}</Text>
                      <View style={styles.bookMeta}>
                        <View style={styles.metaItem}>
                          <IconButton
                            icon="clock-outline"
                            size={12}
                            color="rgba(0,0,0,0.7)"
                            style={styles.metaIcon}
                          />
                          <Text style={styles.metaText}>
                            {story.readingTime}m
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.difficultyBadge,
                            {
                              backgroundColor: getDifficultyColor(
                                story.difficulty
                              ),
                            },
                          ]}
                        >
                          <Text style={styles.difficultyText}>
                            {story.difficulty}
                          </Text>
                        </View>
                      </View>
                    </View>
                    {completedStories.includes(story.id) && (
                      <View style={styles.completedBadge}>
                        <Text style={styles.completedText}>✓</Text>
                      </View>
                    )}
                    {!isUnlocked && (
                      <View style={styles.lockedOverlay}>
                        <IconButton icon="lock" size={20} color="#fff" />
                      </View>
                    )}
                  </View>
                </Animated.View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: "#6A89CC",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  statIcon: {
    margin: 0,
    marginRight: 4,
  },
  statTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  statText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    flexWrap: "wrap",
  },
  libraryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
    marginLeft: 8,
    color: "#333",
  },
  librarySubtitle: {
    fontSize: 14,
    marginBottom: 16,
    marginLeft: 8,
    color: "#666",
  },
  storiesContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  booksGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  bookItem: {
    width: "48%",
    marginBottom: 20,
  },
  bookWrapper: {
    height: 180,
  },
  bookCard: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    overflow: "hidden",
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  bookSpine: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  bookContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "rgba(0,0,0,0.8)",
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 12,
    color: "rgba(0,0,0,0.7)",
    marginBottom: 8,
  },
  bookMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaIcon: {
    margin: 0,
    marginRight: 4,
  },
  metaText: {
    fontSize: 12,
    color: "rgba(0,0,0,0.7)",
  },
  difficultyBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  difficultyText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  completedBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#E8F5E9",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  completedText: {
    color: "#4CAF50",
    fontSize: 14,
    fontWeight: "bold",
  },
  lockedOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  progressContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "white",
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  pageBackground: {
    flex: 1,
    backgroundColor: "#CFEFFF",
  },
  pageContainer: {
    flexGrow: 1,
    padding: 24,
  },
  questionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  questionLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4A69BD",
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  pageNumber: {
    position: "absolute",
    top: -20,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  pageNumberText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  pageText: {
    fontSize: 18,
    lineHeight: 30,
    textAlign: "left",
    color: "#333",
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    alignItems: "center",
    backgroundColor: "white",
  },
  navButton: {
    minWidth: 120,
    borderRadius: 24,
  },
  buttonLabel: {
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    minHeight: 120,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    backgroundColor: "#fff",
    fontSize: 16,
    lineHeight: 24,
    textAlignVertical: "top",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
});

export default StorybookScreen;
