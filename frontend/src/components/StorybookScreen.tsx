// StorybookScreen.tsx
import React, { useState, useEffect } from 'react'
import {
    View,
    StyleSheet,
    ScrollView,
    TextInput,
    Alert,
    Animated,
} from 'react-native'
import { Text, Button, IconButton, ProgressBar } from 'react-native-paper'

interface Story {
    id: string
    title: string
    author: string
    pages: StoryPage[]
    readingTime: number
    difficulty: 'easy' | 'medium' | 'hard'
    question: string
    coverColor: string
}

interface StoryPage {
    pageNumber: number
    text: string
}

const stories: Story[] = [
    {
        id: '1',
        title: 'The Little Elephant and Mama',
        author: 'Emily Johnson',
        readingTime: 5,
        difficulty: 'easy',
        question:
            'What is one thing you enjoy doing with your parent that makes you feel safe?',
        coverColor: '#8ECAE6',
        pages: [
            {
                pageNumber: 1,
                text: 'In the wide savanna, a little elephant named Niko walked closely beside his mother.',
            },
            {
                pageNumber: 2,
                text: 'Whenever Niko felt scared, Mama would wrap her long trunk around him, reminding him he was never alone.',
            },
            {
                pageNumber: 3,
                text: 'One stormy night, Niko realized that as long as Mama was near, he could be brave too.',
            },
        ],
    },
    {
        id: '2',
        title: 'The Bear Family’s Picnic',
        author: 'Michael Chen',
        readingTime: 5,
        difficulty: 'medium',
        question:
            'If you and your parent planned a picnic, what food would you both want to bring?',
        coverColor: '#FFB4A2',
        pages: [
            {
                pageNumber: 1,
                text: 'Deep in the forest, the Bear family packed a basket full of berries, honey, and warm bread.',
            },
            {
                pageNumber: 2,
                text: 'Little Bella Bear helped carry the basket, and her father carried her on his shoulders when she got tired.',
            },
            {
                pageNumber: 3,
                text: 'Together, they laughed, shared food, and enjoyed being a family under the tall trees.',
            },
        ],
    },
    {
        id: '3',
        title: 'The Garden We Grew',
        author: 'Sarah Williams',
        readingTime: 5,
        difficulty: 'hard',
        question:
            'What would you like to grow in a garden together with your parent?',
        coverColor: '#83C5BE',
        pages: [
            {
                pageNumber: 1,
                text: 'Lila and her father found a small patch of land behind their house and decided to make it into a garden.',
            },
            {
                pageNumber: 2,
                text: 'They planted seeds, watered them every day, and pulled out weeds together.',
            },
            {
                pageNumber: 3,
                text: 'Soon, bright flowers and tasty vegetables grew, just like their bond that grew stronger each day.',
            },
        ],
    },
    {
        id: '4',
        title: 'Reaching the Stars Together',
        author: 'Carlos Rodriguez',
        readingTime: 5,
        difficulty: 'medium',
        question:
            'If you and your parent could travel anywhere in space, where would you go?',
        coverColor: '#FFD166',
        pages: [
            {
                pageNumber: 1,
                text: 'Sami built a cardboard rocket, and his mother joined him on the living room floor for the countdown.',
            },
            {
                pageNumber: 2,
                text: 'Together, they imagined flying past the moon, holding hands as they reached for the stars.',
            },
        ],
    },
    {
        id: '5',
        title: 'The Nighttime Story',
        author: 'Jamie Smith',
        readingTime: 5,
        difficulty: 'easy',
        question:
            'What bedtime story do you enjoy most with your parent, and why?',
        coverColor: '#9C89B8',
        pages: [
            {
                pageNumber: 1,
                text: 'Every night, little fox Milo curled up beside his mom as she told him magical stories of forests and skies.',
            },
            {
                pageNumber: 2,
                text: 'Milo’s favorite part wasn’t the stories themselves—it was being close to his mother before sleep.',
            },
        ],
    },
    {
        id: '6',
        title: 'Under the Sea with Dad',
        author: 'Lisa Johnson',
        readingTime: 5,
        difficulty: 'medium',
        question:
            'What is one fun adventure you would like to go on with your parent?',
        coverColor: '#48BFE3',
        pages: [
            {
                pageNumber: 1,
                text: 'Tara and her dad put on their snorkels and splashed into the ocean together.',
            },
            {
                pageNumber: 2,
                text: 'They discovered colorful fish, playful dolphins, and held hands whenever the waves grew strong.',
            },
        ],
    },
]

const StorybookScreen: React.FC = () => {
    const [selectedStory, setSelectedStory] = useState<Story | null>(null)
    const [currentPage, setCurrentPage] = useState(0)
    const [completedStories, setCompletedStories] = useState<string[]>([])
    const [answers, setAnswers] = useState<{ [key: string]: string }>({})
    const [timeSpent, setTimeSpent] = useState(0)
    const [fadeAnim] = useState(new Animated.Value(0))

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start()
    }, [selectedStory, fadeAnim])

    const handleStorySelect = (story: Story) => {
        fadeAnim.setValue(0)
        setSelectedStory(story)
        setCurrentPage(0)
    }

    const handleNextPage = () => {
        if (selectedStory && currentPage < selectedStory.pages.length) {
            setCurrentPage(currentPage + 1)
        }
    }

    const handlePrevPage = () => {
        if (currentPage > 0) setCurrentPage(currentPage - 1)
    }

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'easy':
                return '#4CAF50'
            case 'medium':
                return '#FF9800'
            case 'hard':
                return '#F44336'
            default:
                return '#9E9E9E'
        }
    }

    if (selectedStory) {
        const isQuestionPage = currentPage === selectedStory.pages.length
        const readingProgress =
            (currentPage / (selectedStory.pages.length + 1)) * 100

        return (
            <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
                <View
                    style={[
                        styles.header,
                        { backgroundColor: selectedStory.coverColor },
                    ]}
                >
                    <IconButton
                        icon="arrow-left"
                        size={24}
                        onPress={() => setSelectedStory(null)}
                        iconColor="white"
                    />
                    <Text style={[styles.title, { color: 'white' }]}>
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
                            Page {currentPage + 1} of{' '}
                            {selectedStory.pages.length + 1}
                        </Text>
                    </View>
                )}

                <View style={styles.pageBackground}>
                    <ScrollView contentContainerStyle={styles.pageContainer}>
                        {isQuestionPage ? (
                            <View style={styles.questionContainer}>
                                <Text style={styles.questionLabel}>
                                    Your Thoughts
                                </Text>
                                <Text style={styles.pageText}>
                                    {selectedStory.question}
                                </Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Write your answer here..."
                                    value={answers[selectedStory.id] || ''}
                                    onChangeText={(text) =>
                                        setAnswers({
                                            ...answers,
                                            [selectedStory.id]: text,
                                        })
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
                                        {
                                            backgroundColor:
                                                selectedStory.coverColor,
                                        },
                                    ]}
                                >
                                    <Text style={styles.pageNumberText}>
                                        {currentPage + 1}
                                    </Text>
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
                        { borderTopColor: '#eee', borderTopWidth: 1 },
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
                                    answers[selectedStory.id].trim() === ''
                                ) {
                                    Alert.alert(
                                        'Answer Required',
                                        'Please answer the question to finish the story!'
                                    )
                                    return
                                }
                                setCompletedStories([
                                    ...completedStories,
                                    selectedStory.id,
                                ])
                                setTimeSpent(
                                    timeSpent + selectedStory.readingTime
                                )
                                setSelectedStory(null)
                                setCurrentPage(0)
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
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <IconButton
                        icon="clock-outline"
                        size={20}
                        iconColor="#4A69BD"
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
                        iconColor="#4A69BD"
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
                            index === 0 ||
                            completedStories.includes(stories[index - 1].id)
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
                                            {
                                                backgroundColor:
                                                    story.coverColor,
                                            },
                                        ]}
                                        onTouchEnd={() =>
                                            isUnlocked &&
                                            handleStorySelect(story)
                                        }
                                    >
                                        <View style={styles.bookSpine}></View>
                                        <View style={styles.bookContent}>
                                            <Text
                                                style={styles.bookTitle}
                                                numberOfLines={2}
                                            >
                                                {story.title}
                                            </Text>
                                            <Text style={styles.bookAuthor}>
                                                By {story.author}
                                            </Text>
                                            <View style={styles.bookMeta}>
                                                <View style={styles.metaItem}>
                                                    <IconButton
                                                        icon="clock-outline"
                                                        size={12}
                                                        iconColor="rgba(0,0,0,0.7)"
                                                        style={styles.metaIcon}
                                                    />
                                                    <Text
                                                        style={styles.metaText}
                                                    >
                                                        {story.readingTime}m
                                                    </Text>
                                                </View>
                                                <View
                                                    style={[
                                                        styles.difficultyBadge,
                                                        {
                                                            backgroundColor:
                                                                getDifficultyColor(
                                                                    story.difficulty
                                                                ),
                                                        },
                                                    ]}
                                                >
                                                    <Text
                                                        style={
                                                            styles.difficultyText
                                                        }
                                                    >
                                                        {story.difficulty}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                        {completedStories.includes(
                                            story.id
                                        ) && (
                                            <View style={styles.completedBadge}>
                                                <Text
                                                    style={styles.completedText}
                                                >
                                                    ✓
                                                </Text>
                                            </View>
                                        )}
                                        {!isUnlocked && (
                                            <View style={styles.lockedOverlay}>
                                                <IconButton
                                                    icon="lock"
                                                    size={20}
                                                    iconColor="#fff"
                                                />
                                            </View>
                                        )}
                                    </View>
                                </Animated.View>
                            </View>
                        )
                    })}
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        paddingTop: 16,
        paddingBottom: 12,
        backgroundColor: '#6A89CC',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 12,
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 12,
        backgroundColor: '#fff',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    statIcon: {
        margin: 0,
        marginRight: 4,
    },
    statTextContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    statText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
        flexWrap: 'wrap',
    },
    libraryTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
        marginLeft: 8,
        color: '#333',
    },
    librarySubtitle: {
        fontSize: 14,
        marginBottom: 16,
        marginLeft: 8,
        color: '#666',
    },
    storiesContainer: {
        padding: 16,
        paddingBottom: 24,
    },
    booksGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    bookItem: {
        width: '48%',
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        overflow: 'hidden',
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4,
    },
    bookSpine: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 6,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    bookContent: {
        flex: 1,
        justifyContent: 'space-between',
    },
    bookTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'rgba(0,0,0,0.8)',
        marginBottom: 4,
    },
    bookAuthor: {
        fontSize: 12,
        color: 'rgba(0,0,0,0.7)',
        marginBottom: 8,
    },
    bookMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaIcon: {
        margin: 0,
        marginRight: 4,
    },
    metaText: {
        fontSize: 12,
        color: 'rgba(0,0,0,0.7)',
    },
    difficultyBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
    },
    difficultyText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    completedBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#E8F5E9',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    completedText: {
        color: '#4CAF50',
        fontSize: 14,
        fontWeight: 'bold',
    },
    lockedOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    progressContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: 'white',
    },
    progressBar: {
        height: 8,
        borderRadius: 4,
        marginBottom: 8,
    },
    progressText: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    pageBackground: {
        flex: 1,
        backgroundColor: '#CFEFFF',
    },
    pageContainer: {
        flexGrow: 1,
        padding: 24,
    },
    questionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    questionLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4A69BD',
        marginBottom: 8,
        alignSelf: 'flex-start',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    pageNumber: {
        position: 'absolute',
        top: -20,
        right: 0,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    },
    pageNumberText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    pageText: {
        fontSize: 18,
        lineHeight: 30,
        textAlign: 'left',
        color: '#333',
    },
    navigation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        alignItems: 'center',
        backgroundColor: 'white',
    },
    navButton: {
        minWidth: 120,
        borderRadius: 24,
    },
    buttonLabel: {
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        minHeight: 120,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        marginTop: 16,
        backgroundColor: '#fff',
        fontSize: 16,
        lineHeight: 24,
        textAlignVertical: 'top',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
    },
})

export default StorybookScreen
